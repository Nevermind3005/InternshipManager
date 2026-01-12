import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useChanageDefaultPassword } from "@/api/hooks/useChangeDefaultPassword";
import { HTTPError } from "ky";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import PasswordStrengthMeter from "../ui/PasswordStrengthMeter";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]).{8,}$/;

const formSchema = z.object({
    password: z
        .string()
        .min(8)
        .max(256)
        .regex(passwordRegex)
});

const ChangeDefaultPasswordForm = () => {
    const { mutate: changeDefaultPassword, isPending } = useChanageDefaultPassword();
    const navigate = useNavigate();
    const intl = useIntl();
    const [showPassword, setShowPassword] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: ""
        }
    });

    const passwordValue = form.watch("password");

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        changeDefaultPassword(data, {
            onSuccess: (res) => navigate({ to: res.redirector }),
            onError: async (error) => {
                let message = "Something went wrong";
                if (error instanceof HTTPError) {
                    try {
                        const data = await error.response.json();
                        message = data.detail || data.message || message;
                    } catch {
                        message = error.message;
                    }
                } else {
                    message = error.message;
                }
                console.log(message);
            }
        });
    };
  
    return (
        <Card>
            <CardHeader>
                <CardTitle><FormattedMessage id="ChangeDefaultPassword.Title" /></CardTitle>
                <CardDescription><FormattedMessage id="ChangeDefaultPassword.Description" /></CardDescription>
            </CardHeader>
            <CardContent>
                <form id="UserChangeDefaultPassword" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="UserChangeDefaultPassword_Password">
                                        <FormattedMessage id="ResetPassword.NewPassword" />
                                    </FieldLabel>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            id="UserChangeDefaultPassword_Password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder={intl.formatMessage({ id: "ResetPassword.NewPassword" })}
                                            autoComplete="new-password"
                                            type={showPassword ? "text" : "password"}
                                            disabled={isPending}
                                        />
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="absolute inset-y-0 right-1 my-auto h-8 w-8"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOffIcon className="size-4" aria-hidden="true" />
                                            ) : (
                                                <EyeIcon className="size-4" aria-hidden="true" />
                                            )}
                                            <span className="sr-only">
                                                {showPassword 
                                                    ? intl.formatMessage({ id: "Profile.ChangePassword.Hide" })
                                                    : intl.formatMessage({ id: "Profile.ChangePassword.Show" })}
                                            </span>
                                        </Button>
                                    </div>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                    <PasswordStrengthMeter password={passwordValue} />
                                </Field>
                            )}
                        />
                        <Field>
                            <Button type="submit" form="UserChangeDefaultPassword" disabled={isPending} className="w-full">
                                {isPending && (
                                    <LoaderIcon
                                        role="status"
                                        aria-label="Loading"
                                        className="mr-2 size-4 animate-spin"
                                    />
                                )}
                                <FormattedMessage id={isPending ? "Actions.Loading" : "Profile.ChangePassword.Submit"} />
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
};

export default ChangeDefaultPasswordForm;