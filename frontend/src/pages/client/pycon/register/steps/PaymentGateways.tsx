import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { BPI_LOGO, CHINABANK_LOGO, GCASH_LOGO, MAYA_LOGO, RCBC_LOGO, UPB_LOGO } from '@/assets/paymentGatewaysIcons';
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
      <div
        role="button"
        className={cn(
          'inline-flex cursor-pointer items-center w-full justify-normal p-2 bg-pycon-custard-light hover:bg-pycon-custard rounded-lg outline-0 transition-[background-color,outline]',
          selected && 'outline-2 outline-pycon-orange'
        )}
        onClick={onClick}
      >
        {imgSrc && (
          <div className="h-10 w-[70px] mr-2">
            <img src={imgSrc} className={cn('w-full h-full', paymentChannelCode === 'PAYMAYA' && 'py-2 pt-3')} alt={paymentTitle} />
          </div>
        )}
        <p className="text-pycon-violet font-medium">{paymentTitle}</p>
        <RadioGroupItem pyconStyles className="ml-auto border! border-pycon-orange!" value={paymentChannelCode} checked={selected} />
      </div>
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
      <h4 className="font-nunito text-pycon-custard">Select a payment method:</h4>
      <RadioGroup className="block space-y-2">
        <p className="font-medium font-nunito">eWallets:</p>
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

        <p className="font-medium font-nunito">Direct Debit:</p>
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
