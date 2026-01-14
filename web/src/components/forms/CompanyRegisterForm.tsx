import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { LoaderIcon } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { FormattedMessage, useIntl } from 'react-intl';
import { errorResponseHandler } from "@/lib/errorResponseHandler";
import { phoneRegex } from "@/lib/validation";
import { useRegisterCompanyWithRepresentative } from "@/api/hooks/useRegisterCompanyWithRepresentative";
import { useGetAllCompaniesPublic } from "@/api/hooks/useGetAllCompaniesPublic";
import type { ICompanyWithRepresentativeRegisterReq } from "@/models/company/ICompanyWithRepresentativeRegisterReq";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";

const formSchema = z.object({
    // Company selection
    existingCompanyId: z.string().optional(),
    // New company fields (required if no existing company selected)
    companyName: z.string().max(128).optional(),
    city: z.string().max(182).optional(),
    street: z.string().max(128).optional(),
    buildingNumber: z.string().max(16).optional(),
    zipCode: z.string().max(16).optional(),
    // Representative fields
    email: z.string().email().nonempty(),
    firstName: z.string().nonempty().max(128),
    lastName: z.string().nonempty().max(128),
    phone: z
        .string()
        .nonempty("Validation.Phone.Required")
        .min(7, "Validation.Phone.TooShort")
        .max(20, "Validation.Phone.TooLong")
        .regex(phoneRegex, "Validation.Phone.Invalid"),
}).refine((data) => {
    // If no existing company selected, new company fields are required
    if (!data.existingCompanyId || data.existingCompanyId === "new") {
        return data.companyName && data.city && data.street && data.buildingNumber && data.zipCode;
    }
    return true;
}, {
    message: "Company details are required when creating a new company",
    path: ["companyName"]
});

