import { useRegisterForm } from "@/hooks/useRegisterForm";
import { FormProvider } from "react-hook-form";
import sparcsApplicationimage from "@/assets/applicationSpracs.svg";
import { useState } from "react";
import RegisterForm1 from "./RegisterForm1";
import RegisterForm2 from "./RegisterForm2";
import Summary from "./Summary";
import Stepper from "./Stepper";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import EventDetails from "./EventDetails";

const steps = ['EventDetails', 'UserBio', 'PersonalInfo', 'Summary'];

const Register = () => {
  const { form, submit } = useRegisterForm('0');

  const [currentStep, setCurrentStep] = useState(steps[0]); // Start with 'EventDetails' step

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-12 h-12 rounded-full bg-primary-100 mb-4"></div>
        <img src={sparcsApplicationimage} />

        <FormProvider {...form}>
          {currentStep !== 'EventDetails' && <Stepper currentStep={currentStep} />}
          {currentStep !== 'EventDetails' && <h1 className="text-xl">Register</h1>}
          {currentStep === 'EventDetails' && <EventDetails />}
          {currentStep === 'UserBio' && <RegisterForm1 />}
          {currentStep === 'PersonalInfo' && <RegisterForm2 />}
          {currentStep === 'Summary' && <Summary />}

          <div className="flex w-full justify-around">
            {currentStep === 'EventDetails' && (
              <Button onClick={nextStep} className="text-white bg-gradient-to-r from-blue-700 to-pink-500">Register</Button>
            )}
            {currentStep !== 'EventDetails' && (
              <Button onClick={prevStep} className="bg-primary text-primary-500 border border-primary-500">Back<Icon name="CaretLeft" /></Button>
            )}
            {currentStep !== 'EventDetails' && currentStep !== 'Summary' && (
              <Button onClick={nextStep} className="bg-primary-500 text-primary">Next<Icon name="CaretRight" /></Button>
            )}
            {currentStep === 'Summary' && (
              <Button onClick={submit} className="bg-primary-500 text-primary">Submit<Icon name="Check" /></Button>
            )}
          </div>
        </FormProvider>
      </div>
    </>
  );
};

export default Register;