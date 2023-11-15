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
  paymentId?: string;
  registrationId?: string;
  createDate?: string;
  updateDate?: string;
  gcashPayment: string;
  referenceNumber?: string;
  discountCode?: string;
  amountPaid: number;
}
