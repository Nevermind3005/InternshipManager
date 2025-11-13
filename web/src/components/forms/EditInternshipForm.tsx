import { useEffect, useState } from "react";
import z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { FormattedMessage, useIntl } from "react-intl";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Input } from "../ui/input";
import LoadingButton from "../LoadingButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateInternship } from "@/api/hooks/useUpdateInternship";
import { useGetInternship } from "@/api/hooks/useGetInternship";
import DatePickerField from "../foundation/fields/DatePickerField";
import YearSelectField from "../foundation/fields/YearSelectField";
import { SemesterSelectField } from "../foundation/fields/SemesterSelectField";
import { toDateOnlyString, parseDateOnlyString } from "@/lib/foundationUtils";
import type { IInternshipReq } from "@/models/internship/IInternshipReq";
import CompanySelectField from "../foundation/fields/CompanySelectField";
import CompanyRegisterForm from "./CompanyForm";
import { Button } from "../ui/button";
import type { IUserRes } from "@/models/user/IUserRes";
import { authHttpClient } from "@/api/http";
import { API } from "@/api/api";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon, LoaderIcon } from "lucide-react";
import CompanyRepresentativeForm from "./CompanyRepresentativeForm";
import { errorResponseHandler } from "@/lib/errorResponseHandler";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

