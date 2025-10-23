import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { FormattedMessage } from "react-intl";
import type { ICreateInternshipHandler } from "@/models/auth/ICreateInternshipHandler";
import { useCreateInternshipHandler } from "@/api/hooks/useCreateInternshipHandler";
import LoadingButton from "../LoadingButton";
import { HTTPError } from "ky";
import { Input } from "../ui/input";

const formSchema = z.object({
    email: z
        .string()
        .email()
        .nonempty(),
    firstName: z
        .string()
        .nonempty()
        .max(128),
    lastName: z
        .string()
        .nonempty()
        .max(128),
});

const CreateInternshipHandler = () => {
    const { mutate: register, isPending } = useCreateInternshipHandler();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            firstName : "",
            lastName: "",
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        const reqJson: ICreateInternshipHandler =  {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
        };
        register(reqJson, {
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
                <CardTitle><FormattedMessage id="InternshipHandler.Create" /></CardTitle>
                <CardDescription><FormattedMessage id="InternshipHandler.Description" /></CardDescription>
            </CardHeader>
            <CardContent>
                <form id="CreateInternshipHandler" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="CreateInternshipHandler_Email">
                                        <FormattedMessage id="Field.Email" />
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="CreateInternshipHandler_Email"
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
                        <Field>
                            <Field className="grid grid-cols-2 gap-4">
                                <Controller
                                    name="firstName"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="CreateInternshipHandler_FirstName">
                                                <FormattedMessage id="SignUp.firstName" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="CreateInternshipHandler_FirstName"
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
                                            <FieldLabel htmlFor="CreateInternshipHandler_LastName">
                                                <FormattedMessage id="SignUp.lastName" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="CreateInternshipHandler_LastName"
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
                        <Field>
                            <LoadingButton isPending={isPending} form="CreateInternshipHandler"><FormattedMessage id="Actions.Crate"/></LoadingButton>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>    
        </Card>

    );
};

export default CreateInternshipHandler;