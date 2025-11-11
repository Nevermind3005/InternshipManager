import z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { FormattedMessage, useIntl } from "react-intl";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Input } from "../ui/input";
import LoadingButton from "../LoadingButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateInternship } from "@/api/hooks/useCreateInternship";
import DatePickerField from "../foundation/fields/DatePickerField";
import YearSelectField from "../foundation/fields/YearSelectField";
import { SemesterSelectField } from "../foundation/fields/SemesterSelectField";
import { getSeason, toDateOnlyString } from "@/lib/foundationUtils";
import type { IInternshipReq } from "@/models/internship/IInternshipReq";
import { HTTPError } from "ky";
import CompanySelectField from "../foundation/fields/CompanySelectField";
import CompanyRegisterForm from "./CompanyForm";
import { Button } from "../ui/button";
import { useState } from "react";

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
    companyRepresentativeEmail: z
        .string()
        .email()
        .nonempty(),
    companyId: z
        .string()
        .uuid()
});

const CreateInternshipForm = () => {
    const [ isCompanyDialogOpen, setIsCompanyDialogOpen ] = useState(false);
    const { mutate: createInternship, isPending } = useCreateInternship();
    const intl = useIntl();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            year: new Date().getFullYear().toString(),
            semester: getSeason()
        }
    });

    const { control } = form;

    const hasCompany = useWatch({
        control,
        name: 'companyId',
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
        const reqJson: IInternshipReq =  {
            name: data.name,
            description: data.description,
            startDate: toDateOnlyString(data.startDate),
            endDate: toDateOnlyString(data.endDate),
            year: parseInt(data.year),
            semester: data.semester,
            companyRepresentativeId: data.companyRepresentativeEmail,
            companyId: data.companyId
        };
        createInternship(reqJson, {
            onError: async (error) => {
                let message = "Something went wrong";
                if (error instanceof HTTPError) {
                    try {
                        const data = await error.response.json();
                        // TODO later use key from backend for translation and show the translation
                        message = data.detail || data.message || message;
                    } catch {
                        message = error.message;
                    }
                } else {
                    message = error.message;
                }
                // TODO later use shadcn toast instead console log
                console.log(message);
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle><FormattedMessage id="CreateInternship.Create" /></CardTitle>
                <CardDescription><FormattedMessage id="CreateInternship.Title" /></CardDescription>
            </CardHeader>
            <CardContent>
                <form id="CreateInternship" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Field className="">
                            <Controller
                                name="companyId"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="CreateInternship_Company">
                                            <FormattedMessage id="CreateInternship.Company" />
                                        </FieldLabel>
                                        <div className="flex space-x-4">
                                            <Field>
                                                <CompanySelectField 
                                                    {...field}
                                                    id="CreateInternship_Company"
                                                    aria-invalid={fieldState.invalid}
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                            <Button type="button" onClick={() => setIsCompanyDialogOpen(true)}>
                                                <FormattedMessage id="CompanySignUp.Create" />
                                            </Button>

                                        </div>
                                    </Field>
                                )}
                            />
                        </Field>
                        { hasCompany ? (<>
                            <Field>
                                <Controller
                                    name="companyRepresentativeEmail"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="CreateInternship_CompanyRepresentative">
                                                <FormattedMessage id="CreateInternship.CompanyRepresentative" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="CreateInternship_CompanyRepresentative"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="jane.doe@company.eu"
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
                                    name="name"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="CreateInternship_Name">
                                                <FormattedMessage id="CreateInternship.Name" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="CreateInternship_Name"
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
                                            <FieldLabel htmlFor="CreateInternship_Description">
                                                <FormattedMessage id="CreateInternship.Description" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="CreateInternship_Description"
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
                                                <FieldLabel htmlFor="CreateInternship_StartDate">
                                                    <FormattedMessage id="CreateInternship.StartDate" />
                                                </FieldLabel>
                                                <DatePickerField
                                                    {...field}
                                                    placeholder={intl.formatMessage({ id: 'Field.SelectDate' })}
                                                    id="CreateInternship_StartDate"
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
                                                <FieldLabel htmlFor="CreateInternship_EndDate">
                                                    <FormattedMessage id="CreateInternship.EndDate" />
                                                </FieldLabel>
                                                <DatePickerField
                                                    {...field}
                                                    id="CreateInternship_EndDate"
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
                                                <FieldLabel htmlFor="CreateInternship_Year">
                                                    <FormattedMessage id="CreateInternship.Year" />
                                                </FieldLabel>
                                                <YearSelectField
                                                    {...field}
                                                    id="CreateInternship_Year"
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
                                                <FieldLabel htmlFor="CreateInternship_Semester">
                                                    <FormattedMessage id="CreateInternship.Semester" />
                                                </FieldLabel>
                                                <SemesterSelectField
                                                    {...field}
                                                    id="CreateInternship_Semester"
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
                                <LoadingButton isPending={isPending} form="CreateInternship"><FormattedMessage id="Actions.Create"/></LoadingButton>
                            </Field>
                        </>) : null }
                    </FieldGroup>
                </form>
                <CompanyRegisterForm open={isCompanyDialogOpen} onOpenChange={setIsCompanyDialogOpen} />
            </CardContent>    
        </Card>
    );

};

export default CreateInternshipForm;
