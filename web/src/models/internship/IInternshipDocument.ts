export type DocumentSlot = 'Supporting' | 'Report';
export type DocumentUploader = 'Student' | 'Company';
export type InternshipType = 'Unpaid' | 'Paid';

export interface IInternshipDocument {
    id: string;
    slot: DocumentSlot;
    uploadedBy: DocumentUploader;
    fileName: string;
    uploadedAt: string;
}

export interface IInternshipDocumentsStatus {
    internshipType: InternshipType;
    isSupportingDocsApprovedByCompany: boolean;
    isReportApprovedByCompany: boolean;
    studentSupportingDocs: IInternshipDocument[];
    companySupportingDocs: IInternshipDocument[];
    studentReport: IInternshipDocument | null;
    companyReport: IInternshipDocument | null;
}
