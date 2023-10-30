export interface RegisterUserInfo {
    firstName: string,
    lastName: string,
    contactNumber: string,
    careerStatus: string,
    yearsOfExperience: string,
    organization?: string,
    title?: string,
    certificateClaimed: boolean,
    email: string,
    eventId: string,
    paymentId?: string,
    registrationId?: string,
    createDate?: Date,
    updateDate?: Date
  }