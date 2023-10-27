from enum import Enum

class EventUploadTypes(Enum):
    BANNER = 'banner'
    LOGO = 'logo'
    CERTIFICATE_TEMPLATE = 'certificateTemplate'

class FileUploadConstants:
    UPLOAD_TYPE = 'uploadType'

class ClientMethods:
    PUT_OBJECT = 'put_object'
    GET_OBJECT = 'get_object'
    
