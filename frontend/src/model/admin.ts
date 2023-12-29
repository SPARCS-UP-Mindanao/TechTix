export interface Admin {
    email: string;
    firstName: string;
    lastName: string;
    position: string;
    address: string;
    contactNumber: string;
    entryId?: string;
    createDate?: string;
    updateDate?: string;
    createdBy?: string;
    updatedBy?: string;
    isConfirmed?: boolean;
}