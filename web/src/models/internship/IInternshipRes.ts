import type { IUserRes } from "../user/IUserRes";
import type { ICompanyRes } from "./company/ICompanyRes";

export interface IInternshipRes {
  id: string,
  name: string,
  description: string | null,
  startDate: Date,
  endDate: Date,
  year: number,
  semester: string,
  studentId: IUserRes,
  companyRepresentativeId: ICompanyRes,
  companyId: IUserRes
}