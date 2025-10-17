import type { IAddressReq } from "@/models/IAddressReq";
import type { IPersonReq } from "../IPersonReq";

export interface IStudentRegisterReq {
    email: string;
    altMail: string | null;
    person: IPersonReq;
    address: IAddressReq;
}