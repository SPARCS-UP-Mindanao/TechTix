import Button from '@/components/Button';
import { PaymentMethod, eWalletChannelCode, DirectDebitChannelCode } from '@/model/payments';

interface PaymentGatewaysProps {
  setPaymentChannel: (val: eWalletChannelCode | DirectDebitChannelCode) => void;
  setPaymentMethod: (val: PaymentMethod) => void;
}
function PaymentGateways({ setPaymentChannel, setPaymentMethod }: PaymentGatewaysProps) {
  const eWalletPaymentRequest = (channel: eWalletChannelCode | DirectDebitChannelCode) => {
    setPaymentChannel(channel);
    setPaymentMethod('EWALLET');
  };

  const directDebitPaymentMethod = (channel: DirectDebitChannelCode) => {
    setPaymentChannel(channel);
    setPaymentMethod('DEBIT');
  };

  return (
    <>
      <h4>eWallets:</h4>
      <div className="flex gap-2">
        <Button onClick={() => eWalletPaymentRequest('GCASH')}>Gcash</Button>
        <Button onClick={() => eWalletPaymentRequest('PAYMAYA')}>Maya</Button>
      </div>
      <h4>Direct Debit:</h4>
      <div className="flex gap-2">
        <Button onClick={() => directDebitPaymentMethod('BPI')}>BPI</Button>
        <Button onClick={() => directDebitPaymentMethod('RCBC')}>RCBC</Button>
        <Button onClick={() => directDebitPaymentMethod('UBP')}>UnionBank</Button>
        <Button onClick={() => directDebitPaymentMethod('CHINABANK')}>China Bank</Button>
      </div>
    </>
  );
}

export default PaymentGateways;