const formSchema = z.object({
    name: z
        .string()
        .nonempty()
        .max(120),
    description: z
        .string()
        .max(128),
    startDate: z
        .date(),
    endDate: z
        .date(),
    year: z
        .string(),
    semester: z
        .string(),
    email: z
        .string()
        .email(),
    companyId: z
        .string()
        .uuid(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional(),
    companyRepresentativeId: z.string().uuid().optional(),
});

interface EditInternshipFormProps {
    internshipId: string;
}

const EditInternshipForm = ({ internshipId }: EditInternshipFormProps) => {
    const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
    const [isRepresentativeDialogOpen, setIsRepresentativeDialogOpen] = useState(false);
    const { mutate: updateInternship, isPending } = useUpdateInternship();
    const { data: internship, isLoading, isError, error } = useGetInternship(internshipId);
    const intl = useIntl();
    const [representativeFound, setRepresentativeFound] = useState<boolean | null>(null);
    const [foundRepresentative, setFoundRepresentative] = useState<IUserRes | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            startDate: new Date(),
            endDate: new Date(),
            year: new Date().getFullYear().toString(),
            semester: "winter",
            email: "",
            companyId: "",
        }
    });

    useEffect(() => {
        if (internship) {
            const startDate = typeof internship.startDate === 'string' 
                ? parseDateOnlyString(internship.startDate) 
                : internship.startDate instanceof Date 
                    ? internship.startDate 
                    : new Date(internship.startDate);
            const endDate = typeof internship.endDate === 'string' 
                ? parseDateOnlyString(internship.endDate) 
                : internship.endDate instanceof Date 
                    ? internship.endDate 
                    : new Date(internship.endDate);

            form.reset({
                name: internship.name,
                description: internship.description || "",
                startDate: startDate,
                endDate: endDate,
                year: internship.year.toString(),
                semester: internship.semester.toLowerCase(),
                email: internship.companyRepresentative?.email || "",
                companyId: internship.companyId,
                companyRepresentativeId: internship.companyRepresentativeId,
            });
            if (internship.companyRepresentative) {
                setFoundRepresentative(internship.companyRepresentative);
                setRepresentativeFound(true);
            }
        }
    }, [internship, form]);

    useEffect(() => {
        if (isError && error) {
            void errorResponseHandler(error instanceof Error ? error : new Error("Failed to load internship"), intl);
        }
    }, [isError, error, intl]);

    const findRepresentativeByEmail = async () => {
        const companyId = form.getValues("companyId");
        const email = form.getValues('email');

        if (!email || !companyId) {
            return;
        }

        setIsSearching(true);
        try {
            const response = await authHttpClient.get(API.Endpoints.Company.GetRepresentativeByEmail(companyId, email));
            if (response.ok) {
                const representative: IUserRes = await response.json();
                setFoundRepresentative(representative);
                setRepresentativeFound(true);
                form.setValue("companyRepresentativeId", representative.id);
                form.setValue("firstName", undefined);
                form.setValue("lastName", undefined);
                form.setValue("phoneNumber", undefined);
            } else if (response.status === 404) {
                setRepresentativeFound(false);
                setFoundRepresentative(null);
                form.setValue("companyRepresentativeId", undefined);
            } else {
                throw new Error("Failed to search representative");
            }
        } catch (error) {
            console.error("Representative not found: ", error);
            setRepresentativeFound(false);
            setFoundRepresentative(null);
        } finally {
            setIsSearching(false);
        }
    };

    const { control } = form;

    const hasCompany = useWatch({
        control,
        name: 'companyId',
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        if (!foundRepresentative) {
            return;
        }

        const reqJson: IInternshipReq = {
            name: data.name,
            description: data.description,
            startDate: toDateOnlyString(data.startDate),
            endDate: toDateOnlyString(data.endDate),
            year: parseInt(data.year),
            semester: data.semester,
            companyRepresentativeId: foundRepresentative.id,
            companyId: data.companyId
        };
        updateInternship({ id: internshipId, data: reqJson }, {
            onError: async (error) => {
                await errorResponseHandler(error as Error, intl);
            },
            onSuccess: () => {
                toast.success(intl.formatMessage({ id: "Internship.UpdateSuccess" }));
                navigate({ to: '/internships' });
            }
        });
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle><FormattedMessage id="Internship.Edit" /></CardTitle>
                    <CardDescription><FormattedMessage id="Internship.EditDescription" /></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 py-10">
                        <LoaderIcon className="size-5 animate-spin" aria-hidden="true" />
                        <span>{intl.formatMessage({ id: "Actions.Loading" })}</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isError || !internship) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle><FormattedMessage id="Internship.Edit" /></CardTitle>
                    <CardDescription><FormattedMessage id="Internship.EditDescription" /></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-muted-foreground">
                            <FormattedMessage id="Internship.LoadError" />
                        </p>
                        <Button variant="outline" className="w-fit" onClick={() => navigate({ to: '/internships' })}>
                            <FormattedMessage id="Actions.Back" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle><FormattedMessage id="Internship.Edit" /></CardTitle>
                <CardDescription><FormattedMessage id="Internship.EditDescription" /></CardDescription>
            </CardHeader>
            <CardContent>
                <form id="EditInternship" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Field className="">
                            <Controller
                                name="companyId"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="EditInternship_Company">
                                            <FormattedMessage id="CreateInternship.Company" />
                                        </FieldLabel>
                                        <div className="flex space-x-4">
                                            <Field>
                                                <CompanySelectField
                                                    {...field}
                                                    id="EditInternship_Company"
                                                    aria-invalid={fieldState.invalid}
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                            <Button className="w-35" type="button" onClick={() => setIsCompanyDialogOpen(true)}>
                                                <FormattedMessage id="CompanySignUp.Create" />
                                            </Button>
                                        </div>
                                    </Field>
                                )}
                            />
                        </Field>
                        {hasCompany ? (<>
                            <Field>
                                <Controller
                                    name="email"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="EditInternship_CompanyRepresentative">
                                                <FormattedMessage id="CreateInternship.CompanyRepresentative" />
                                            </FieldLabel>
                                            <div className="flex space-x-4">
                                                <Input
                                                    {...field}
                                                    id="EditInternship_CompanyRepresentative"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="jane.doe@company.eu"
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setIsSearching(true);
                                                    }}
                                                />
                                                <Button className="w-35" type="button" onClick={() => findRepresentativeByEmail()}>
                                                    <FormattedMessage id="CompanySignUp.FindRepresentative" />
                                                </Button>
                                            </div>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </Field>
                            {representativeFound === false && !isSearching && (
                                <>
                                    <Field>
                                        <Alert>
                                            <AlertCircleIcon />
                                            <AlertTitle><FormattedMessage id="CreateInternship.RepresentativeNotFound" /></AlertTitle>
                                            <AlertDescription>
                                                <FormattedMessage id="CreateInternship.RepresentativeNotFoundDescription" />
                                            </AlertDescription>
                                        </Alert>
                                    </Field>
                                    <Button type="button" onClick={() => setIsRepresentativeDialogOpen(true)}>
                                        <FormattedMessage id="CompanySignUp.Representative.Create" />
                                    </Button>
                                </>
                            )}
                            {representativeFound === true && !isSearching && foundRepresentative && (
                                <>
                                    <Field>
                                        <Alert>
                                            <AlertCircleIcon />
                                            <AlertTitle><FormattedMessage id="CreateInternship.RepresentativeFound" /></AlertTitle>
                                            <AlertDescription>
                                                <FormattedMessage id="SignUp.firstName" />: {foundRepresentative.firstName}
                                            </AlertDescription>
                                            <AlertDescription>
                                                <FormattedMessage id="SignUp.lastName" />: {foundRepresentative.lastName}
                                            </AlertDescription>
                                        </Alert>
                                    </Field>
                                    <Field>
                                        <Controller
                                            name="name"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="EditInternship_Name">
                                                        <FormattedMessage id="CreateInternship.Name" />
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="EditInternship_Name"
                                                        aria-invalid={fieldState.invalid}
                                                        placeholder="Doing some cool sh*t"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </Field>
                                    <Field>
                                        <Controller
                                            name="description"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="EditInternship_Description">
                                                        <FormattedMessage id="CreateInternship.Description" />
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="EditInternship_Description"
                                                        aria-invalid={fieldState.invalid}
                                                        placeholder="..."
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </Field>
                                    <Field>
                                        <Field className="grid grid-cols-2 gap-4">
                                            <Controller
                                                name="startDate"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <FieldLabel htmlFor="EditInternship_StartDate">
                                                            <FormattedMessage id="CreateInternship.StartDate" />
                                                        </FieldLabel>
                                                        <DatePickerField
                                                            {...field}
                                                            placeholder={intl.formatMessage({ id: 'Field.SelectDate' })}
                                                            id="EditInternship_StartDate"
                                                            aria-invalid={fieldState.invalid}
                                                        />
                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                            <Controller
                                                name="endDate"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <FieldLabel htmlFor="EditInternship_EndDate">
                                                            <FormattedMessage id="CreateInternship.EndDate" />
                                                        </FieldLabel>
                                                        <DatePickerField
                                                            {...field}
                                                            id="EditInternship_EndDate"
                                                            placeholder={intl.formatMessage({ id: 'Field.SelectDate' })}
                                                            aria-invalid={fieldState.invalid}
                                                        />
                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                        </Field>
                                    </Field>
                                    <Field>
                                        <Field className="grid grid-cols-2 gap-4">
                                            <Controller
                                                name="year"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <FieldLabel htmlFor="EditInternship_Year">
                                                            <FormattedMessage id="CreateInternship.Year" />
                                                        </FieldLabel>
                                                        <YearSelectField
                                                            {...field}
                                                            id="EditInternship_Year"
                                                            aria-invalid={fieldState.invalid}
                                                        />
                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                            <Controller
                                                name="semester"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <FieldLabel htmlFor="EditInternship_Semester">
                                                            <FormattedMessage id="CreateInternship.Semester" />
                                                        </FieldLabel>
                                                        <SemesterSelectField
                                                            {...field}
                                                            id="EditInternship_Semester"
                                                            aria-invalid={fieldState.invalid}
                                                        />
                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                        </Field>
                                    </Field>
                                    <Field>
                                        <div className="flex gap-4">
                                            <LoadingButton isPending={isPending} form="EditInternship">
                                                <FormattedMessage id={isPending ? "Actions.Saving" : "Actions.Save"} />
                                            </LoadingButton>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => navigate({ to: '/internships' })}
                                                disabled={isPending}
                                            >
                                                <FormattedMessage id="Actions.Cancel" />
                                            </Button>
                                        </div>
                                    </Field>
                                </>
                            )}
                        </>) : null}
                    </FieldGroup>
                </form>
                <CompanyRegisterForm open={isCompanyDialogOpen} onOpenChange={setIsCompanyDialogOpen} />
                <CompanyRepresentativeForm open={isRepresentativeDialogOpen} onOpenChange={setIsRepresentativeDialogOpen} email={form.getValues('email')} companyId={form.getValues('companyId')} />
            </CardContent>
        </Card>
    );
};

export default EditInternshipForm;

