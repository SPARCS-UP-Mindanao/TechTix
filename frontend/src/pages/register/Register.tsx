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
  const { form, submit } = useRegisterForm();

  const [currentStep, setCurrentStep] = useState(steps[0]);
  const nextStep = () => {
    setCurrentStep((prevStep) => steps[steps.indexOf(prevStep) + 1]);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => steps[steps.indexOf(prevStep) - 1]);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-12 h-12 rounded-full bg-pure-midnight mb-4"></div>
        <img src={sparcsApplicationimage} />
        <FormProvider {...form}>
          <Stepper />
          {currentStep === 'EventDetails' && <EventDetails />}
          {currentStep === 'UserBio' && <RegisterForm1 />}
          {currentStep === 'PersonalInfo' && <RegisterForm2 />}
          {currentStep === 'Summary' && <Summary />}

          {currentStep === 'EventDetails' && <Button onClick={nextStep} className="text-white bg-gradient-to-r from-blue-700 to-pink-500">Register</Button>}
          {currentStep === 'UserBio' &&
            <div className="flex flex-row gap-40">
              <Button onClick={prevStep} className="text-palatinate-blue"><Icon name="CaretLeft" />Back</Button>
              <Button onClick={nextStep} className="bg-palatinate-blue">Next<Icon name="CaretRight" /></Button>
            </div>}
          {currentStep === 'PersonalInfo' &&
            <div className="flex flex-row gap-40">
              <Button onClick={prevStep} className="text-palatinate-blue"><Icon name="CaretLeft" />Back</Button>
              <Button onClick={nextStep} className="bg-palatinate-blue">Next<Icon name="CaretRight" /></Button>
            </div>}
          {currentStep === 'Summary' && <Button onClick={submit} className="bg-palatinate-blue">Submit</Button>}
        </FormProvider>
      </div>
    </>
  );
};

export default Register;
