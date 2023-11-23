interface Props {
  error: string;
  message: string;
}

const CustomError = ({ error, message }: Props) => {
  return (
    <div className="h-screen text-center">
      <div className="flex flex-col items-center h-full" style={{ paddingTop: '15rem' }}>
        <div className="text-5xl font-subjectivity font-bold text-transparent gradient-text bg-gradient-to-br from-secondary-pink-400 to-primary-500">
          {error}
        </div>
        <h2 className="text-xl font-raleway p-5">{message}</h2>
      </div>
    </div>
  );
};

export default CustomError;
