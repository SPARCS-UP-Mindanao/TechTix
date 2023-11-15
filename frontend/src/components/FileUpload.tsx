import React, { useState } from 'react';
import axios, { AxiosProgressEvent } from 'axios';
import { getPresignedUrl } from '@/api/events';
import { useFetchQuery } from '@/hooks/useApi';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import Input from './Input';
import Label from './Label';
import { Progress } from './Progress';

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
    const selectedFile = e.target.files[0];
    setSelectedFile(selectedFile.name);
    if (selectedFile) {
      await uploadFile(selectedFile);
    }
    const imageUrl = URL.createObjectURL(selectedFile);
    setImage(imageUrl);
    setFileUrl && setFileUrl(imageUrl);
    setIsLoading(false);
    setUploadProgress(0);
  };

  const getPresignedUrlTrigger = async (entryId: string, fileName: string, fileType: string) => {
    const response = await fetchQuery(getPresignedUrl(entryId, fileName, fileType));
    return response.data;
  };

  const uploadFile = async (file: any) => {
    try {
      const { uploadLink, objectKey } = await getPresignedUrlTrigger(entryId, file.name, uploadType);
      const response = await axios.put(uploadLink, file, {
        headers: {
          'Content-Type': file.type
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total == undefined) {
            return;
          }

          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      setObjectKeyValue(objectKey);

      if (response.status === 200) {
        successToast({
          title: 'File Upload Success',
          description: 'File uploaded successfully'
        });
      } else {
        errorToast({
          title: 'File Upload Failed',
          description: `File upload failed`
        });
      }
    } catch (error) {
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
