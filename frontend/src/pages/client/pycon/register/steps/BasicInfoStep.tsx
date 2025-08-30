import { useFormContext, useWatch } from 'react-hook-form';
import { FormItem, FormLabel, FormError, FormDescription } from '@/components/Form';
import Input from '@/components/Input';
import { RegisterFormValues } from '../../hooks/useRegisterForm';

const BasicInfoStep = () => {
  const { control } = useFormContext<RegisterFormValues>();
  const [email] = useWatch({ control, name: ['email'] });

  return (
    <>
      <div className="flex flex-col md:flex-row w-full gap-4">
        <FormItem name="firstName">
          {({ field }) => (
            <div className="flex flex-col gap-1 grow md:basis-1/2">
              <FormLabel className="font-nunito">First Name</FormLabel>
              <Input pyconStyles type="text" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="lastName">
          {({ field }) => (
            <div className="flex flex-col gap-1 grow md:basis-1/2">
              <FormLabel className="font-nunito">Last Name</FormLabel>
              <Input pyconStyles type="text" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-4">
        <FormItem name="nickname">
          {({ field }) => (
            <div className="flex flex-col gap-1 grow md:basis-1/2">
              <FormLabel className="font-nunito">Nickname</FormLabel>
              <Input pyconStyles type="text" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="pronouns">
          {({ field }) => (
            <div className="flex flex-col gap-1 grow md:basis-1/2">
              <FormLabel className="font-nunito">Pronouns</FormLabel>
              <Input pyconStyles type="text" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-4">
        <FormItem name="organization">
          {({ field }) => (
            <div className="flex flex-col gap-1 grow md:basis-1/2">
              <FormLabel className="font-nunito">Affiliation/Organization/Company</FormLabel>
              <Input pyconStyles type="text" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="jobTitle">
          {({ field }) => (
            <div className="flex flex-col gap-1 grow md:basis-1/2">
              <FormLabel className="font-nunito">Title</FormLabel>
              <Input pyconStyles type="text" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-4">
        {!email && (
          <FormItem name="email">
            {({ field }) => (
              <div className="flex flex-col gap-1 grow md:basis-1/2">
                <FormLabel className="font-nunito">Email</FormLabel>
                <Input pyconStyles type="email" {...field} />
                <FormError />
              </div>
            )}
          </FormItem>
        )}

        <FormItem name="contactNumber">
          {({ field }) => (
            <div className="flex flex-col gap-1 md:basis-1/2">
              <FormLabel className="font-nunito">Phone number</FormLabel>
              <Input pyconStyles type="text" placeholder="09XX XXX XXXX" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-4">
        <FormItem name="facebookLink">
          {({ field }) => (
            <div className="flex flex-col gap-1 grow md:basis-1/2">
              <FormLabel className="font-nunito">Facebook Link</FormLabel>
              <FormDescription className="font-nunito text-pycon-custard-light">Links should start with http:// or https://</FormDescription>
              <Input pyconStyles type="text" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="linkedInLink">
          {({ field }) => (
            <div className="flex flex-col gap-1 grow md:basis-1/2">
              <FormLabel className="font-nunito" optional optionalClass="text-pycon-custard-light">
                Linkedin Link
              </FormLabel>
              <FormDescription className="font-nunito text-pycon-custard-light">Links should start with http:// or https://</FormDescription>
              <Input pyconStyles type="text" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>
      </div>
    </>
  );
};

export default BasicInfoStep;
