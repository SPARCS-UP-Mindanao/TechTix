import {
  TransactionDetails,
  EWalletPaymentIn,
  GetTransactionDetailsOut,
  PaymentRequestOut,
  CreateDirectDebitPaymentMethodIn,
  CreateDirectDebitPaymentMethodOut,
  DirectDebitPaymentIn
} from '@/model/payments';
import { createApi } from './utils/createApi';

export const getTransactionDetails = (transactionDetails: TransactionDetails) =>
  createApi<GetTransactionDetailsOut>({
    method: 'post',
    apiService: 'payments',
    url: '/transaction/fees',
    body: { ...transactionDetails }
  });

export const createPaymentRequest = (paymentDetails: EWalletPaymentIn) =>
  createApi<PaymentRequestOut>({
    method: 'post',
    apiService: 'payments',
    url: '/e_wallet/payment_method',
    body: { ...paymentDetails }
  });

export const initiateDirectDebitPayment = (paymentDetails: DirectDebitPaymentIn) =>
  createApi<PaymentRequestOut>({
    method: 'post',
    apiService: 'payments',
    url: '/direct-debit/payment_method',
    body: { ...paymentDetails }
  });

export const createDirectDebitPaymentMethod = (paymentMethodDetails: CreateDirectDebitPaymentMethodIn) =>
  createApi<CreateDirectDebitPaymentMethodOut>({
    method: 'post',
    apiService: 'payments',
    url: '/direct-debit/payment_request',
    body: { ...paymentMethodDetails }
  });
