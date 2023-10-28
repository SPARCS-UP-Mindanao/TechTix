import Button from "@/components/Button";
import {
  FormItem,
  FormLabel,
  FormError,
} from "@/components/Form";
import Input from "@/components/Input";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { FormProvider } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";

const Register = () => {
  const { form, submit } = useRegisterForm();

const status = form.watch('status');
const summary = form.watch();
  return (
    <div>
      <h1>Register</h1>
      <FormProvider {...form}>
        <FormItem name="firstName">
          {({ field }) => (
            <div className="flex flex-col items-start mb-5 space-y-2">
              <FormLabel>First Name</FormLabel>
              <Input type="text" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="lastName">
          {({ field }) => (
            <div className="flex flex-col items-start mb-5 space-y-2">
              <FormLabel>Last Name</FormLabel>
              <Input type="text" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="email">
          {({ field }) => (
            <div className="flex flex-col items-start mb-5 space-y-2">
              <FormLabel>Email</FormLabel>
              <Input type="email" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="contactNumber">
          {({ field }) => (
            <div className="flex flex-col items-start mb-5 space-y-2">
              <FormLabel>Contact #</FormLabel>
              <Input type="text" placeholder="09XXXXXXXXX" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="status">
          {({ field }) => (
            <div className="flex flex-col items-start mb-5 space-y-2">
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                </SelectContent>
              </Select>
              <FormError />
            </div>
          )}
        </FormItem>

        {
          status === "Professional" && (
            <FormItem name="yearsOfExperience">
          {({ field }) => (
            <div className="flex flex-col items-start mb-5 space-y-2">
              <FormLabel>Years of Experience</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Years of Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-3">1-3</SelectItem>
                  <SelectItem value="3-5">3-5</SelectItem>
                  <SelectItem value="5-10">5-10</SelectItem>
                  <SelectItem value="10 and above">10 and above</SelectItem>
                </SelectContent>
              </Select>
              <FormError />
            </div>
          )}
        </FormItem>
          )
        }

        <FormItem name="organization">
          {({ field }) => (
            <div className="flex flex-col items-start mb-5 space-y-2">
              <FormLabel optional>Organization</FormLabel>
              <Input type="text" placeholder="Enter organization name" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="title">
          {({ field }) => (
            <div className="flex flex-col items-start mb-5 space-y-2">
              <FormLabel optional>Title</FormLabel>
              <Input type="text" placeholder="Enter organization title" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>

        <Button onClick={submit}>Submit</Button>
      </FormProvider>

      <p>{summary.firstName}</p>
      <p>{summary.lastName}</p>
      <p>{summary.email}</p>
      <p>{summary.contactNumber}</p>
      <p>{summary.status}</p>
      <p>{summary.yearsOfExperience}</p>
      <p>{summary.organization}</p>
      <p>{summary.title}</p>

    </div>
  );
};

export default Register;
