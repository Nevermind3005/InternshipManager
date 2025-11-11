import type { IAddressReq } from "../IAddressReq";

export interface ICompanyReq {
    name: string;
    address: IAddressReq;
}
