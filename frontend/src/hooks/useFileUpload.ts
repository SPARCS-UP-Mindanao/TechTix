import { ChangeEvent, useState } from 'react';
import { getPresignedUrl } from '@/api/events';
import { useApi } from './useApi';
import { useNotifyToast } from './useNotifyToast';
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

export const useFileUpload = (eventId: string, uploadType: string, onChange: (key: string) => void) => {
  const api = useApi();
  const { successToast, errorToast } = useNotifyToast();
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

    setIsUploading(true);
    const selectedFileObj = e.target.files[0];

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
        description: `File upload failed`
      });
    }
  };

  return {
    uploadProgress,
    isUploading,
    onFileChange
  };
};
