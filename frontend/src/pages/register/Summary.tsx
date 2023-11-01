import { useFormContext } from 'react-hook-form';

const Summary = () => {
  const { watch } = useFormContext();
  const summary = watch();
  return (
    <div className="space-y-2 mb-4">
      <h3>Summary</h3>
      <p>Please review the information below before submitting.</p>
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
          <span className="font-bold">Status: </span>
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
      </div>
    </div>
  );
};

export default Summary;
