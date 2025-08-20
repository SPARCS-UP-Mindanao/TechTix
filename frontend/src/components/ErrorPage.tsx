import { GenericReturn } from '@/api/utils/createApi';
import { cn } from '@/utils/classes';

interface Props<T> {
  error?: GenericReturn<T>;
  customErrors?: { status: number; message: string }[];
  errorTitle?: string;
  message?: string;
}

const ErrorPage = <T,>({ error, customErrors, errorTitle, message }: Props<T>) => {
  const errorCode = error?.status || 404;
  const getErrorMessage = () => {
    const customError = customErrors && customErrors?.find((error) => error.status === errorCode);

    if (customError) {
      return customError.message;
    }

    if (errorCode === 404) {
      return `Page not found.\nPlease check the URL and try again.`;
    }

    if (error?.errorData) {
      return `Something went wrong. Please try again\nError code: ${errorCode} \n Error message: ${error?.errorData.message || error?.errorData.detail[0].msg}`;
    }

    return 'Something went wrong. Please try again';
  };

  return (
    <div className="h-screen text-center">
      <div className="flex flex-col items-center h-full" style={{ paddingTop: '15rem' }}>
        <div
          className={cn(
            'font-subjectivity font-bold text-transparent gradient-text bg-linear-to-br from-secondary-pink-400 to-primary-500',
            errorTitle ? 'text-5xl' : 'text-8xl'
          )}
        >
          {errorTitle ?? errorCode}
        </div>
        <h2 className="text-xl font-raleway font-bold p-5">{message ?? getErrorMessage()}</h2>
      </div>
    </div>
  );
};

export default ErrorPage;
