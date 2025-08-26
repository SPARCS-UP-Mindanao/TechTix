import { useFormContext, useWatch } from 'react-hook-form';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import { RegisterFormValues } from '../../hooks/useRegisterForm';

const BasicInfoStep = () => {
  const { control } = useFormContext<RegisterFormValues>();
  const [email] = useWatch({ control, name: ['email'] });

  return (
    <>
      <FormItem name="firstName">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>First Name</FormLabel>
            <Input type="text" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="lastName">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Last Name</FormLabel>
            <Input type="text" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="nickname">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Nickname</FormLabel>
            <Input type="text" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="pronouns">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Pronouns</FormLabel>
            <Input type="text" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>

      {!email && (
        <FormItem name="email">
          {({ field }) => (
            <div className="flex flex-col gap-1">
              <FormLabel>Email</FormLabel>
              <Input type="email" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>
      )}

      <FormItem name="contactNumber">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Phone number</FormLabel>
            <Input type="text" placeholder="09XX XXX XXXX" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="organization">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Affiliation/Organization/Company</FormLabel>
            <Input type="text" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="jobTitle">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Title</FormLabel>
            <Input type="text" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="facebookLink">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Facebook Link</FormLabel>
            <Input type="text" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="linkedInLink">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Linkedin Link</FormLabel>
            <Input type="text" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>
    </>
  );
};

export default BasicInfoStep;
