import z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { FormattedMessage, useIntl } from "react-intl";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import LoadingButton from "../LoadingButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateInternship } from "@/api/hooks/useUpdateInternship";
import { useGetInternship } from "@/api/hooks/useGetInternship";
import DatePickerField from "../foundation/fields/DatePickerField";
import YearSelectField from "../foundation/fields/YearSelectField";
import { SemesterSelectField } from "../foundation/fields/SemesterSelectField";
import StudyProgramSelectField from "../foundation/fields/StudyProgramSelectField";
import { toDateOnlyString, parseDateOnlyString } from "@/lib/foundationUtils";
import type { IInternshipReq } from "@/models/internship/IInternshipReq";
import type { IInternshipRes } from "@/models/internship/IInternshipRes";
import { Button } from "../ui/button";
import { LoaderIcon } from "lucide-react";
import { errorResponseHandler } from "@/lib/errorResponseHandler";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

const formSchema = z.object({
    name: z
        .string()
        .nonempty()
        .max(128),
    description: z
        .string()
        .max(1024),
    startDate: z
        .date(),
    endDate: z
        .date(),
    year: z
        .string()
        .nonempty("Year is required"),
    semester: z
        .string()
        .nonempty("Semester is required"),
    studyProgramId: z
        .string()
        .uuid()
        .optional()
        .or(z.literal("")),
}).refine((data) => data.endDate > data.startDate, {
    message: "Internship.EndAfterStart",
    path: ["endDate"]
});

interface EditInternshipFormProps {
    internshipId: string;
}

// Inner form component that receives loaded data
interface InternshipFormProps {
    internship: IInternshipRes;
    internshipId: string;
}

const InternshipForm = ({ internship, internshipId }: InternshipFormProps) => {
    const { mutate: updateInternship, isPending } = useUpdateInternship();
    const intl = useIntl();
    const navigate = useNavigate();

    // Parse dates from internship data
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

    // Initialize form with loaded data directly as defaultValues
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: internship.name,
            description: internship.description || "",
            startDate: startDate,
            endDate: endDate,
            year: internship.year.toString(),
            semester: internship.semester.toLowerCase(),
            studyProgramId: internship.studyProgramId || undefined,
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        // Capitalize first letter of semester to match server ESemester enum (Winter/Summer)
        const capitalizedSemester = data.semester.charAt(0).toUpperCase() + data.semester.slice(1);

        const reqJson: IInternshipReq = {
            name: data.name,
            description: data.description,
            startDate: toDateOnlyString(data.startDate),
            endDate: toDateOnlyString(data.endDate),
            year: parseInt(data.year),
            semester: capitalizedSemester,
            type: internship.type || 'Unpaid',
            companyRepresentativeId: internship.companyRepresentativeId,
            companyId: internship.companyId,
            studyProgramId: data.studyProgramId || null
        };

        updateInternship({ id: internshipId, data: reqJson }, {
            onError: async (error) => {
                await errorResponseHandler(error as Error, intl);
            },
            onSuccess: () => {
                toast.success(intl.formatMessage({ id: "Internship.UpdateSuccess" }));
                navigate({ to: '/dashboard/internships' });
            }
        });
    };

    return (
        <form id="EditInternship" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
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
                                        startYear={2024}
                                        endYear={new Date().getFullYear() + 5}
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
                    <Controller
                        name="studyProgramId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="EditInternship_StudyProgram">
                                    <FormattedMessage id="CreateInternship.StudyProgram" />
                                </FieldLabel>
                                <StudyProgramSelectField
                                    {...field}
                                    id="EditInternship_StudyProgram"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </Field>
                <Field>
                    <div className="flex gap-4">
                        <LoadingButton isPending={isPending} form="EditInternship">
                            <FormattedMessage id={isPending ? "Actions.Saving" : "Actions.Save"} />
                        </LoadingButton>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate({ to: '/dashboard/internships' })}
                            disabled={isPending}
                        >
                            <FormattedMessage id="Actions.Cancel" />
                        </Button>
                    </div>
                </Field>
            </FieldGroup>
        </form>
    );
};

// Outer component that handles loading state
const EditInternshipForm = ({ internshipId }: EditInternshipFormProps) => {
    const { data: internship, isLoading, isError } = useGetInternship(internshipId);
    const intl = useIntl();
    const navigate = useNavigate();

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
                        <Button variant="outline" className="w-fit" onClick={() => navigate({ to: '/dashboard/internships' })}>
                            <FormattedMessage id="Actions.Back" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Only render form when data is loaded - form gets correct defaultValues from start
    // key={internshipId} forces React to remount the form if internshipId changes
    return (
        <Card>
            <CardHeader>
                <CardTitle><FormattedMessage id="Internship.Edit" /></CardTitle>
                <CardDescription><FormattedMessage id="Internship.EditDescription" /></CardDescription>
            </CardHeader>
            <CardContent>
                <InternshipForm key={internshipId} internship={internship} internshipId={internshipId} />
            </CardContent>
        </Card>
    );
};

export default EditInternshipForm;
