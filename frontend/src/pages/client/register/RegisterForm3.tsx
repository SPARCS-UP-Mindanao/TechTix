import Button from '@/components/Button';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import ImageViewer from '@/components/ImageViewer';
import Input from '@/components/Input';
import { Pricing } from '@/model/discount';
import { Event } from '@/model/events';
import { formatMoney, formatPercentage } from '@/utils/functions';

interface RegisterForm3Props {
  checkDiscountCode: () => void;
  pricing: Pricing;
  event: Event;
}
const RegisterForm3 = ({ checkDiscountCode, pricing, event }: RegisterForm3Props) => {
  return (
    <>
      <FormItem name="discountCode">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Discount Coupon (Optional)</FormLabel>
            <div className="flex sm:flex-row flex-col gap-2 w-full items-center">
              <Input type="text" placeholder="Enter Discount Coupon Code" className="w-full sm:w-1/2" {...field} />
              <Button className="w-full sm:w-1/2" onClick={checkDiscountCode}>
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
            <p>{pricing.discount == 0 ? 'None' : <span>-{formatPercentage(pricing.discount)}</span>}</p>
            <h4>Total</h4>
            <p>{formatMoney(pricing.total, 'PHP')}</p>
          </div>
          <hr />
          <div className="flex flex-col gap-1">
            <h4>Gcash Information</h4>
            <p>{event.gcashName}</p>
            <p>{event.gcashNumber}</p>
          </div>
        </div>
        <ImageViewer objectKey={event.gcashQRCode} className="max-w-md object-cover" alt="No Image Uploaded" />
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
    </>
  );
};

export default RegisterForm3;
