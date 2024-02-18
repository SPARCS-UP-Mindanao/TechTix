import { ChangeEvent, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getPresignedUrl } from '@/api/events';
import { useApi } from './useApi';
import { useNotifyToast } from './useNotifyToast';
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

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

export const useFileUpload = (eventId: string, uploadType: string, onChange: (key: string) => void, name?: string) => {
  const api = useApi();
  const { successToast, errorToast } = useNotifyToast();
  const formContext = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getPresignedUrlTrigger = async (entryId: string, fileName: string, fileType: string) => {
    const response = await api.execute(getPresignedUrl(entryId, fileName, fileType));
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

    setIsUploading(true);
    await uploadFile(selectedFileObj);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const uploadFile = async (file: File) => {
    const s3Client = new S3Client({
      region: 'ap-southeast-1',
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID!,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY!
      }
    });

    const { objectKey } = await getPresignedUrlTrigger(eventId, file.name, uploadType);

    // Function to upload a file to S3
    const uploadParams: PutObjectCommandInput = {
      Bucket: import.meta.env.VITE_S3_BUCKET!,
      Key: objectKey,
      Body: file
    };

    try {
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);
      setUploadProgress(100);

      successToast({
        title: 'File Upload Success',
        description: 'File uploaded successfully'
      });

      onChange(objectKey);
    } catch (err) {
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
