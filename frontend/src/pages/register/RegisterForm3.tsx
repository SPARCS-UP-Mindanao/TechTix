import Button from '@/components/Button';
import FileUpload from '@/components/FileUpload';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import { formatMoney, formatPercentage } from '@/utils/functions';
import gcash_qr from '../../assets/gcash.png';
import { Pricing } from '@/model/discount';
import { EVENT_UPLOAD_TYPE, EVENT_OBJECT_KEY_MAP } from '@/model/events';

interface RegisterForm3Props {
  setValue: any;
  receiptUrl: string;
  setReceiptUrl: (value: string) => void;
  checkDiscountCode: () => void;
  pricing: Pricing;
}
const RegisterForm3 = ({ setValue, receiptUrl, setReceiptUrl, checkDiscountCode, pricing }: RegisterForm3Props) => {
  const generateSessionId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  return (
    <>
      <FormItem name="discountCode">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Discount Coupon (Optional)</FormLabel>
            <div className="flex sm:flex-row flex-col gap-2 w-full items-center">
              <Input type="text" placeholder="Enter Discount Coupon Code" className="w-full sm:w-1/2" {...field} />
              <Button className='w-full sm:w-1/2' onClick={checkDiscountCode}>
                Check Code
              </Button>
            </div>
            <FormError />
          </div>
        )}
      </FormItem>
      <hr />
      <div className="flex flex-col items-start gap-5">
        <div className="flex flex-col gap-5 w-full">
          <div className="grid grid-cols-2 gap-5">
            <h4>Price:</h4>
            <p>{formatMoney(pricing.price, 'PHP')}</p>
            <h4>Discount</h4>
            <p>{pricing.discount == 0 ? 'None' : <span>-{formatPercentage(pricing.discount)}</span> }</p>
            <h4>Total</h4>
            <p>{formatMoney(pricing.total, 'PHP')}</p>
          </div>
          <hr />
          <div className="flex flex-col gap-1">
            <h4>Gcash Information</h4 >
            <p>Camyl Magdalyn Tanjay</p>
            <p>09772494796</p>
          </div>
        </div>
        <img src={gcash_qr} className="self-center h-fit w-full max-w-md object-cover" alt="No Image Uploaded" />
      </div>
      <hr />
      <FormItem name="referenceNumber">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Gcash Payment Reference Number</FormLabel>
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
              originalImage={receiptUrl}
              setObjectKeyValue={(value: string) => {
                setValue(EVENT_OBJECT_KEY_MAP.GCASH_PAYMENT, value);
              }}
              setFileUrl={setReceiptUrl}
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
