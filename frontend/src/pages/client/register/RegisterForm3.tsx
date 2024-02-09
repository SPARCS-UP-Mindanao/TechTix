import Button from '@/components/Button';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import { Pricing } from '@/model/discount';
import { PaymentMethod, eWalletChannelCode, DirectDebitChannelCode } from '@/model/payments';
import { formatMoney, formatPercentage } from '@/utils/functions';
import PaymentGateways from '@/pages/register/PaymentGateways';

interface RegisterForm3Props {
  setPaymentChannel: (val: eWalletChannelCode | DirectDebitChannelCode) => void;
  setPaymentMethod: (val: PaymentMethod) => void;
  checkDiscountCode: () => void;
  pricing: Pricing;
}
const RegisterForm3 = ({ setPaymentChannel, setPaymentMethod, checkDiscountCode, pricing }: RegisterForm3Props) => {
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

      <PaymentGateways setPaymentChannel={setPaymentChannel} setPaymentMethod={setPaymentMethod} />

      <hr />
      <div className="flex flex-col items-start gap-5">
        <div className="flex flex-col gap-5 w-full">
          <div className="grid grid-cols-2 gap-5">
            <h4>Price:</h4>
            <p>{formatMoney(pricing.price, 'PHP')}</p>
            <h4>Discount</h4>
            <p>{pricing.discount == 0 ? 'None' : <span>-{formatPercentage(pricing.discount)}</span>}</p>
            <h4>Transaction Fee</h4>
            <p>{formatMoney(pricing.transactionFees, 'PHP')}</p>
            <h4>Total</h4>
            <p>{formatMoney(pricing.total, 'PHP')}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterForm3;
