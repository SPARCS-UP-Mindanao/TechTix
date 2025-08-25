import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { BPI_LOGO, CHINABANK_LOGO, GCASH_LOGO, MAYA_LOGO, RCBC_LOGO, UPB_LOGO } from '@/assets/paymentGatewaysIcons';
import Button from '@/components/Button';
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup';
import { PaymentMethod, eWalletChannelCode, DirectDebitChannelCode, PaymentChannel } from '@/model/payments';
import { cn } from '@/utils/classes';
import { RegisterFormValues } from '@/hooks/useRegisterForm';

interface PaymentOptionProps {
  paymentTitle: string;
  imgSrc?: string;
  currentPaymentChannel?: PaymentChannel | null;
  paymentChannelCode: eWalletChannelCode | DirectDebitChannelCode;
  onClick: () => void;
}
const PaymentOption: FC<PaymentOptionProps> = ({ paymentTitle, imgSrc, paymentChannelCode, currentPaymentChannel, onClick }) => {
  const selected = currentPaymentChannel === paymentChannelCode;
  return (
    <div className="w-full md:w-1/2 px-2">
      <Button
        className={cn(
          'w-full h-auto justify-normal p-2 transition-all',
          selected && 'bg-transparent hover:bg-transparent border border-primary',
          paymentChannelCode === 'BPI' && 'pl-0'
        )}
        variant="outline"
        onClick={onClick}
      >
        <div className="flex flex-row justify-start items-center w-32">
          {imgSrc && (
            <div className="h-10 mr-2">
              <img
                src={imgSrc}
                className={cn('w-full h-full', paymentChannelCode === 'PAYMAYA' && 'py-2 pt-3', paymentChannelCode === 'BPI' && 'py-0')}
                alt={paymentTitle}
              />
            </div>
          )}
          <p className="text-muted-foreground">{paymentTitle}</p>
        </div>
        <RadioGroupItem className="ml-auto" value={paymentChannelCode} checked={selected} />
      </Button>
    </div>
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
      <h4>Select a payment method:</h4>
      <RadioGroup className="block space-y-2">
        <p>eWallets:</p>
        <div className="flex flex-wrap gap-y-2">
          <PaymentOption
            paymentTitle="Gcash"
            paymentChannelCode="GCASH"
            imgSrc={GCASH_LOGO}
            currentPaymentChannel={currentPaymentChannel}
            onClick={() => setEWalletPaymentChannel('GCASH')}
          />
          <PaymentOption
            paymentTitle="Maya"
            paymentChannelCode="PAYMAYA"
            imgSrc={MAYA_LOGO}
            currentPaymentChannel={currentPaymentChannel}
            onClick={() => setEWalletPaymentChannel('PAYMAYA')}
          />
        </div>

        <p>Direct Debit:</p>
        <div className="flex flex-wrap gap-y-2">
          <PaymentOption
            paymentTitle="BPI"
            paymentChannelCode="BPI"
            imgSrc={BPI_LOGO}
            currentPaymentChannel={currentPaymentChannel}
            onClick={() => setDirectDebitPaymentChannel('BPI')}
          />
          <PaymentOption
            paymentTitle="RCBC"
            paymentChannelCode="RCBC"
            imgSrc={RCBC_LOGO}
            currentPaymentChannel={currentPaymentChannel}
            onClick={() => setDirectDebitPaymentChannel('RCBC')}
          />
          <PaymentOption
            paymentTitle="Union Bank"
            paymentChannelCode="UBP"
            imgSrc={UPB_LOGO}
            currentPaymentChannel={currentPaymentChannel}
            onClick={() => setDirectDebitPaymentChannel('UBP')}
          />
          <PaymentOption
            paymentTitle="China Bank"
            paymentChannelCode="CHINABANK"
            imgSrc={CHINABANK_LOGO}
            currentPaymentChannel={currentPaymentChannel}
            onClick={() => setDirectDebitPaymentChannel('CHINABANK')}
          />
        </div>
      </RadioGroup>
    </>
  );
};

export default PaymentGateways;
