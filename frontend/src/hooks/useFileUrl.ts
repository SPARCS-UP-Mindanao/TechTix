import { useCallback } from 'react';
import { createQueryKey } from '@/api/utils/createApi';
import { S3Client, GetObjectCommand, GetObjectAclCommandInput } from '@aws-sdk/client-s3';
import { useQuery } from '@tanstack/react-query';

const s3Client = new S3Client({
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID!,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY!
  }
});

export const useFileUrl = (key: string | null) => {
  const getFileUrl = useCallback(async () => {
    const params: GetObjectAclCommandInput = {
      Bucket: import.meta.env.VITE_S3_BUCKET!,
      Key: key!
    };

    const { Body } = await s3Client.send(new GetObjectCommand(params));
    const blob = await new Response(Body as ReadableStream).blob();
    return URL.createObjectURL(blob);
  }, [key]);

  const { data, isFetching } = useQuery({
    queryKey: createQueryKey('getFileUrl', { key }),
    queryFn: async () => getFileUrl(),
    enabled: !!key,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  return {
    fileUrl: data,
    isFetching
  };
};
