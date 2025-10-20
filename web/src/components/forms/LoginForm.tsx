import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useLoginUser } from "@/api/hooks/useLoginUser";
import { Link,useNavigate } from "@tanstack/react-router";
import { HTTPError } from "ky";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { LoaderIcon } from "lucide-react";
import { Input } from "../ui/input";
import { FormattedMessage, useIntl } from "react-intl";

const formSchema = z.object({
    email: z
        .string()
        .email()
        .nonempty(),
    password: z
        .string()
        .nonempty()
        .min(8)
        .max(64)
});

const LoginForm = () => {
    const { mutate: login, isPending } = useLoginUser();
    const navigate = useNavigate();
    const intl = useIntl();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        login(data, {
            onSuccess: (res) => navigate({ to: res.redirector }),
            onError: async (error) => {
                let message = intl.formatMessage({ id: "Error.Login.EmailOrPasswordInvalid" });
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

    return(
        <Card>
            <CardHeader>
                <CardTitle>
                    <FormattedMessage id="SignIn.SignIn" />
                </CardTitle>
                <CardDescription>
                    <FormattedMessage id="SignIn.EnterEmailAndPassword" />
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="UserLoginForm" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="UserLoginForm_Email">
                                        <FormattedMessage id="SignIn.Email" />
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="UserLoginForm_Email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder={intl.formatMessage({ id: "SignIn.Email" })}
                                        autoComplete="on"
                                        type="email"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="UserLoginForm_Password">
                                        <FormattedMessage id="SignIn.Password" />
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="UserLoginForm_Password"
                                        aria-invalid={fieldState.invalid}
                                        placeholder={intl.formatMessage({ id: "SignIn.Password" })}
                                        autoComplete="on"
                                        type="password"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Field>
                            <Button type="submit" form="UserLoginForm" disabled={isPending}>
                                {isPending ? <LoaderIcon
                                    role="status"
                                    aria-label="Loading"
                                    className="size-4 animate-spin"
                                /> : null}
                                {isPending ? <FormattedMessage id="Actions.Loading" /> : <FormattedMessage id="SignIn.SignIn" />}
                            </Button>
                            <FieldDescription className="text-center">
                                {intl.formatMessage({ id: "SignUp.AlreadyHaveAnAccount" })}{" "}
                                <Link to="/register">
                                    <FormattedMessage id="SignUp.SignUp" />
                                </Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
};

export default LoginForm;