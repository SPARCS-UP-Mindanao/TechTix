import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';

const UserBioStep = () => {
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

      <FormItem name="email">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Email</FormLabel>
            <Input type="email" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="contactNumber">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Phone number</FormLabel>
            <Input type="text" placeholder="09XX XXX XXXX" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="cityOfResidence">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>City of Residence</FormLabel>
            <Input type="text" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="foodRestrictions">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Food Restrictions</FormLabel>
            <Input type="text" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>
    </>
  );
};

export default UserBioStep;
