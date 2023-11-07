import * as React from 'react';
import axios from 'axios';
import { getPresignedUrl } from '@/api/events';
import { useFetchQuery } from '@/hooks/useApi';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import Input from './Input';

interface FileUploadProps {
  entryId: string;
  uploadType: string;
  originalImage?: string;
}

const FileUpload = ({ entryId, uploadType, originalImage }: FileUploadProps) => {
  const { successToast, errorToast } = useNotifyToast();
  const { fetchQuery } = useFetchQuery<any>();
  const [image] = React.useState<string>(originalImage || '');

  const handleFileChange = async (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      await uploadFile(selectedFile);
    }
  };

  const getPresignedUrlTrigger = async (entryId: string, fileName: string, fileType: string) => {
    const response = await fetchQuery(getPresignedUrl(entryId, fileName, fileType));
    return response.data.uploadLink;
  };

  const uploadFile = async (file: any) => {
    try {
      const presignedUrl = await getPresignedUrlTrigger(entryId, file.name, uploadType);
      const response = await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type
        }
      });

      if (response.status === 200) {
        successToast({
          title: 'File Upload Success',
          description: `${file.name} uploaded successfully`
        });
      } else {
        errorToast({
          title: 'File Upload Failed',
          description: `${file.name} upload failed`
        });
      }
    } catch (error) {
      errorToast({
        title: 'File Upload Failed',
        description: `${file.name} upload failed`
      });
    }
  };

  return (
    <>
      <img src={image} />
      <Input onChange={handleFileChange} type="file" />
    </>
  );
};
export default FileUpload;
