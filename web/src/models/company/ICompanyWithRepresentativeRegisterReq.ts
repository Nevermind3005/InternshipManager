export interface ICompanyWithRepresentativeRegisterReq {
    // If set, representative will be added to existing company
    companyId?: string;
    // Company info (required if companyId is not set)
    companyName?: string;
    companyAddress?: {
        city: string;
        street: string;
        buildingNumber: string;
        zipCode: string;
    };
    // Representative info
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
}
