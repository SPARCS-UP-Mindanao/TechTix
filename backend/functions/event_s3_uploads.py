from model.events.event import EventIn
from usecase.event_usecase import EventUsecase

def handler(event, context):
    record = event["Records"][0]
    s3_object_data = record["s3"]["object"]
    object_key = s3_object_data["key"]

    object_key_split = object_key.split('/')
    entry_id = object_key_split[1]
    attribute = object_key_split[2]

    if attribute == 'banner':
        attribute = 'bannerLink'
    elif attribute == 'logo':
        attribute = 'logoLink'

    updated_attribute = {
        attribute: object_key
    }

    event_usecase = EventUsecase()
    return event_usecase.update_event(
        event_id=entry_id,
        event_in=EventIn(**updated_attribute)
    )


# SAMPLE EVENT
# {
#    "Records":[
#       {
#          "eventVersion":"2.1",
#          "eventSource":"aws:s3",
#          "awsRegion":"ap-southeast-1",
#          "eventTime":"2023-10-26T12:14:07.413Z",
#          "eventName":"ObjectCreated:Put",
#          "userIdentity":{
#             "principalId":"AWS:AIDASZQI4WYAVX7D2KPD2"
#          },
#          "requestParameters":{
#             "sourceIPAddress":"18.206.214.215"
#          },
#          "responseElements":{
#             "x-amz-request-id":"V16SNYNC3BV43Q0Z",
#             "x-amz-id-2":"QtxH+pPJ0dWQDq/FUSit/M30VkoqOR4IedqN2LGq6YMbJTMsrO0qi8+Fp/UGuVWiexSJURUQ+jxHeZsXFqqpFs5woiutJKVY"
#          },
#          "s3":{
#             "s3SchemaVersion":"1.0",
#             "configurationId":"7fd40aa3-b2f8-40aa-a994-99f6d0011891",
#             "bucket":{
#                "name":"sparcs-events-bucket",
#                "ownerIdentity":{
#                   "principalId":"AM47AL9XBO42Q"
#                },
#                "arn":"arn:aws:s3:::sparcs-events-bucket"
#             },
#             "object":{
#                "key":"events/01HC75TK4FRK110GVKRNMQY0KN/certificateTemplate",
#                "size":174968,
#                "eTag":"981298720fc4ae0f79154e6e328a2827",
#                "versionId":"3o3D1InmSuYnVvCQkjIFRw8rdeiW5Qpa",
#                "sequencer":"00653A580F537EE068"
#             }
#          }
#       }
#    ]
# }
