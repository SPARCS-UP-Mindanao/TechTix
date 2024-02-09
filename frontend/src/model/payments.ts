export interface GetTransactionDetailsOut {
  ticket_price: number;
  transaction_fee: number;
  total_price: number;
}

export interface TransactionDetails {
  ticket_price: number;
  payment_method: string;
  payment_channel: string;
}

export type PaymentMethod = 'DIRECT_DEBIT' | 'E_WALLET';

export type eWalletChannelCode = 'GCASH' | 'PAYMAYA';

export type DirectDebitChannelCode = 'BPI' | 'UBP' | 'RCBC' | 'CHINABANK';

export interface EWalletPaymentIn {
  success_return_url: string;
  failure_return_url: string;
  cancel_return_url?: string;
  reference_id: string;
  amount: number;
  channel_code: eWalletChannelCode;
}

export interface DirectDebitPaymentIn {
  given_names: string;
  surname: string;
  email: string;
  channel_code: DirectDebitChannelCode;
  success_return_url: string;
  failure_return_url: string;
  amount: number;
}

export interface PaymentRequestOut {
  create_date: string;
  payment_url: string;
  payment_request_id: string;
  reference_id: string;
}
