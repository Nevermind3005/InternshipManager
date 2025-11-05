import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import type { ICompanyRegisterReq } from "@/models/user/ICompanyRegisterReq";
import { useRegisterCompany } from "@/api/hooks/useRegisterCompany";
import { LoaderIcon } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { FormattedMessage, useIntl } from 'react-intl';
import { errorResponseHandler } from "@/lib/errorResponseHandler";


// TODO later add error messages and translations
const formSchema = z.object({
    companyName: z
        .string()
        .nonempty()
        .max(255),
    city: z
        .string()
        .nonempty()
        .max(182),
    street: z
        .string()
        .nonempty()
        .max(128),
    buildingNumber: z
        .string()
        .nonempty()
        .max(16),
    zipCode: z
        .string()
        .nonempty()
        .max(16),
    contactPersonFirstName: z
        .string()
        .nonempty()
        .max(128),
    contactPersonLastName: z
        .string()
        .nonempty()
        .max(128),
    contactPersonEmail: z
        .string()
        .email()
        .nonempty(),
    contactPersonPhone: z
        .string()
        .nonempty()
        .max(20)
});

const CompanyRegisterForm = () => {
    const { mutate: register, isPending } = useRegisterCompany();
    const navigate = useNavigate();
    const intl = useIntl();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyName: "",
            city: "",
            street: "",
            buildingNumber: "",
            zipCode: "",
            contactPersonFirstName: "",
            contactPersonLastName: "",
            contactPersonEmail: "",
            contactPersonPhone: ""
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        const reqJson: ICompanyRegisterReq = {
            companyName: data.companyName,
            address: {
                city: data.city,
                street: data.street,
                buildingNumber: data.buildingNumber,
                zipCode: data.zipCode
            },
            contactPerson: {
                firstName: data.contactPersonFirstName,
                lastName: data.contactPersonLastName,
                email: data.contactPersonEmail,
                phone: data.contactPersonPhone
            }
        };
        register(reqJson, {
            // TODO later navigate to a success page
            onSuccess: () => navigate({ to: "/" }),
            onError: async (error) => {
                errorResponseHandler(error, intl);
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle><FormattedMessage id="CompanySignUp.SignUp" /></CardTitle>
                <CardDescription><FormattedMessage id="CompanySignUp.Description" /></CardDescription>
            </CardHeader>
            <CardContent>
                <form id="CompanyRegisterForm" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        {/* Company Name */}
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

                        {/* Address Section */}
                        <Field>
                            <Field className="grid grid-cols-2 gap-4">
                                <Controller
                                    name="city"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="CompanyRegisterForm_City">
                                                <FormattedMessage id="CompanySignUp.City" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="CompanyRegisterForm_City"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Nitra"
                                                autoComplete="address-level2"
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
                                                <FormattedMessage id="CompanySignUp.Street" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="CompanyRegisterForm_Street"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Štefánikova trieda"
                                                autoComplete="address-line1"
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
                                    name="buildingNumber"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="CompanyRegisterForm_BuildingNumber">
                                                <FormattedMessage id="CompanySignUp.BuildingNumber" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="CompanyRegisterForm_BuildingNumber"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="77/54"
                                                autoComplete="off"
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
                                                <FormattedMessage id="CompanySignUp.PostalCode" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="CompanyRegisterForm_ZipCode"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="949 01"
                                                autoComplete="postal-code"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </Field>
                        </Field>

                        {/* Contact Person Section */}
                        <Field>
                            <FieldLabel className="text-base font-semibold">
                                <FormattedMessage id="CompanySignUp.ContactPerson" />
                            </FieldLabel>
                        </Field>

                        <Field>
                            <Field className="grid grid-cols-2 gap-4">
                                <Controller
                                    name="contactPersonFirstName"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="CompanyRegisterForm_ContactFirstName">
                                                <FormattedMessage id="CompanySignUp.ContactFirstName" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="CompanyRegisterForm_ContactFirstName"
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
                                    name="contactPersonLastName"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="CompanyRegisterForm_ContactLastName">
                                                <FormattedMessage id="CompanySignUp.ContactLastName" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="CompanyRegisterForm_ContactLastName"
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
                        </Field>

                        <Controller
                            name="contactPersonEmail"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="CompanyRegisterForm_ContactEmail">
                                        <FormattedMessage id="CompanySignUp.ContactEmail" />
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="CompanyRegisterForm_ContactEmail"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="jan.novak@example.com"
                                        autoComplete="email"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="contactPersonPhone"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="CompanyRegisterForm_ContactPhone">
                                        <FormattedMessage id="CompanySignUp.ContactPhone" />
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="CompanyRegisterForm_ContactPhone"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="+421xxxxxxxxx"
                                        autoComplete="tel"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Field>
                            <Button type="submit" form="CompanyRegisterForm" disabled={isPending}>
                                {isPending ? <LoaderIcon
                                    role="status"
                                    aria-label="Loading"
                                    className="size-4 animate-spin"
                                /> : null}
                                {isPending ? <FormattedMessage id="CompanySignUp.Processing" /> : <FormattedMessage id="CompanySignUp.Register" />}
                            </Button>
                            <FieldDescription className="px-6 text-center">
                                <FormattedMessage id="CompanySignUp.AlreadyHaveAnAccount" />
                                <Link to="/login">{' '}<FormattedMessage id="CompanySignUp.SignIn" />
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