const Success = () => {
  const dpBlastLink = 'https://www.twibbonize.com/careertalks2023';
  return (
    <div className="text-center pt-8 space-y-4">
      <p>Thank you for signing up for Career Talks 2023. See you there!</p>
      <p>Please check your email for more details regarding the event.</p>
      <p>
        You may also participate in our DP Blast{' '}
        <a className="underline text-primary-400" href={dpBlastLink} target="_blank" rel="noopener noreferrer">
          here
        </a>
        .
      </p>
    </div>
  );
};

export default Success;
