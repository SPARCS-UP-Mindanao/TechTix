from pydantic import BaseModel, Field


class FileUploadOut(BaseModel):
    uploadLink: str = Field(..., title="Upload Link")
    objectKey: str = Field(..., title="Object Key")


class FileDownloadOut(BaseModel):
    downloadLink: str = Field(..., title="Upload Link")
    objectKey: str = Field(..., title="Object Key")
