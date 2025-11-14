import type { IInternshipRes } from "../internship/IInternshipRes";

export interface IPagedInternshipRes {
    items: IInternshipRes[];
    totalCount: number;
    pageSize: number;
}