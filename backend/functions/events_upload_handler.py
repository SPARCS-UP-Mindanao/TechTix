from usecase.event_usecase import EventUsecase


def handler(event, context):
    """Handles an event triggered by an S3 upload

    :param event: The event data, which includes the S3 object data.
    :type event: dict

    :param context: The context in which the event occurred. This is not used in this function.
    :type context: dict

    :return: The result of the update_event_after_s3_upload method of the EventUsecase.
    :rtype: Union[JSONResponse, EventOut]
    """
    _ = context

    record = event['Records'][0]
    s3_object_data = record['s3']['object']
    object_key = s3_object_data['key']

    event_uc = EventUsecase()
    return event_uc.update_event_after_s3_upload(object_key=object_key)
