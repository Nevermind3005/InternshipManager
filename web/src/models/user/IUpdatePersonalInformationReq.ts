import type { IAddressReq } from "@/models/IAddressReq";

export interface IUpdatePersonalInformationReq {
    firstName: string;
    lastName: string;
    phone: string;
    address: IAddressReq;
}
