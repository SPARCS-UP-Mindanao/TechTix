from enum import Enum

class UploadRoutes(Enum):
    EVENTS = 'events'

class UploadTypes(Enum):
    BANNER = 'banner'
    LOGO = 'logo'
    CERTIFICATE_TEMPLATE = 'certificateTemplate'

class FileUploadConstants:
    UPLOAD_TYPE = 'uploadType'
    ROUTE = 'route'

class ClientMethods:
    PUT_OBJECT = 'put_object'
    GET_OBJECT = 'get_object'
    
