import { GenericReturn } from '@/api/utils/createApi';

interface Props<T> {
  error?: GenericReturn<T>;
  customErrors?: [{ status: number; message: string }];
}

const ErrorPage = <T,>({ error, customErrors }: Props<T>) => {
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
        <div className="text-8xl font-subjectivity font-bold text-transparent gradient-text bg-gradient-to-br from-secondary-pink-400 to-primary-500">
          {errorCode}
        </div>
        <h2 className="text-xl font-raleway font-bold px-5">{getErrorMessage()}</h2>
      </div>
    </div>
  );
};

export default ErrorPage;
