from usecase.event_usecase import EventUsecase


def handler(event, context):
    record = event['Records'][0]
    s3_object_data = record['s3']['object']
    object_key = s3_object_data['key']

    event_uc = EventUsecase()
    return event_uc.update_event_after_s3_upload(object_key=object_key)
