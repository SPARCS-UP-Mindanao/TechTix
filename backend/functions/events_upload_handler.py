from usecase.event_usecase import EventUsecase
from usecase.file_upload_usecase import FileUploadUsecase

def handler(event, context):
    record = event["Records"][0]
    s3_object_data = record["s3"]["object"]

    event_uc = EventUsecase()
    return event_uc.update_fields_after_s3_upload(object_key=s3_object_data["key"])
