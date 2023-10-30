from usecase.event_usecase import EventUsecase
from usecase.file_upload_usecase import FileUploadUsecase

def handler(event, context):
    record = event["Records"][0]
    s3_object_data = record["s3"]["object"]
    object_key = s3_object_data["key"]

    event_uc = EventUsecase()
    file_upload_uc = FileUploadUsecase()
    upload_data = file_upload_uc.get_values_from_object_key(object_key)

    return event_uc.update_fields_after_s3_upload(
        object_key=object_key,
        event_id=upload_data["entry_id"],
        upload_type=upload_data["upload_type"]
    )
