export interface IInternshipReq {
  name: string,
  description: string | null,
  startDate: string,
  endDate: string,
  year: number,
  semester: string,
  companyRepresentativeId: string,
  companyId: string
}