const CompanyRegisterForm = () => {
    const { mutate: register, isPending } = useRegisterCompanyWithRepresentative();
    const { data: companies, isLoading: isLoadingCompanies } = useGetAllCompaniesPublic();
    const navigate = useNavigate();
    const intl = useIntl();
    const [isNewCompany, setIsNewCompany] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            existingCompanyId: "new",
            companyName: "",
            city: "",
            street: "",
            buildingNumber: "",
            zipCode: "",
            email: "",
            firstName: "",
            lastName: "",
            phone: ""
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        const isExistingCompany = data.existingCompanyId && data.existingCompanyId !== "new";
        
        const reqJson: ICompanyWithRepresentativeRegisterReq = {
            companyId: isExistingCompany ? data.existingCompanyId : undefined,
            companyName: !isExistingCompany ? data.companyName : undefined,
            companyAddress: !isExistingCompany ? {
                city: data.city!,
                street: data.street!,
                buildingNumber: data.buildingNumber!,
                zipCode: data.zipCode!
            } : undefined,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone
        };

        register(reqJson, {
            onSuccess: () => {
                toast.success(intl.formatMessage({ id: "CompanyRegister.Success" }));
                navigate({ to: "/" });
            },
            onError: async (error) => {
                errorResponseHandler(error, intl);
            }
        });
    };

    const handleCompanyChange = (value: string) => {
        form.setValue("existingCompanyId", value);
        setIsNewCompany(value === "new");
    };

    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle><FormattedMessage id="CompanyRegister.Title" /></CardTitle>
                <CardDescription><FormattedMessage id="CompanyRegister.Description" /></CardDescription>
            </CardHeader>
            <CardContent>
                <form id="CompanyRegisterForm" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        {/* Company Selection */}
                        <Field>
                            <FieldLabel htmlFor="CompanyRegisterForm_Company">
                                <FormattedMessage id="CompanyRegister.SelectCompany" />
                            </FieldLabel>
                            <Select
                                value={form.watch("existingCompanyId")}
                                onValueChange={handleCompanyChange}
                                disabled={isLoadingCompanies}
                            >
                                <SelectTrigger id="CompanyRegisterForm_Company">
                                    <SelectValue placeholder={intl.formatMessage({ id: "CompanyRegister.SelectCompanyPlaceholder" })} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">
                                        <FormattedMessage id="CompanyRegister.CreateNewCompany" />
                                    </SelectItem>
                                    {companies?.map((company) => (
                                        <SelectItem key={company.id} value={company.id}>
                                            {company.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FieldDescription>
                                <FormattedMessage id="CompanyRegister.SelectCompanyHint" />
                            </FieldDescription>
                        </Field>

                        {/* New Company Fields */}
                        {isNewCompany && (
                            <>
                                <Controller
                                    name="companyName"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="CompanyRegisterForm_CompanyName">
                                                <FormattedMessage id="CompanySignUp.CompanyName" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="CompanyRegisterForm_CompanyName"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="ABC s.r.o."
                                                autoComplete="organization"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Field className="grid grid-cols-2 gap-4">
                                    <Controller
                                        name="city"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="CompanyRegisterForm_City">
                                                    <FormattedMessage id="SignUp.City" />
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="CompanyRegisterForm_City"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="Nitra"
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="street"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="CompanyRegisterForm_Street">
                                                    <FormattedMessage id="SignUp.Street" />
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="CompanyRegisterForm_Street"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="Štefánikova trieda"
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </Field>
                                <Field className="grid grid-cols-2 gap-4">
                                    <Controller
                                        name="buildingNumber"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="CompanyRegisterForm_BuildingNumber">
                                                    <FormattedMessage id="SignUp.BuildingNumber" />
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="CompanyRegisterForm_BuildingNumber"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="77/54"
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="zipCode"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="CompanyRegisterForm_ZipCode">
                                                    <FormattedMessage id="SignUp.PostalCode" />
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="CompanyRegisterForm_ZipCode"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="949 01"
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </Field>
                            </>
                        )}

                        {/* Separator */}
                        <div className="border-t pt-4">
                            <h3 className="text-sm font-medium mb-4">
                                <FormattedMessage id="CompanyRegister.RepresentativeInfo" />
                            </h3>
                        </div>

                        {/* Representative Fields */}
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="CompanyRegisterForm_Email">
                                        <FormattedMessage id="Field.Email" />
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="CompanyRegisterForm_Email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="jan.novak@firma.sk"
                                        autoComplete="email"
                                        type="email"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Field className="grid grid-cols-2 gap-4">
                            <Controller
                                name="firstName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="CompanyRegisterForm_FirstName">
                                            <FormattedMessage id="SignUp.firstName" />
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="CompanyRegisterForm_FirstName"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Ján"
                                            autoComplete="given-name"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="lastName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="CompanyRegisterForm_LastName">
                                            <FormattedMessage id="SignUp.lastName" />
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="CompanyRegisterForm_LastName"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Novák"
                                            autoComplete="family-name"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </Field>
                        <Controller
                            name="phone"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="CompanyRegisterForm_Phone">
                                        <FormattedMessage id="SignUp.PhoneNumber" />
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="CompanyRegisterForm_Phone"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="+421901234567"
                                        autoComplete="tel"
                                    />
                                    <FieldDescription>
                                        <FormattedMessage id="Validation.Phone.Hint" />
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Field>
                            <Button type="submit" form="CompanyRegisterForm" disabled={isPending} className="w-full">
                                {isPending ? (
                                    <LoaderIcon
                                        role="status"
                                        aria-label="Loading"
                                        className="size-4 animate-spin mr-2"
                                    />
                                ) : null}
                                <FormattedMessage id={isPending ? "Actions.Loading" : "CompanyRegister.Submit"} />
                            </Button>
                            <FieldDescription className="mt-4 text-center">
                                <FormattedMessage id="CompanyRegister.AlreadyHaveAccount" />{' '}
                                <Link to="/login" className="underline">
                                    <FormattedMessage id="SignUp.SignIn" />
                                </Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
};

export default CompanyRegisterForm;
