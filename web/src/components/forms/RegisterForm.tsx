import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import type { IStudentRegisterReq } from "@/models/user/student/IStudentRegisterReq";
import { useRegisterStudent } from "@/api/hooks/useRegisterStudent";
import { LoaderIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { HTTPError } from "ky";

// TODO later add error messages and translations
const formSchema = z.object({
    email: z
        .string()
        .email()
        .nonempty()
        .regex(new RegExp(String.raw`^[a-zá-ž]+\.[a-zá-ž]+(\d+)?@student\.ukf\.sk$`), "Not a student mail"),
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
        .nonempty()
        .max(20),
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
            person: {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone
            },
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
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Enter your information bellow to create your account</CardDescription>
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
                                    Primary Email
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
                                    Secondary Email (optional)
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
                                    First Name
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
                                    Last Name
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
                                    Phone Number
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="StudentRegisterForm_Phone"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="+421xxxxxxxxx"
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
                                    name="city"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="StudentRegisterForm_City">
                                    City
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
                                            <FieldLabel htmlFor="StudentRegisterForm_street">
                                    Street
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
                                    Building Number
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
                                    Zip Code
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

                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
};

export default RegisterForm;