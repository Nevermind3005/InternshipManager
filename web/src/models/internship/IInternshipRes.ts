import type { ICompanyRes } from "../company/ICompanyRes";
import type { IStudyProgramRes } from "../studyProgram/IStudyProgramRes";
import type { IUserRes } from "../user/IUserRes";
import type { InternshipType } from "./IInternshipDocument";

export interface IInternshipRes {
  id: string,
  name: string,
  description: string | null,
  startDate: Date,
  endDate: Date,
  year: number,
  semester: string,
  state: string,
  type: InternshipType,
  isSupportingDocsApprovedByCompany: boolean,
  isReportApprovedByCompany: boolean,
  studentId: string,
  student: IUserRes,
  companyRepresentativeId: string,
  companyRepresentative: IUserRes,
  company: ICompanyRes,
  companyId: string,
  studyProgramId: string | null,
  studyProgram: IStudyProgramRes | null
}