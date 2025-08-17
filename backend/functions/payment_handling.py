def handler(event, context):
    _ = context
    print('Test', event)
    return {'message': 'hello world!'}
