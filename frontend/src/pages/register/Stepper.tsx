import React from 'react';

const steps = ['UserBio', 'PersonalInfo', 'Summary'];

interface StepperProps {
  currentStep: string;
}

const Stepper = ({ currentStep }: StepperProps) => {
  return (
    <div className="flex items-center">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-9 h-9 rounded-full text-center ${
              step === currentStep
                ? 'bg-primary-500 text-white pt-1'
                : 'bg-primary-100 text-primary-500 pt-1'
            }`}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className="w-9 h-1 bg-primary-500"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
