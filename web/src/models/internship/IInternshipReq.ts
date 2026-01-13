import type { InternshipType } from './IInternshipDocument';

export interface IInternshipReq {
  name: string,
  description: string | null,
  startDate: string,
  endDate: string,
  year: number,
  semester: string,
  type: InternshipType,
  companyRepresentativeId: string,
  companyId: string,
  studyProgramId?: string | null
}