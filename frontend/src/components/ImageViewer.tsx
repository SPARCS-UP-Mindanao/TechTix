import { FC } from 'react';
import { cn } from '@/utils/classes';
import { useFileUrl } from '@/hooks/useFileUrl';
import Skeleton from './Skeleton';

interface FileViewerProps {
  eventId: string;
  objectKey: string | null;
  className?: string;
  alt?: string;
}

const ImageViewer: FC<FileViewerProps> = ({ eventId, objectKey, className, alt }) => {
  const { fileUrl, isFetching } = useFileUrl(eventId, objectKey);
  if (isFetching) {
    return <Skeleton className={cn('h-full', className)} />;
  }

  if (!fileUrl) {
    return <div className={cn('min-w-full h-full', className)} />;
  }

  return <img src={fileUrl} className={cn('w-full h-full', className)} alt={alt} />;
};

export default ImageViewer;
