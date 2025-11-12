import type { IAddressRes } from "@/models/IAddressRes";

export interface IPersonalInformationRes {
    firstName: string;
    lastName: string;
    phone: string;
    address: IAddressRes;
}
