import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';

const UserBioStep = () => {
  return (
    <>
      <FormItem name="firstName">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>First Name</FormLabel>
            <Input type="text" className="" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="lastName">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Last Name</FormLabel>
            <Input type="text" className="" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="email">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Email</FormLabel>
            <Input type="email" className="" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="contactNumber">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Phone number</FormLabel>
            <Input type="text" placeholder="09XXXXXXXXX" className="" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>
    </>
  );
};

export default UserBioStep;
