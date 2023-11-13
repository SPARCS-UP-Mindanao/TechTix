import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import FileUpload from '@/components/FileUpload';

const RegisterForm3 = () => {
  return (
    <>
      <FormItem name="gcashReferenceNumber" >
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Gcash Reference Number</FormLabel>
            <Input type="text" placeholder="Enter Payment Reference Number" className="" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>
    </>
  );
};

export default RegisterForm3;
