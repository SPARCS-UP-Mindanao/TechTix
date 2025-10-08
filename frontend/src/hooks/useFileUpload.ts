import { ChangeEvent, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getPresignedUrl } from '@/api/events';
import { createApi } from '@/api/utils/createApi';
import { UploadType } from '@/model/events';
import { PresignedUrlResponse } from '@/model/registrations'
import { useApi } from './useApi';
import { useNotifyToast } from './useNotifyToast';

const MAX_FILE_UPLOAD_SIZE = 1e7; // 10MB

const isExtensionAllowed = (fileName: string) => {
  const extensionDot = fileName.lastIndexOf('.');
  const fileExtension = fileName.slice(extensionDot + 1).toLowerCase();

  switch (fileExtension) {
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg':
    case 'webp':
    case 'ico':
    case 'tiff':
      return true;

    default:
      return false;
  }
};

export const useFileUpload = (eventId: string, uploadType: UploadType, onChange: (key: string) => void, name?: string) => {
  const api = useApi();
  const { successToast, errorToast } = useNotifyToast();
  const formContext = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getPresignedUrlTrigger = async (entryId: string, file: File, uploadType: UploadType): Promise<PresignedUrlResponse> => {
    const response = await api.execute(getPresignedUrl(entryId, file.name, uploadType));

    if (!response.data) {
      throw new Error('Could not get presigned URL');
    }

    return response.data as PresignedUrlResponse;
  };

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const selectedFileObj = e.target.files[0];
    const fileName = selectedFileObj.name;

    if (!selectedFileObj) {
      return;
    }

    if (!isExtensionAllowed(fileName)) {
      errorToast({
        title: 'File Upload Failed',
        description: 'File type not allowed. Please upload a valid image format like PNG, JPG, JPEG, or SVG file.'
      });
      name &&
        formContext &&
        formContext.setError(name, {
          type: 'manual',
          message: 'File type not allowed. Please upload a valid image format like PNG, JPG, JPEG, or SVG file.'
        });
      return;
    }

    if (selectedFileObj.size > MAX_FILE_UPLOAD_SIZE) {
      errorToast({
        title: 'File Upload Failed',
        description: 'File size is too large. Please upload a file smaller than 10MB.'
      });
      name &&
        formContext &&
        formContext.setError(name, {
          type: 'manual',
          message: 'File size is too large. Please upload a file smaller than 10MB.'
        });
      return;
    }

    try {
      setIsUploading(true);
      await uploadFile(selectedFileObj);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadFile = async (file: File) => {
    let presignedData: PresignedUrlResponse;

    try {
      presignedData = await getPresignedUrlTrigger(eventId, file, uploadType);
    } catch (err) {
      errorToast({
        title: 'File Setup Failed',
        description: 'Could not prepare the file for upload. Please try again.'
      });
      return;
    }

    const { uploadLink, objectKey } = presignedData;

    const pathParts = objectKey.split('/');

    if (pathParts.length === 0) {
      errorToast({
        title: 'File Upload Failed',
        description: 'File upload failed. Please try again.'
      });
      return;
    }
    const s3FileName: string = pathParts[pathParts.length - 1];

    const renamedFile: File = file.name === s3FileName ? file : new File([file], s3FileName, { type: file.type });

    const uploadApi = createApi({
      method: 'put' as const,
      url: uploadLink,
      headers: { 'Content-Type': file.type },
      body: renamedFile
    });

    try {
      await api.execute(uploadApi);
      setUploadProgress(100);

      successToast({
        title: 'File Upload Success',
        description: 'File uploaded successfully'
      });

      onChange(objectKey);
    } catch (err) {
      errorToast({
        title: 'File Upload Failed',
        description: 'File upload failed. Please try again.'
      });
      return;
    }
  };


  return {
    uploadProgress,
    isUploading,
    onFileChange
  };
};
