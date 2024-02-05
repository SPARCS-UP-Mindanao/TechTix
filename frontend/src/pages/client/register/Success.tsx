interface SuccessProps {
  eventName: string;
}

const Success = ({ eventName }: SuccessProps) => {
  return (
    <div className="text-center pt-8 space-y-4">
      <p>Thank you for signing up for {eventName}. See you there!</p>
      <p>Please check your email for more details regarding the event.</p>
    </div>
  );
};

export default Success;
