import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import type { IStudentRegisterReq } from "@/models/user/student/IStudentRegisterReq";
import { useRegisterStudent } from "@/api/hooks/useRegisterStudent";
import { LoaderIcon } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { FormattedMessage, useIntl } from 'react-intl';
import { errorResponseHandler } from "@/lib/errorResponseHandler";
import { phoneRegex, studentEmailRegex } from "@/lib/validation";

// TODO later add error messages and translations
const formSchema = z.object({
    email: z
        .string()
        .email()
        .nonempty()
        .regex(studentEmailRegex, "Not a student mail"),
    alternativeEmail: z.union( [
        z.literal( '' ),
        z.string().email(),
    ] ),
    firstName: z
        .string()
        .nonempty()
        .max(128),
    lastName: z
        .string()
        .nonempty()
        .max(128),
    phone: z
        .string()
        .nonempty("Validation.Phone.Required")
        .min(7, "Validation.Phone.TooShort")
        .max(20, "Validation.Phone.TooLong")
        .regex(phoneRegex, "Validation.Phone.Invalid"),
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
        .max(16)
});

const RegisterForm = () => {
    const { mutate: register, isPending } = useRegisterStudent();
    const navigate = useNavigate();
    const intl = useIntl();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            alternativeEmail: "",
            firstName : "",
            lastName: "",
            phone: "",
            city: "",
            street: "",
            buildingNumber: "",
            zipCode: ""
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        const reqJson: IStudentRegisterReq =  {
            email: data.email,
            altMail: data.alternativeEmail.trim().length === 0 ? null : data.alternativeEmail,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            address: {
                city: data.city,
                street: data.street,
                buildingNumber: data.buildingNumber,
                zipCode: data.zipCode
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
                <CardTitle><FormattedMessage id="SignUp.SignUp" /></CardTitle>
                <CardDescription><FormattedMessage id="SignUp.Description" /></CardDescription>
            </CardHeader>
            <CardContent>
                <form id="StudentRegisterForm" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="StudentRegisterForm_Email">
                                        <FormattedMessage id="SignUp.PrimaryEmail" />
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="StudentRegisterForm_Email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="name.surname@student.ukf.sk"
                                        autoComplete="on"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="alternativeEmail"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="StudentRegister_AlternativeEmail">
                                        <FormattedMessage id="SignUp.AltEmail" />
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="StudentRegister_AlternativeEmail"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="name.surname@example.sk"
                                        autoComplete="on"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Field>
                            <Field className="grid grid-cols-2 gap-4">
                                <Controller
                                    name="firstName"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="StudentRegisterForm_FirstName">
                                                <FormattedMessage id="SignUp.firstName" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="StudentRegisterForm_FirstName"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="John"
                                                autoComplete="on"
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
                                            <FieldLabel htmlFor="StudentRegisterForm_LastName">
                                                <FormattedMessage id="SignUp.lastName" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="StudentRegisterForm_LastName"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Doe"
                                                autoComplete="on"
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
                            name="phone"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="StudentRegisterForm_Phone">
                                        <FormattedMessage id="SignUp.PhoneNumber" />
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="StudentRegisterForm_Phone"
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
                            <Field className="grid grid-cols-2 gap-4">
                                <Controller
                                    name="city"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="StudentRegisterForm_City">
                                                <FormattedMessage id="SignUp.City" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="StudentRegisterForm_City"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Nitra"
                                                autoComplete="on"
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
                                            <FieldLabel htmlFor="StudentRegisterForm_Street">
                                                <FormattedMessage id="SignUp.Street" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="StudentRegisterForm_Street"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Štefánikova trieda"
                                                autoComplete="on"
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
                                            <FieldLabel htmlFor="StudentRegisterForm_BuildingNumber">
                                                <FormattedMessage id="SignUp.BuildingNumber" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="StudentRegisterForm_BuildingNumber"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="77/54"
                                                autoComplete="on"
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
                                            <FieldLabel htmlFor="StudentRegisterForm_zipCode">
                                                <FormattedMessage id="SignUp.PostalCode" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="StudentRegisterForm_zipCode"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="949 01"
                                                autoComplete="on"
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
                            <Button type="submit" form="StudentRegisterForm" disabled={isPending}>
                                {isPending ? <LoaderIcon
                                    role="status"
                                    aria-label="Loading"
                                    className="size-4 animate-spin"
                                /> : null}
                                {isPending ? "Processing" : "Register"}
                            </Button>
                            <FieldDescription className="px-6 text-center">
                                <FormattedMessage id="SignUp.AlreadyHaveAnAccount" />
                                <Link to="/login">{' '}<FormattedMessage id="SignUp.SignIn" />
                                </Link>
                            </FieldDescription>
                            <FieldDescription className="px-6 text-center">
                                <Link to="/register-company">{' '}<FormattedMessage id="Landing.RegisterCompany" />
                                </Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
};

export default RegisterForm;