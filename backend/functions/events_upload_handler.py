from usecase.file_upload_usecase import FileUploadUsecase

def handler(event, context):
    record = event["Records"][0]
    s3_object_data = record["s3"]["object"]

    file_upload_uc = FileUploadUsecase()
    return file_upload_uc.update_event_fields(object_key=s3_object_data["key"])
