export interface GetTransactionDetailsOut {
  ticket_price: number;
  transaction_fee: number;
  total_price: number;
}

export interface TransactionDetails {
  ticket_price: number;
  payment_method: PaymentMethod;
  payment_channel: eWalletChannelCode | DirectDebitChannelCode;
}

export type PaymentMethod = 'DIRECT_DEBIT' | 'E_WALLET';

export type eWalletChannelCode = 'GCASH' | 'PAYMAYA';

export type DirectDebitChannelCode = 'BPI' | 'UBP' | 'RCBC' | 'CHINABANK';

export type PaymentChannel = eWalletChannelCode | DirectDebitChannelCode;

interface PaymentIn {
  amount: number;
  success_return_url: string;
  failure_return_url: string;
  cancel_return_url?: string;
}

export interface EWalletPaymentIn extends PaymentIn {
  reference_id: string;
  channel_code: eWalletChannelCode;
}

export interface DirectDebitPaymentIn extends PaymentIn {
  email: string;
  given_names: string;
  surname: string;
  channel_code: DirectDebitChannelCode;
}

export interface PaymentRequestOut {
  create_date: string;
  payment_url: string;
  payment_request_id: string;
  reference_id: string;
}
