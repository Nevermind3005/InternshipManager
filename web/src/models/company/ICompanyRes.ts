import type { IAddressRes } from "../IAddressRes";

export interface ICompanyRes {
    id: string;
    name: string;
    address: IAddressRes;
}