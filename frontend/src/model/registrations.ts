export interface RegisterUserInfo {
  firstName: string;
  lastName: string;
  contactNumber: string;
  careerStatus: string;
  yearsOfExperience: string;
  organization: string;
  title: string;
  certificateClaimed: boolean;
  email: string;
  eventId: string;
  registrationId?: string;
  createDate?: string;
  paymentId?: string | null;
  discountCode?: string | null;
  amountPaid?: number | null;
  referenceNumber?: string | null;
  gcashPayment?: string | null;
  gcashPaymentUrl: string | null;
}
