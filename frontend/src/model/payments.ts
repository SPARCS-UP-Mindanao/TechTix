export interface GetTransactionDetailsOut {
  ticket_price: number;
  transaction_fee: number;
  total_price: number;
  platform_fee: number;
}

export interface TransactionDetails {
  ticket_price: number;
  payment_method: PaymentMethod;
  payment_channel: eWalletChannelCode | DirectDebitChannelCode;
  platform_fee: number | null;
}

export type PaymentMethod = 'DIRECT_DEBIT' | 'E_WALLET';

export type eWalletChannelCode = 'GCASH' | 'PAYMAYA';

export type DirectDebitChannelCode = 'BPI' | 'UBP' | 'RCBC' | 'CHINABANK';

export type PaymentChannel = eWalletChannelCode | DirectDebitChannelCode;

interface PaymentIn {
  amount: number;
  successReturnUrl: string;
  failureReturnUrl: string;
  cancelReturnUrl?: string;
}

export interface EWalletPaymentIn extends PaymentIn {
  referenceId: string;
  channelCode: eWalletChannelCode;
  eventId: string;
}

export interface DirectDebitPaymentIn extends PaymentIn {
  email: string;
  givenNames: string;
  surname: string;
  channelCode: DirectDebitChannelCode;
  eventId: string;
}

export interface PaymentRequestOut {
  createDate: string;
  paymentUrl: string;
  paymentRequestId: string;
  referenceId: string;
}
