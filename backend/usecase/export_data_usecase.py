import asyncio
import os
from http import HTTPStatus
from io import BytesIO
from pathlib import Path

import httpx
import pandas as pd
from fastapi.responses import JSONResponse
from model.pycon_registrations.pycon_registration import PyconExportData
from openpyxl.drawing.image import Image
from PIL import Image as PilImage
from repository.registrations_repository import RegistrationsRepository
from usecase.pycon_registration_usecase import PyconRegistrationUsecase
from utils.logger import logger


class ExportDataUsecase:
    def __init__(self):
        self.__registrations_repository = RegistrationsRepository()
        self.__pycon_registration_usecase = PyconRegistrationUsecase()
        self.__FIXED_IMAGE_WIDTH_PX = 400
        self.__EXCEL_COLUMN_WIDTH_FACTOR = 0.15
        self.__EXCEL_ROW_HEIGHT_FACTOR = 0.75

    async def export_registrations_to_excel(self, event_id: str, file_name: str):
        """
        Exports an event's registration list to an Excel file, embedding ID images where available.
        :param event_id: The ID of the event to export registrations for.
        :param file_name: The desired name for the output Excel file (without extension).
        :return: JSONResponse indicating success or failure, with the file path if successful.
        """
        try:
            registrations_data = self._fetch_and_prepare_data(event_id)
            if not registrations_data:
                logger.info('No registrations found to export.')
                return JSONResponse(status_code=HTTPStatus.OK, content={'message': 'No registrations to export.'})

            df, column_mapping = self._create_dataframe(registrations_data)
            output_path = await self._write_excel_with_images_async(df, file_name, column_mapping)

            logger.info(f'Successfully exported data to {output_path}')
            return JSONResponse(
                status_code=HTTPStatus.OK, content={'message': f'Data exported to {Path(output_path).name}'}
            )

        except ValueError as e:
            return JSONResponse(status_code=HTTPStatus.BAD_REQUEST, content={'message': str(e)})
        except Exception as e:
            logger.error(f'An unexpected error occurred during Excel export: {e}', exc_info=True)
            return JSONResponse(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                content={'message': f'An error occurred during Excel export: {e}'},
            )

    def _fetch_and_prepare_data(self, event_id: str) -> list[PyconExportData]:
        status, registrations, message = self.__registrations_repository.query_registrations(event_id=event_id)
        if status != HTTPStatus.OK:
            raise ValueError(f'Failed to query registrations: {message}')

        registrations_with_url = [
            self.__pycon_registration_usecase.collect_pre_signed_url_pycon(registration=reg) for reg in registrations
        ]

        export_data = [
            PyconExportData(
                firstName=reg.firstName,
                lastName=reg.lastName,
                nickname=reg.nickname,
                jobTitle=reg.jobTitle,
                email=reg.email,
                contactNumber=reg.contactNumber,
                organization=reg.organization,
                ticketType=reg.ticketType,
                imageIdUrl=getattr(reg, 'imageIdUrl', None),
            )
            for reg in registrations_with_url
        ]

        return export_data

    def _create_dataframe(self, data: list[PyconExportData]) -> tuple[pd.DataFrame, dict]:
        column_mapping = {
            field.name: field.field_info.title
            for field in PyconExportData.__fields__.values()
            if field.name != 'imageIdUrl'
        }

        processed_records = []
        for item in data:
            record = item.dict()
            if 'ticketType' in record and hasattr(record['ticketType'], 'value'):
                record['ticketType'] = record['ticketType'].value
            processed_records.append(record)

        df = pd.DataFrame(processed_records)
        return df, column_mapping

    async def _write_excel_with_images_async(self, df: pd.DataFrame, file_name: str, column_mapping: dict) -> str:
        output_file_name = Path(file_name).with_suffix('.xlsx').name
        output_path = os.path.join(os.getcwd(), output_file_name)

        df_to_excel = df.drop(columns=['imageIdUrl'], errors='ignore')
        df_to_excel['ID Image'] = ''
        df_to_excel.rename(columns=column_mapping, inplace=True)

        with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
            df_to_excel.to_excel(writer, sheet_name='Registrations', index=False)
            worksheet = writer.sheets['Registrations']
            await self._embed_images_async(worksheet, df, df_to_excel.columns)

        return output_path

    async def _download_and_process_image_async(self, client: httpx.AsyncClient, url: str) -> Image | str | None:
        if not url or not isinstance(url, str) or not url.strip():
            return None

        try:
            response = await client.get(url, timeout=30)
            response.raise_for_status()

            input_stream = BytesIO(response.content)

            with PilImage.open(input_stream) as pil_img:
                output_stream = BytesIO()
                pil_img.save(output_stream, format='PNG')

                original_width, original_height = pil_img.size
                if original_width == 0:
                    return 'Error: Invalid image width'
                aspect_ratio = original_height / original_width
                new_height = int(self.__FIXED_IMAGE_WIDTH_PX * aspect_ratio)

            output_stream.seek(0)

            img = Image(output_stream)
            img.width = self.__FIXED_IMAGE_WIDTH_PX
            img.height = new_height
            return img

        except httpx.HTTPStatusError as e:
            logger.error(f'HTTP error for {url}: {e.response.status_code}')
            return f'Error: {e.response.status_code}'
        except httpx.RequestError as e:
            logger.error(f'Network error for {url}: {e}')
            return 'Error: Network issue'
        except Exception as e:
            logger.error(f'Processing error for {url}: {e}')
            return 'Error: Corrupt image'

    async def _embed_images_async(self, worksheet, source_df: pd.DataFrame, final_columns: pd.Index):
        image_column_idx = final_columns.get_loc('ID Image') + 1
        image_column_letter = chr(64 + image_column_idx)
        worksheet.column_dimensions[image_column_letter].width = (
            self.__FIXED_IMAGE_WIDTH_PX * self.__EXCEL_COLUMN_WIDTH_FACTOR
        )

        async with httpx.AsyncClient() as client:
            tasks = [
                self._download_and_process_image_async(client, row.get('imageIdUrl')) for _, row in source_df.iterrows()
            ]
            results = await asyncio.gather(*tasks)

        for idx, result in enumerate(results):
            row_idx = idx + 2

            if result is None:
                continue

            if isinstance(result, Image):
                img = result
                worksheet.row_dimensions[row_idx].height = img.height * self.__EXCEL_ROW_HEIGHT_FACTOR
                worksheet.add_image(img, f'{image_column_letter}{row_idx}')
            else:
                worksheet.cell(row=row_idx, column=image_column_idx, value=str(result))
