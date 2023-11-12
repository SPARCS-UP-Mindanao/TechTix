import * as React from 'react';
import axios from 'axios';
import { getPresignedUrl } from '@/api/events';
import { useFetchQuery } from '@/hooks/useApi';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import Input from './Input';

interface FileUploadProps {
  entryId: string;
  uploadType: string;
  setObjectKeyValue: (value: string) => void;
  originalImage?: string;
}

const FileUpload = ({ entryId, uploadType, setObjectKeyValue, originalImage }: FileUploadProps) => {
  const { successToast, errorToast } = useNotifyToast();
  const { fetchQuery } = useFetchQuery<any>();
  const [image, setImage] = React.useState<string>(originalImage || '');

  const handleFileChange = async (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      await uploadFile(selectedFile);
    }
    setImage(URL.createObjectURL(selectedFile));
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
        }
      });

      setObjectKeyValue(objectKey);

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
      {image && <img src={image} className="h-40 w-fit" alt="No Image Uploaded" />}
      <Input onChange={handleFileChange} type="file" accept="image/*" />
    </>
  );
};
export default FileUpload;
