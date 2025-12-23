import type { IApplicationGetRes } from "../application/IApplicationGetRes";

export interface IPagedApplicationsRes {
    items: IApplicationGetRes[];
    totalCount: number;
    pageSize: number;
}