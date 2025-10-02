import { ChangeEvent, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getPresignedUrl } from '@/api/events';
import { createApi } from '@/api/utils/createApi';
import { UploadType } from '@/model/events';
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

  const getPresignedUrlTrigger = async (entryId: string, file: File, uploadType: UploadType) => {
    const response = await api.execute(getPresignedUrl(entryId, file.name, uploadType));
    return response.data;
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
    const { uploadLink, objectKey } = await getPresignedUrlTrigger(eventId, file, uploadType);

    const url = new URL(uploadLink);
    const pathParts = url.pathname.split('/');
    const s3FileName = pathParts[pathParts.length - 1];

    const renamedFile =
      file.name === s3FileName
        ? file
        : new File([file], s3FileName, { type: file.type });

    const uploadApi = createApi({
      method: 'put',
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
      setIsUploading(false);
      console.error('Error', err);
      errorToast({
        title: 'File Upload Failed',
        description: 'File upload failed. Please try again.'
      });
    }
  };

  return {
    uploadProgress,
    isUploading,
    onFileChange
  };
};
