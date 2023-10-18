import { useRegisterForm } from "@/hooks/useRegisterForm";
import React from "react";
import { FormProvider } from "react-hook-form";

const Register = () => {
  const { form, handleSubmit } = useRegisterForm();
  return (
    <div>
      <h1>Register</h1>
      <FormProvider {...form}>
        <input type="text" name="email" />
        <input type="password" name="password" />
        <button onClick={handleSubmit}>Submit</button>
      </FormProvider>
    </div>
  );
};

export default Register;
