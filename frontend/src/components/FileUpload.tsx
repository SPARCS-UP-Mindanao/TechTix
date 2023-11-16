import React, { useState } from 'react';
import { getPresignedUrl } from '@/api/events';
import { useFetchQuery } from '@/hooks/useApi';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import Input from './Input';
import Label from './Label';
import { Progress } from './Progress';
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

interface FileUploadProps {
  entryId: string;
  uploadType: string;
  setObjectKeyValue: (value: string) => void;
  setFileUrl?: (value: string) => void;
  originalImage?: string;
}

const FileUpload = ({ entryId, uploadType, setObjectKeyValue, setFileUrl, originalImage }: FileUploadProps) => {
  const { successToast, errorToast } = useNotifyToast();
  const { fetchQuery } = useFetchQuery<any>();
  const [image, setImage] = useState<string>(originalImage || '');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState('No file chosen');

  const handleFileChange = async (e: any) => {
    setIsLoading(true);
    const selectedFileObj = e.target.files[0];
    setSelectedFile(selectedFileObj.name);
    if (selectedFileObj) {
      await uploadFile(selectedFileObj);
    }
    setIsLoading(false);
    setUploadProgress(0);
  };

  const getPresignedUrlTrigger = async (entryId: string, fileName: string, fileType: string) => {
    const response = await fetchQuery(getPresignedUrl(entryId, fileName, fileType));
    return response.data;
  };

  const uploadFile = async (file: any) => {
    const s3Client = new S3Client({
      region: 'ap-southeast-1',
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID!,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY!
      }
    });
    const { objectKey } = await getPresignedUrlTrigger(entryId, file.name, uploadType);

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
      setObjectKeyValue(objectKey);
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setFileUrl && setFileUrl(imageUrl);
    } catch (err) {
      console.error('Error', err);
      errorToast({
        title: 'File Upload Failed',
        description: `File upload failed`
      });
    }
  };

  return (
    <>
      {image && <img src={image} className="h-40 w-fit" alt="No Image Uploaded" />}
      {isLoading ? (
        <Progress className="w-full max-w-md" value={uploadProgress} />
      ) : (
        <div className="flex flex-row items-center w-full">
          <Input id={`upload-custom-${uploadType}`} onChange={handleFileChange} type="file" accept="image/*" className="hidden" />
          <Label
            htmlFor={`upload-custom-${uploadType}`}
            className="block text-sm mr-4 py-2 px-4
              rounded-md border-0 font-semibold
              hover:cursor-pointer bg-input"
          >
            Choose file
          </Label>
          <Label className="text-sm text-white break-all w-1/2">{selectedFile}</Label>
        </div>
      )}
    </>
  );
};
export default FileUpload;
