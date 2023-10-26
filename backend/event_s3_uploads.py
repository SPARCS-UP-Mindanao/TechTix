def handler(event, context):
    record = event["Records"][0]
    s3_object_data = record["s3"]["object"]
    key = s3_object_data["key"]

    key_split = key.split('/')
    entry_id = key_split[1]
    upload_type = key_split[2]

    print('=========================')
    print(entry_id)
    print(upload_type)
    print('=========================')

    return event
