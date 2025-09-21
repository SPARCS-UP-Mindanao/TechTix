import argparse
import os

from dotenv import load_dotenv

script_dir = os.path.dirname(os.path.abspath(__file__))
parser = argparse.ArgumentParser()
parser.add_argument(
    '--env-file', type=str, default=os.path.join(script_dir, '..', '.env'), help='Path to the .env file'
)
parser.add_argument('--event-id', type=str, required=True, help='Event ID')
parser.add_argument('--file-name', type=str, required=True, help='Output Excel file name')
args = parser.parse_args()
load_dotenv(dotenv_path=args.env_file)

if __name__ == '__main__':
    from usecase.export_data_usecase import ExportDataUsecase

    usecase = ExportDataUsecase()

    response = usecase.export_registrations_to_excel(event_id=args.event_id, file_name=args.file_name)
