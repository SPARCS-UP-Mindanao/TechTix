import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import Button from '@/components/Button';
import { PaymentMethod, eWalletChannelCode, DirectDebitChannelCode, PaymentChannel } from '@/model/payments';
import { cn } from '@/utils/classes';
import { RegisterFormValues } from '@/hooks/useRegisterForm';

interface PaymentOptionProps {
  paymentTitle: string;
  currentPaymentChannel?: PaymentChannel | null;
  paymentChannelCode: eWalletChannelCode | DirectDebitChannelCode;
  onClick: () => void;
}
const PaymentOption: FC<PaymentOptionProps> = ({ paymentTitle, paymentChannelCode, currentPaymentChannel, onClick }) => {
  const selected = currentPaymentChannel === paymentChannelCode;
  return (
    <Button
      className={cn(selected && 'scale-90 bg-primary text-primary-foreground border-none hover:text-primary-foreground')}
      variant="outline"
      onClick={onClick}
    >
      {paymentTitle}
    </Button>
  );
};

interface Props {
  getTransactionFee: () => Promise<void>;
}

const PaymentGateways: FC<Props> = ({ getTransactionFee }) => {
  const { control, setValue } = useFormContext<RegisterFormValues>();

  const currentPaymentChannel = useWatch({ control, name: 'paymentChannel' });
  const setPaymentChannel = (paymentChannel: eWalletChannelCode | DirectDebitChannelCode) => setValue('paymentChannel', paymentChannel);
  const setPaymentMethod = (paymentMethod: PaymentMethod) => setValue('paymentMethod', paymentMethod);

  const setEWalletPaymentChannel = (paymentChannel: eWalletChannelCode) => {
    setPaymentChannel(paymentChannel);
    setPaymentMethod('E_WALLET');
    getTransactionFee();
  };

  const setDirectDebitPaymentChannel = (paymentChannel: DirectDebitChannelCode) => {
    setPaymentChannel(paymentChannel);
    setPaymentMethod('DIRECT_DEBIT');
    getTransactionFee();
  };

  return (
    <>
      <h4>eWallets:</h4>
      <div className="flex gap-2">
        <PaymentOption
          paymentTitle="Gcash"
          paymentChannelCode="GCASH"
          currentPaymentChannel={currentPaymentChannel}
          onClick={() => setEWalletPaymentChannel('GCASH')}
        />
        <PaymentOption
          paymentTitle="Maya"
          paymentChannelCode="PAYMAYA"
          currentPaymentChannel={currentPaymentChannel}
          onClick={() => setEWalletPaymentChannel('PAYMAYA')}
        />
      </div>
      <h4>Direct Debit:</h4>
      <div className="flex gap-2">
        <PaymentOption
          paymentTitle="BPI"
          paymentChannelCode="BPI"
          currentPaymentChannel={currentPaymentChannel}
          onClick={() => setDirectDebitPaymentChannel('BPI')}
        />
        <PaymentOption
          paymentTitle="RCBC"
          paymentChannelCode="RCBC"
          currentPaymentChannel={currentPaymentChannel}
          onClick={() => setDirectDebitPaymentChannel('RCBC')}
        />
        <PaymentOption
          paymentTitle="UBP"
          paymentChannelCode="UBP"
          currentPaymentChannel={currentPaymentChannel}
          onClick={() => setDirectDebitPaymentChannel('UBP')}
        />
        <PaymentOption
          paymentTitle="ChinaBank"
          paymentChannelCode="CHINABANK"
          currentPaymentChannel={currentPaymentChannel}
          onClick={() => setDirectDebitPaymentChannel('CHINABANK')}
        />
      </div>
    </>
  );
};

export default PaymentGateways;
