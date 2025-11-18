import { useViewInternship } from '@/api/hooks/useViewInternship';
import { useApproveInternship } from '@/api/hooks/useApproveInternship';
import { useDeclineInternship } from '@/api/hooks/useDeclineInternship';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormattedMessage, useIntl } from 'react-intl';
import { LoaderIcon } from 'lucide-react';
import { formatDateOnlyString } from '@/lib/foundationUtils';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { errorResponseHandler } from '@/lib/errorResponseHandler';
import { toast } from 'sonner';
import { CheckCircle2, XCircle } from 'lucide-react';

interface InternshipViewProps {
    internshipId: string;
    token?: string;
    showActions?: boolean;
}

export function InternshipView({ internshipId, token, showActions = true }: InternshipViewProps) {
    const { data: internship, isLoading, isError, refetch } = useViewInternship(internshipId);
    const intl = useIntl();
    const { mutate: approveInternship, isPending: isApproving } = useApproveInternship();
    const { mutate: declineInternship, isPending: isDeclining } = useDeclineInternship();

    const handleApprove = () => {
        if (!token) {
            toast.error(intl.formatMessage({ id: "Internship.TokenRequired" }));
            return;
        }

        approveInternship({ id: internshipId, token }, {
            onSuccess: () => {
                toast.success(intl.formatMessage({ id: "Internship.ApproveSuccess" }));
                void refetch();
            },
            onError: async (error) => {
                await errorResponseHandler(error as Error, intl);
            }
        });
    };

    const handleDecline = () => {
        if (!token) {
            toast.error(intl.formatMessage({ id: "Internship.TokenRequired" }));
            return;
        }

        declineInternship({ id: internshipId, token }, {
            onSuccess: () => {
                toast.success(intl.formatMessage({ id: "Internship.DeclineSuccess" }));
                void refetch();
            },
            onError: async (error) => {
                await errorResponseHandler(error as Error, intl);
            }
        });
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

    const canApproveOrDecline = internship.state === "Created" && showActions;
    const isPending = isApproving || isDeclining;

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
            <Card>
                <CardHeader>
                    <CardTitle><FormattedMessage id="Internship.View" /></CardTitle>
                    <CardDescription>
                        <FormattedMessage id="Internship.ViewDescription" />
                    </CardDescription>
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
                        {showActions && !canApproveOrDecline && internship.state !== "Created" && (
                            <Field>
                                <div className="pt-6 border-t">
                                    <div className="text-sm text-muted-foreground">
                                        <FormattedMessage id="Internship.ActionNotAvailable" />
                                    </div>
                                </div>
                            </Field>
                        )}
                    </FieldGroup>
                </CardContent>
            </Card>
        </div>
    );
}

