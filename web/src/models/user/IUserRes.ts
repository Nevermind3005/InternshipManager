import type { IPersonRes } from "./IPersonRes";

export interface IUserRes {
    id: string;
    email: string;
    role: string;
    person: IPersonRes;
}