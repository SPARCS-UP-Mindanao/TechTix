import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import FileUpload from '@/components/FileUpload';
import { EVENT_UPLOAD_TYPE, EVENT_OBJECT_KEY_MAP } from '@/model/events';
import gcash_qr from '../../assets/gcash.png';

const RegisterForm3 = ({setValue}: any) => {
  const generateSessionId = () =>
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  return (
    <>
      <div className='flex flex-col items-start gap-5'>
        <img src={gcash_qr} className="self-center h-fit w-full max-w-md object-cover" alt="No Image Uploaded" />
        <div>
          <p className='font-bold'>Gcash Information</p>
          <p>Camyl Magdalyn Tanjay</p>
          <p>09772494796</p>
        </div>
      </div>
      <FormItem name="discountCode" >
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Discount Coupon (Optional)</FormLabel>
            <Input type="text" placeholder="Enter Discount Coupon Code" className="" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>
      <FormItem name="referenceNumber" >
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Gcash Reference Number</FormLabel>
            <Input type="text" placeholder="Enter Payment Reference Number" className="" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>
      <FormItem name="gcashPayment">
        {({ field }) => (
          <div className="flex flex-col gap-3">
            <FormLabel>Gcash Receipt Screenshot</FormLabel>
            <FileUpload
              entryId={generateSessionId()}
              uploadType={EVENT_UPLOAD_TYPE.PROOF_OF_PAYMENT}
              setObjectKeyValue={(value: string) => {
                setValue(EVENT_OBJECT_KEY_MAP.GCASH_PAYMENT, value);
              }}
              {...field}
            />
            <FormError />
          </div>
        )}
      </FormItem>
    </>
  );
};

export default RegisterForm3;
