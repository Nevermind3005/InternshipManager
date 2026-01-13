import { useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetInternshipDocuments } from '@/api/hooks/useGetInternshipDocuments';
import { useUploadInternshipDocument } from '@/api/hooks/useUploadInternshipDocument';
import { useDeleteInternshipDocument } from '@/api/hooks/useDeleteInternshipDocument';
import { useDownloadInternshipDocument } from '@/api/hooks/useDownloadInternshipDocument';
import { useApproveInternshipDocuments } from '@/api/hooks/useApproveInternshipDocuments';
import { useRejectInternshipDocuments } from '@/api/hooks/useRejectInternshipDocuments';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { errorResponseHandler } from '@/lib/errorResponseHandler';
import { Upload, Download, Trash2, CheckCircle2, XCircle, FileText, Loader2 } from 'lucide-react';
import type { DocumentSlot, IInternshipDocument } from '@/models/internship/IInternshipDocument';

interface InternshipDocumentsProps {
    internshipId: string;
    internshipState: string;
}

export function InternshipDocuments({ internshipId, internshipState }: InternshipDocumentsProps) {
    const intl = useIntl();
    const { role } = useAuthStore();
    const supportingInputRef = useRef<HTMLInputElement>(null);
    const reportInputRef = useRef<HTMLInputElement>(null);

    const { data: documentsStatus, isLoading } = useGetInternshipDocuments(internshipId);
    const { downloadDocument, isDownloading } = useDownloadInternshipDocument();

    const { mutate: uploadDocument, isPending: isUploading } = useUploadInternshipDocument({
        onSuccess: () => {
            toast.success(intl.formatMessage({ id: "Internship.Documents.UploadSuccess" }));
        },
        onError: async (error) => {
            await errorResponseHandler(error, intl);
        }
    });

    const { mutate: deleteDocument, isPending: isDeleting } = useDeleteInternshipDocument({
        onSuccess: () => {
            toast.success(intl.formatMessage({ id: "Internship.Documents.DeleteSuccess" }));
        },
        onError: async (error) => {
            await errorResponseHandler(error, intl);
        }
    });

    const { mutate: approveDocuments, isPending: isApproving } = useApproveInternshipDocuments({
        onSuccess: () => {
            toast.success(intl.formatMessage({ id: "Internship.Documents.ApproveSuccess" }));
        },
        onError: async (error) => {
            await errorResponseHandler(error, intl);
        }
    });

    const { mutate: rejectDocuments, isPending: isRejecting } = useRejectInternshipDocuments({
        onSuccess: () => {
            toast.success(intl.formatMessage({ id: "Internship.Documents.RejectSuccess" }));
        },
        onError: async (error) => {
            await errorResponseHandler(error, intl);
        }
    });

    // Only show documents section if internship is Confirmed or later
    if (internshipState !== 'Confirmed' && internshipState !== 'Approved' && internshipState !== 'Passed') {
        return null;
    }

    if (isLoading || !documentsStatus) {
        return (
            <Card className="mt-6">
                <CardContent className="flex items-center justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    const isStudent = role === 'Student';
    const isCompanyRep = role === 'CompanyRepresentative';
    const isPending = isUploading || isDeleting || isApproving || isRejecting;

    const handleFileSelect = (slot: DocumentSlot, files: FileList | null) => {
        if (!files || files.length === 0) return;
        
        Array.from(files).forEach(file => {
            uploadDocument({ internshipId, slot, file });
        });
    };

    const handleDownload = (documentId: string) => {
        downloadDocument(internshipId, documentId);
    };

    const handleDelete = (documentId: string) => {
        deleteDocument({ internshipId, documentId });
    };

    const canStudentUploadSupporting = isStudent && !documentsStatus.isSupportingDocsApprovedByCompany;
    const canStudentUploadReport = isStudent && !documentsStatus.isReportApprovedByCompany;
    const canCompanyUpload = isCompanyRep;

    const maxSupportingDocs = 3;
    const studentSupportingCount = documentsStatus.studentSupportingDocs.length;
    const companySupportingCount = documentsStatus.companySupportingDocs.length;

    const canAddMoreStudentSupporting = canStudentUploadSupporting && studentSupportingCount < maxSupportingDocs;
    const canAddMoreCompanySupporting = canCompanyUpload && companySupportingCount < maxSupportingDocs;

    // Check if there are any documents to approve
    const hasAnyDocuments = documentsStatus.studentSupportingDocs.length > 0 || 
                           documentsStatus.companySupportingDocs.length > 0 ||
                           documentsStatus.studentReport !== null ||
                           documentsStatus.companyReport !== null;

    const renderDocumentItem = (doc: IInternshipDocument, canDelete: boolean) => (
        <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{doc.fileName}</span>
                <span className="text-xs text-muted-foreground">
                    ({doc.uploadedBy === 'Student' 
                        ? intl.formatMessage({ id: "Internship.Documents.UploadedByStudent" })
                        : intl.formatMessage({ id: "Internship.Documents.UploadedByCompany" })
                    })
                </span>
            </div>
            <div className="flex gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(doc.id)}
                    disabled={isDownloading === doc.id}
                >
                    {isDownloading === doc.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4" />
                    )}
                </Button>
                {canDelete && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                        disabled={isPending}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                )}
            </div>
        </div>
    );

    const renderStatusBadge = (isApproved: boolean) => (
        <span className={`text-xs px-2 py-1 rounded-full ${isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {isApproved 
                ? intl.formatMessage({ id: "Internship.Documents.Status.Approved" })
                : intl.formatMessage({ id: "Internship.Documents.Status.Pending" })
            }
        </span>
    );

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle><FormattedMessage id="Internship.Documents.Title" /></CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Supporting Documents Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                            <FormattedMessage id={
                                documentsStatus.internshipType === 'Unpaid' 
                                    ? "Internship.Documents.Agreement" 
                                    : "Internship.Documents.ContractOrInvoices"
                            } />
                        </h4>
                        {renderStatusBadge(documentsStatus.isSupportingDocsApprovedByCompany)}
                    </div>
                    
                    <div className="space-y-2">
                        {/* Student's documents */}
                        {documentsStatus.studentSupportingDocs.map(doc => 
                            renderDocumentItem(doc, canStudentUploadSupporting && doc.uploadedBy === 'Student')
                        )}
                        
                        {/* Company's documents */}
                        {documentsStatus.companySupportingDocs.map(doc => 
                            renderDocumentItem(doc, false)
                        )}

                        {/* Upload button for student */}
                        {canAddMoreStudentSupporting && (
                            <>
                                <input
                                    ref={supportingInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleFileSelect('Supporting', e.target.files)}
                                    accept=".pdf,.doc,.docx"
                                />
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => supportingInputRef.current?.click()}
                                    disabled={isPending}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    <FormattedMessage id="Internship.Documents.Upload" />
                                    <span className="text-muted-foreground ml-2">
                                        ({studentSupportingCount}/{maxSupportingDocs})
                                    </span>
                                </Button>
                            </>
                        )}

                        {/* Upload button for company */}
                        {canAddMoreCompanySupporting && (
                            <>
                                <input
                                    ref={supportingInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleFileSelect('Supporting', e.target.files)}
                                    accept=".pdf,.doc,.docx"
                                />
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => supportingInputRef.current?.click()}
                                    disabled={isPending}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    <FormattedMessage id="Internship.Documents.UploadSigned" />
                                </Button>
                            </>
                        )}

                        {/* No documents message */}
                        {documentsStatus.studentSupportingDocs.length === 0 && 
                         documentsStatus.companySupportingDocs.length === 0 && 
                         !canStudentUploadSupporting && !canCompanyUpload && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                <FormattedMessage id="Internship.Documents.NoDocuments" />
                            </p>
                        )}
                    </div>
                </div>

                {/* Report Section */}
                <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                            <FormattedMessage id="Internship.Documents.Report" />
                        </h4>
                        {renderStatusBadge(documentsStatus.isReportApprovedByCompany)}
                    </div>
                    
                    <div className="space-y-2">
                        {/* Student's report */}
                        {documentsStatus.studentReport && 
                            renderDocumentItem(documentsStatus.studentReport, canStudentUploadReport)
                        }
                        
                        {/* Company's report */}
                        {documentsStatus.companyReport && 
                            renderDocumentItem(documentsStatus.companyReport, false)
                        }

                        {/* Upload button for student */}
                        {canStudentUploadReport && !documentsStatus.studentReport && (
                            <>
                                <input
                                    ref={reportInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleFileSelect('Report', e.target.files)}
                                    accept=".pdf,.doc,.docx"
                                />
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => reportInputRef.current?.click()}
                                    disabled={isPending}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    <FormattedMessage id="Internship.Documents.Upload" />
                                </Button>
                            </>
                        )}

                        {/* Upload button for company */}
                        {canCompanyUpload && (
                            <>
                                <input
                                    ref={reportInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleFileSelect('Report', e.target.files)}
                                    accept=".pdf,.doc,.docx"
                                />
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => reportInputRef.current?.click()}
                                    disabled={isPending}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    <FormattedMessage id="Internship.Documents.UploadSigned" />
                                </Button>
                            </>
                        )}

                        {/* No documents message */}
                        {!documentsStatus.studentReport && 
                         !documentsStatus.companyReport && 
                         !canStudentUploadReport && !canCompanyUpload && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                <FormattedMessage id="Internship.Documents.NoDocuments" />
                            </p>
                        )}
                    </div>
                </div>

                {/* Approve/Reject buttons for company */}
                {isCompanyRep && hasAnyDocuments && (
                    <div className="flex gap-4 pt-4 border-t">
                        <Button
                            onClick={() => approveDocuments(internshipId)}
                            disabled={isPending}
                            className="flex-1"
                            variant="default"
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            <FormattedMessage id="Internship.Documents.Approve" />
                        </Button>
                        <Button
                            onClick={() => rejectDocuments(internshipId)}
                            disabled={isPending}
                            className="flex-1"
                            variant="destructive"
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            <FormattedMessage id="Internship.Documents.Reject" />
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
