export interface ICompanyRegisterReq {
    companyName: string;
    address: {
        city: string;
        street: string;
        buildingNumber: string;
        zipCode: string;
    };
    contactPerson: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
}
