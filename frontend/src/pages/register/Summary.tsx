import { useFormContext } from 'react-hook-form';
import Separator from '@/components/Separator';

interface SummaryProps {
  receiptUrl: string;
}
const Summary = ({ receiptUrl }: SummaryProps) => {
  const { watch } = useFormContext();
  const summary = watch();
  return (
    <div className="space-y-2 mb-4">
      <p className="w-full text-center">Please review the information below before submitting.</p>
      <Separator />
      <div className="space-y-2">
        <div>
          <span className="font-bold">First name: </span>
          <span>{summary.firstName}</span>
        </div>
        <div>
          <span className="font-bold">Last name: </span>
          <span>{summary.lastName}</span>
        </div>
        <div>
          <span className="font-bold">Email: </span>
          <span>{summary.email}</span>
        </div>
        <div>
          <span className="font-bold">Phone number: </span>
          <span>{summary.contactNumber}</span>
        </div>
        <div>
          <span className="font-bold">Professional Status: </span>
          <span>{summary.careerStatus}</span>
        </div>
        <div>
          <span className="font-bold">Years of Experience: </span>
          <span>{summary.yearsOfExperience}</span>
        </div>
        <div>
          <span className="font-bold">Organization: </span>
          <span>{summary.organization}</span>
        </div>
        <div>
          <span className="font-bold">Title: </span>
          <span>{summary.title}</span>
        </div>
        {summary.discountCode && (
          <div>
            <span className="font-bold">Discount Code: </span>
            <span>{summary.discountCode}</span>
          </div>
        )}
        <div>
          <span className="font-bold">Gcash Payment Reference Number: </span>
          <span>{summary.referenceNumber}</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-bold">Gcash Receipt Screenshot: </div>
          <img src={receiptUrl} className="h-40 w-fit" />
        </div>
      </div>
    </div>
  );
};

export default Summary;
