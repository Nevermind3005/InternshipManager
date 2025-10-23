import type { IAddressReq } from "@/models/IAddressReq";

export interface IStudentRegisterReq {
    email: string;
    altMail: string | null;
    address: IAddressReq;
    firstName: string;
    lastName: string;
    phone: string;
}