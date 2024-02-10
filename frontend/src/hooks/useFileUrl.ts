import { useEffect, useState } from 'react';
import { S3Client, GetObjectCommand, GetObjectAclCommandInput } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID!,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY!
  }
});

export const useFileUrl = (key?: string | null) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const getFile = async (): Promise<void> => {
    if (!key) {
      return;
    }

    const params: GetObjectAclCommandInput = {
      Bucket: import.meta.env.VITE_S3_BUCKET!,
      Key: key ?? undefined
    };

    try {
      setLoading(true);
      const { Body } = await s3Client.send(new GetObjectCommand(params));
      const blob = await new Response(Body as ReadableStream).blob();
      setFileUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.log('Error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFile();
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [key]);

  return {
    fileUrl,
    isLoading
  };
};
