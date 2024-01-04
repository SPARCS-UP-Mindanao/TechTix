import { useState, useEffect, FC } from 'react';
import Skeleton from './Skeleton';
import { S3Client, GetObjectCommand, GetObjectCommandInput } from '@aws-sdk/client-s3';

// Initialize the S3 Client outside of the component
const s3Client = new S3Client({
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID!,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY!
  }
});

interface FileViewerComponentProps {
  objectKey?: string | null;
  className?: string;
  alt?: string;
}

const FileViewerComponent: FC<FileViewerComponentProps> = ({ objectKey, className, alt }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const getFile = async (fileName: string): Promise<void> => {
    const getParams: GetObjectCommandInput = {
      Bucket: import.meta.env.VITE_S3_BUCKET!,
      Key: fileName
    };

    try {
      const { Body } = await s3Client.send(new GetObjectCommand(getParams));
      const blob = await new Response(Body as ReadableStream).blob();
      setFileUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Error', err);
    }
  };

  useEffect(() => {
    if (!objectKey) {
      return;
    }

    getFile(objectKey);
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [objectKey]);

  return <>{fileUrl ? <img src={fileUrl} className={className} alt={alt} /> : <Skeleton className={className} />}</>;
};

export default FileViewerComponent;
