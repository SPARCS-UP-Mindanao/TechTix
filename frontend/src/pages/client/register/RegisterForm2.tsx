import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';

const RegisterForm2 = () => {
  return (
    <>
      <FormItem name="careerStatus">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Professional Status</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
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

      <FormItem name="yearsOfExperience">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Years of Experience</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select Years of Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
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

      <FormItem name="organization">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Affiliation</FormLabel>
            <Input type="text" placeholder="Enter affiliation (e.g. SPARCS)" className="" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="title">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Position</FormLabel>
            <Input type="text" placeholder="Enter your position (e.g. Student)" className="" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>
    </>
  );
};

export default RegisterForm2;
