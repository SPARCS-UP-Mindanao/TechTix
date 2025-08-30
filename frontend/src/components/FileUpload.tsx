import { forwardRef, useMemo } from 'react';
import { Loader2, Paperclip, X } from 'lucide-react';
import { UploadType } from '@/model/events';
import { cn } from '@/utils/classes';
import { useFileUpload } from '@/hooks/useFileUpload';
import { CardContainer, CardFooter, CardHeader } from './Card';
import ImageViewer from './ImageViewer';
import Input from './Input';
import Label from './Label';
import Progress from './Progress';

interface FileUploadProps {
  name?: string;
  eventId: string;
  uploadType: UploadType;
  value: string;
  pyconStyles?: boolean;
  onChange: (value: string) => void;
}

const extractImagePath = (path: string) => {
  const name = path.split('/').pop();
  return name;
};

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(({ name, eventId, uploadType, value, onChange, pyconStyles = false }, ref) => {
  const { uploadProgress, isUploading, onFileChange } = useFileUpload(eventId, uploadType, onChange, name);
  const label = useMemo(() => {
    if (!value) {
      return 'No file uploaded';
    }

    return extractImagePath(value) ?? 'Unknown file';
  }, [value]);

  if (pyconStyles) {
    return (
      <div className="flex flex-col gap-y-4 max-w-xl font-nunito!">
        <div className=" bg-pycon-dirty-white rounded-xl h-50">
          {isUploading ? (
            <div className="w-full h-full flex items-center justify-center p-4">
              <Loader2 className="animate-spin text-pycon-red" size={40} />
            </div>
          ) : (
            <>
              {value ? (
                <div className="p-4">
                  <ImageViewer eventId={eventId} objectKey={value} className="h-40 w-min object-cover mx-auto" alt="" />
                </div>
              ) : (
                <label className="cursor-pointer" role="button" htmlFor={`upload-custom-${uploadType}`} aria-disabled={isUploading}>
                  <div className="flex items-center justify-center w-full h-full">
                    <Paperclip size={60} className="text-pycon-red opacity-70" />
                  </div>
                </label>
              )}
            </>
          )}
        </div>

        <div className="inline-flex gap-x-4 items-center">
          <Input id={`upload-custom-${uploadType}`} ref={ref} onChange={onFileChange} type="file" accept="image/*" className="hidden" />
          <Label
            role="button"
            htmlFor={`upload-custom-${uploadType}`}
            aria-disabled={isUploading}
            className={cn(
              'text-sm py-2 px-4 rounded-md bg-pycon-custard-light text-pycon-violet border border-border transition-colors cursor-pointer hover:bg-pycon-custard'
            )}
          >
            Choose a file
          </Label>
          <Label className="text-sm line-clamp-1 max-w-40 break-all w-1/2">{label}</Label>
          {value && (
            <button className="ms-auto disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-70 me-5 cursor-pointer" onClick={() => onChange('')}>
              <X size={25} />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isUploading) {
    return <Progress className="w-full max-w-md" value={uploadProgress} />;
  }

  return (
    <CardContainer className="p-0 border-none shadow-none">
      <CardHeader className="items-center">
        <ImageViewer eventId={eventId} objectKey={value} className="h-40 w-min object-cover" alt="" />
      </CardHeader>
      <CardFooter className="flex flex-wrap px-0 pb-2 gap-2 items-center w-full">
        <Input id={`upload-custom-${uploadType}`} ref={ref} onChange={onFileChange} type="file" accept="image/*" className="hidden" />
        <Label
          role="button"
          htmlFor={`upload-custom-${uploadType}`}
          aria-disabled={isUploading}
          className="text-sm py-2 px-4 rounded-md bg-input border border-border transition-colors hover:cursor-pointer hover:bg-accent"
        >
          Choose file
        </Label>
        <Label className="text-sm line-clamp-1 break-all w-1/2">{label}</Label>
      </CardFooter>
    </CardContainer>
  );
});

export default FileUpload;
