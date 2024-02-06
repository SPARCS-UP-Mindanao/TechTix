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

export interface EWalletPaymentIn {
  success_return_url: string;
  failure_return_url: string;
  cancel_return_url?: string;
  reference_id: string;
  amount: number;
  channel_code: 'GCASH' | 'PAYMAYA';
}

export interface PaymentRequestOut {
  create_date: string;
  payment_url: string;
  payment_request_id: string;
  reference_id: string;
}

export interface CreateDirectDebitPaymentMethodIn {
  given_names: string;
  surname: string;
  email: string; // Validated as an email address
  channel_code: 'BPI' | 'UBP' | 'RCBC' | 'CHINABANK';
  success_return_url: string;
  failure_return_url: string;
}

export interface CreateDirectDebitPaymentMethodOut {
  allow_payment_url: string;
  customer_id: string;
  payment_method_id: string;
  reference_id: string;
  create_date: string;
}

export interface DirectDebitPaymentIn {
  payment_method_id: string;
  callback_url: string;
  reference_id: string;
  amount: number;
}
