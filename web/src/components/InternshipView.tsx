import { useGetInternship } from '@/api/hooks/useGetInternship';
import { useApproveInternship } from '@/api/hooks/useApproveInternship';
import { useDeclineInternship } from '@/api/hooks/useDeclineInternship';
import { useHandlerApproveInternship } from '@/api/hooks/useHandlerApproveInternship';
import { useHandlerRejectInternship } from '@/api/hooks/useHandlerRejectInternship';
import { useHandlerPassInternship } from '@/api/hooks/useHandlerPassInternship';
import { useHandlerFailInternship } from '@/api/hooks/useHandlerFailInternship';
import { useDownloadDocument } from '@/api/hooks/useDownloadDocument';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormattedMessage, useIntl } from 'react-intl';
import { LoaderIcon } from 'lucide-react';
import { formatDateOnlyString } from '@/lib/foundationUtils';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { errorResponseHandler } from '@/lib/errorResponseHandler';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Check, X, Download, LoaderIcon as Loader } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { InternshipDocuments } from '@/components/internship/InternshipDocuments';

interface InternshipViewProps {
    internshipId: string;
    showActions?: boolean;
}

export function InternshipView({ internshipId, showActions = true }: InternshipViewProps) {
    const { data: internship, isLoading, isError, refetch } = useGetInternship(internshipId);
    const intl = useIntl();
    const { role } = useAuthStore();
    const { downloadDocument, isDownloading } = useDownloadDocument();
    
    // Company Representative actions
    const { mutate: approveInternship, isPending: isApproving } = useApproveInternship({
        onSuccess: async () => {
            toast.success(intl.formatMessage({ id: "Internship.ApproveSuccess" }));
            await refetch();
        },
        onError: async (error) => {
            await errorResponseHandler(error, intl);
        }
    });
    const { mutate: declineInternship, isPending: isDeclining } = useDeclineInternship({
        onSuccess: async () => {
            toast.success(intl.formatMessage({ id: "Internship.DeclineSuccess" }));
            await refetch();
        },
        onError: async (error) => {
            await errorResponseHandler(error, intl);
        }
    });

    // Handler actions
    const { mutate: handlerApprove, isPending: isHandlerApproving } = useHandlerApproveInternship({
        onSuccess: async () => {
            toast.success(intl.formatMessage({ id: "Internship.Handler.ApproveSuccess" }));
            await refetch();
        },
        onError: async (error) => {
            await errorResponseHandler(error, intl);
        }
    });
    const { mutate: handlerReject, isPending: isHandlerRejecting } = useHandlerRejectInternship({
        onSuccess: async () => {
            toast.success(intl.formatMessage({ id: "Internship.Handler.RejectSuccess" }));
            await refetch();
        },
        onError: async (error) => {
            await errorResponseHandler(error, intl);
        }
    });
    const { mutate: handlerPass, isPending: isHandlerPassing } = useHandlerPassInternship({
        onSuccess: async () => {
            toast.success(intl.formatMessage({ id: "Internship.Handler.PassSuccess" }));
            await refetch();
        },
        onError: async (error) => {
            await errorResponseHandler(error, intl);
        }
    });
    const { mutate: handlerFail, isPending: isHandlerFailing } = useHandlerFailInternship({
        onSuccess: async () => {
            toast.success(intl.formatMessage({ id: "Internship.Handler.FailSuccess" }));
            await refetch();
        },
        onError: async (error) => {
            await errorResponseHandler(error, intl);
        }
    });

    const handleApprove = () => {
        approveInternship(internshipId);
    };

    const handleDecline = () => {
        declineInternship(internshipId);
    };

    const handleHandlerApprove = () => {
        handlerApprove(internshipId);
    };

    const handleHandlerReject = () => {
        handlerReject(internshipId);
    };

    const handleHandlerPass = () => {
        handlerPass(internshipId);
    };

    const handleHandlerFail = () => {
        handlerFail(internshipId);
    };

    if (isLoading) {
        return (
            <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                <Card>
                    <CardContent className="flex items-center justify-center py-10">
                        <div className="flex items-center gap-2">
                            <LoaderIcon className="size-5 animate-spin" aria-hidden="true" />
                            <span>{intl.formatMessage({ id: "Actions.Loading" })}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isError || !internship) {
        return (
            <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                <Card>
                    <CardHeader>
                        <CardTitle><FormattedMessage id="Internship.View" /></CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <p className="text-sm text-muted-foreground">
                                <FormattedMessage id="Internship.LoadError" />
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const startDateStr = typeof internship.startDate === 'string' 
        ? internship.startDate 
        : internship.startDate instanceof Date 
            ? internship.startDate.toISOString().split('T')[0]
            : new Date(internship.startDate).toISOString().split('T')[0];
    const endDateStr = typeof internship.endDate === 'string' 
        ? internship.endDate 
        : internship.endDate instanceof Date 
            ? internship.endDate.toISOString().split('T')[0]
            : new Date(internship.endDate).toISOString().split('T')[0];

    const canApproveOrDecline = internship.state === "Created" && showActions && role === "CompanyRepresentative";
    const canHandlerApproveOrReject = internship.state === "Confirmed" && showActions && role === "InternshipHandler";
    const canHandlerPassOrFail = internship.state === "Approved" && showActions && role === "InternshipHandler";
    const isPending = isApproving || isDeclining || isHandlerApproving || isHandlerRejecting || isHandlerPassing || isHandlerFailing;
    
    // Determine if internship is in a terminal state (no further actions possible)
    const isTerminalState = internship.state === "Rejected" || internship.state === "Passed" || internship.state === "Failed";
    
    // Determine the appropriate message for when no actions are available
    const getNoActionsMessage = () => {
        if (isTerminalState) {
            return "Internship.InternshipFinalized";
        }
        return "Internship.NoActionsAvailable";
    };

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
            <Card>
                <CardHeader>
                    <CardTitle><FormattedMessage id="Internship.ViewTitle" /></CardTitle>
                </CardHeader>
                <CardContent>
                    <FieldGroup>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-6">
                                <Field>
                                    <FieldLabel className="text-lg font-semibold">
                                        <FormattedMessage id="Internship.InternshipInformation" />
                                    </FieldLabel>
                                </Field>
                                <Field>
                                    <FieldLabel><FormattedMessage id="CreateInternship.Name" /></FieldLabel>
                                    <div className="text-sm text-muted-foreground">{internship.name}</div>
                                </Field>
                                <Field>
                                    <FieldLabel><FormattedMessage id="CreateInternship.Description" /></FieldLabel>
                                    <div className="text-sm text-muted-foreground">
                                        {internship.description || <FormattedMessage id="Internship.NoDescription" />}
                                    </div>
                                </Field>
                                <Field>
                                    <FieldLabel><FormattedMessage id="CreateInternship.StartDate" /></FieldLabel>
                                    <div className="text-sm text-muted-foreground">
                                        {formatDateOnlyString(startDateStr)}
                                    </div>
                                </Field>
                                <Field>
                                    <FieldLabel><FormattedMessage id="CreateInternship.EndDate" /></FieldLabel>
                                    <div className="text-sm text-muted-foreground">
                                        {formatDateOnlyString(endDateStr)}
                                    </div>
                                </Field>
                                <Field>
                                    <FieldLabel><FormattedMessage id="CreateInternship.Year" /></FieldLabel>
                                    <div className="text-sm text-muted-foreground">{internship.year}</div>
                                </Field>
                                <Field>
                                    <FieldLabel><FormattedMessage id="CreateInternship.Semester" /></FieldLabel>
                                    <div className="text-sm text-muted-foreground">
                                        <FormattedMessage id={`Internship.Semester.${internship.semester}`} />
                                    </div>
                                </Field>
                                <Field>
                                    <FieldLabel><FormattedMessage id="Internship.TableHeader.State" /></FieldLabel>
                                    <div className="text-sm text-muted-foreground">
                                        <FormattedMessage id={`Internship.State.${internship.state}`} />
                                    </div>
                                </Field>
                                <Field>
                                    <FieldLabel><FormattedMessage id="Internship.TableHeader.CompanyName" /></FieldLabel>
                                    <div className="text-sm text-muted-foreground">{internship.company?.name}</div>
                                </Field>
                            </div>
                            <div className="space-y-6">
                                <Field>
                                    <FieldLabel className="text-lg font-semibold">
                                        <FormattedMessage id="Internship.StudentInformation" />
                                    </FieldLabel>
                                </Field>
                                <Field>
                                    <FieldLabel><FormattedMessage id="SignUp.firstName" /></FieldLabel>
                                    <div className="text-sm text-muted-foreground">{internship.student?.firstName}</div>
                                </Field>
                                <Field>
                                    <FieldLabel><FormattedMessage id="SignUp.lastName" /></FieldLabel>
                                    <div className="text-sm text-muted-foreground">{internship.student?.lastName}</div>
                                </Field>
                                <Field>
                                    <FieldLabel><FormattedMessage id="Field.Email" /></FieldLabel>
                                    <div className="text-sm text-muted-foreground">{internship.student?.email}</div>
                                </Field>
                                {internship.student?.phone && (
                                    <Field>
                                        <FieldLabel><FormattedMessage id="SignUp.PhoneNumber" /></FieldLabel>
                                        <div className="text-sm text-muted-foreground">{internship.student.phone}</div>
                                    </Field>
                                )}
                            </div>
                        </div>
                        {role === "Student" && (
                            <div className="pt-6 border-t">
                                <Field>
                                    <FieldLabel className="text-lg font-semibold">
                                        <FormattedMessage id="Internship.Documents.Templates" />
                                    </FieldLabel>
                                </Field>
                                <div className="flex flex-col gap-3 mt-4">
                                    <Button
                                        variant="outline"
                                        className="justify-start"
                                        onClick={() => downloadDocument('report')}
                                        disabled={isDownloading !== null}
                                    >
                                        {isDownloading === 'report' ? (
                                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Download className="mr-2 h-4 w-4" />
                                        )}
                                        <FormattedMessage id="Internship.Documents.Report" />
                                        <span className="ml-auto text-muted-foreground text-xs">.docx</span>
                                    </Button>
                                    {/* Agreement is only shown for Unpaid internships */}
                                    {internship.type === 'Unpaid' && (
                                        <Button
                                            variant="outline"
                                            className="justify-start"
                                            onClick={() => downloadDocument('agreement')}
                                            disabled={isDownloading !== null}
                                        >
                                            {isDownloading === 'agreement' ? (
                                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Download className="mr-2 h-4 w-4" />
                                            )}
                                            <FormattedMessage id="Internship.Documents.Agreement" />
                                            <span className="ml-auto text-muted-foreground text-xs">.docx</span>
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        className="justify-start"
                                        onClick={() => downloadDocument('instructions')}
                                        disabled={isDownloading !== null}
                                    >
                                        {isDownloading === 'instructions' ? (
                                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Download className="mr-2 h-4 w-4" />
                                        )}
                                        <FormattedMessage id="Internship.Documents.Instructions" />
                                        <span className="ml-auto text-muted-foreground text-xs">.pdf</span>
                                    </Button>
                                </div>
                            </div>
                        )}
                        {canApproveOrDecline && (
                            <Field>
                                <div className="flex gap-4 pt-6 border-t">
                                    <Button
                                        onClick={handleApprove}
                                        disabled={isPending}
                                        className="flex-1"
                                        variant="default"
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        <FormattedMessage id="Internship.Approve" />
                                    </Button>
                                    <Button
                                        onClick={handleDecline}
                                        disabled={isPending}
                                        className="flex-1"
                                        variant="destructive"
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        <FormattedMessage id="Internship.Decline" />
                                    </Button>
                                </div>
                            </Field>
                        )}
                        {canHandlerApproveOrReject && (
                            <Field>
                                <div className="flex gap-4 pt-6 border-t">
                                    <Button
                                        onClick={handleHandlerApprove}
                                        disabled={isPending}
                                        className="flex-1"
                                        variant="default"
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        <FormattedMessage id="Internship.Handler.Approve" />
                                    </Button>
                                    <Button
                                        onClick={handleHandlerReject}
                                        disabled={isPending}
                                        className="flex-1"
                                        variant="destructive"
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        <FormattedMessage id="Internship.Handler.Reject" />
                                    </Button>
                                </div>
                            </Field>
                        )}
                        {canHandlerPassOrFail && (
                            <Field>
                                <div className="flex gap-4 pt-6 border-t">
                                    <Button
                                        onClick={handleHandlerPass}
                                        disabled={isPending}
                                        className="flex-1"
                                        variant="default"
                                    >
                                        <Check className="mr-2 h-4 w-4" />
                                        <FormattedMessage id="Internship.Handler.Pass" />
                                    </Button>
                                    <Button
                                        onClick={handleHandlerFail}
                                        disabled={isPending}
                                        className="flex-1"
                                        variant="destructive"
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        <FormattedMessage id="Internship.Handler.Fail" />
                                    </Button>
                                </div>
                            </Field>
                        )}
                        {showActions && !canApproveOrDecline && !canHandlerApproveOrReject && !canHandlerPassOrFail && (
                            <Field>
                                <div className="pt-6 border-t">
                                    <div className="text-sm text-muted-foreground">
                                        <FormattedMessage id={getNoActionsMessage()} />
                                    </div>
                                </div>
                            </Field>
                        )}
                    </FieldGroup>
                </CardContent>
            </Card>
            
            {/* Document Management Section - for Student and Company */}
            {(role === "Student" || role === "CompanyRepresentative" || role === "InternshipHandler") && (
                <InternshipDocuments 
                    internshipId={internshipId} 
                    internshipState={internship.state} 
                />
            )}
        </div>
    );
}

