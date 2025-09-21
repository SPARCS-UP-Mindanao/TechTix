import os
from http import HTTPStatus
from io import BytesIO
from pathlib import Path

import pandas as pd
import requests
from fastapi.responses import JSONResponse
from model.pycon_registrations.pycon_registration import PyconExportData
from model.registrations.registration import Registration
from openpyxl import load_workbook
from openpyxl.drawing.image import Image
from PIL import Image as PilImage
from repository.registrations_repository import RegistrationsRepository
from usecase.pycon_registration_usecase import PyconRegistrationUsecase
from utils.logger import logger


class ExportDataUsecase:
    def __init__(self):
        self.__registrations_repository = RegistrationsRepository()
        self.__pycon_registration_usecase = PyconRegistrationUsecase()

    def export_registrations_to_excel(self, event_id: str, file_name: str):
        reg_status, registration, reg_message = self.__registrations_repository.query_registrations(event_id=event_id)

        if reg_status != HTTPStatus.OK:
            return JSONResponse(status_code=reg_status, content={'message': reg_message})

        registration_with_presigned_url = [
            self.__pycon_registration_usecase.collect_pre_signed_url_pycon(registration=reg) for reg in registration
        ]

        export_data_dicts = [
            {
                'firstName': reg.firstName,
                'lastName': reg.lastName,
                'nickname': reg.nickname,
                'jobTitle': reg.jobTitle,
                'email': reg.email,
                'contactNumber': reg.contactNumber,
                'organization': reg.organization,
                'ticketType': str(reg.ticketType),
                'idURL': reg.imageIdUrl,
            }
            for reg in registration_with_presigned_url
        ]

        column_mapping = {}
        for field_name, field_info in PyconExportData.__fields__.items():
            if field_name != 'idURL':
                column_mapping[field_name] = field_info.field_info.title

        df = pd.DataFrame(export_data_dicts)

        df_to_excel = df.drop('idURL', axis=1)

        df_to_excel['ID Image'] = ''
        column_mapping['ID Image'] = 'ID Image'

        df_to_excel.rename(columns=column_mapping, inplace=True)

        output_file_name = Path(file_name).with_suffix('.xlsx').name
        output_path = os.path.join(os.getcwd(), output_file_name)

        try:
            with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
                df_to_excel.to_excel(writer, sheet_name='Registrations', index=False)

                workbook = writer.book
                worksheet = writer.sheets['Registrations']

                FIXED_IMAGE_WIDTH = 400

                image_column_idx = df_to_excel.columns.get_loc('ID Image') + 1
                image_column_letter = chr(65 + image_column_idx - 1)
                worksheet.column_dimensions[image_column_letter].width = FIXED_IMAGE_WIDTH * 0.15

                for index, row in df.iterrows():
                    if row['idURL']:
                        try:
                            response = requests.get(row['idURL'])

                            if response.status_code == HTTPStatus.OK:
                                image_content = response.content

                                with PilImage.open(BytesIO(image_content)) as pil_img:
                                    original_width, original_height = pil_img.size

                                new_height = int((FIXED_IMAGE_WIDTH / original_width) * original_height)

                                image_stream_for_openpyxl = BytesIO(image_content)

                                img = Image(image_stream_for_openpyxl)
                                img.width = FIXED_IMAGE_WIDTH
                                img.height = new_height

                                row_height_in_points = new_height * 0.75
                                worksheet.row_dimensions[index + 2].height = row_height_in_points

                                cell = f'{image_column_letter}{index + 2}'
                                worksheet.add_image(img, cell)

                            else:
                                logger.error(
                                    f"Failed to download image from {row['idURL']}. Status code: {response.status_code}"
                                )
                                worksheet.cell(
                                    row=index + 2, column=image_column_idx
                                ).value = f'Error: {response.status_code}'

                        except Exception as e:
                            logger.error(f"An error occurred while processing image from {row['idURL']}: {e}")
                            worksheet.cell(row=index + 2, column=image_column_idx).value = f'Error: {str(e)}'

            logger.info(f'Successfully exported data to {output_path}')
            return JSONResponse(status_code=HTTPStatus.OK, content={'message': f'Data exported to {output_file_name}'})

        except Exception as e:
            logger.error(f'An error occurred during Excel export: {e}')
            return JSONResponse(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                content={'message': f'An error occurred during Excel export: {e}'},
            )
