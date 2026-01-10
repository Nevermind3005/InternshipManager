import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useResetPassword } from "@/api/hooks/useResetPassword";
import { Link, useNavigate } from "@tanstack/react-router";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { LoaderIcon, EyeIcon, EyeOffIcon, CheckIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "../ui/input";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "sonner";
import { HTTPError } from "ky";

const formSchema = z.object({
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

interface ResetPasswordFormProps {
    token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
    const { mutate: resetPassword, isPending } = useResetPassword();
    const navigate = useNavigate();
    const intl = useIntl();
    const [showPasswords, setShowPasswords] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: ""
        }
    });

    const newPasswordValue = form.watch("newPassword");
    const confirmPasswordValue = form.watch("confirmPassword");

    const passwordsMatch = useMemo(() => {
        return newPasswordValue.length > 0 && confirmPasswordValue.length > 0 && newPasswordValue === confirmPasswordValue;
    }, [newPasswordValue, confirmPasswordValue]);

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        resetPassword(
            { token, newPassword: data.newPassword },
            {
                onSuccess: () => {
                    setIsSuccess(true);
                    toast.success(intl.formatMessage({ id: "ResetPassword.Success" }));
                    // Redirect to login after a short delay
                    setTimeout(() => {
                        navigate({ to: "/login" });
                    }, 3000);
                },
                onError: async (error) => {
                    // Show user-friendly error without exposing internal details
                    let messageId = "ResetPassword.Error.Generic";
                    
                    if (error instanceof HTTPError) {
                        const status = error.response.status;
                        if (status === 400) {
                            // Token invalid, expired, or already used
                            messageId = "ResetPassword.Error.InvalidToken";
                        }
                    }
                    
                    toast.error(intl.formatMessage({ id: messageId }));
                }
            }
        );
    };

    if (isSuccess) {
        return (
            <Card>
                <CardHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <CardTitle className="text-center">
                        <FormattedMessage id="ResetPassword.SuccessTitle" />
                    </CardTitle>
                    <CardDescription className="text-center">
                        <FormattedMessage id="ResetPassword.SuccessDescription" />
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Link to="/login">
                        <Button>
                            <FormattedMessage id="ResetPassword.GoToLogin" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    if (!token) {
        return (
            <Card>
                <CardHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-center">
                        <FormattedMessage id="ResetPassword.Error.NoToken" />
                    </CardTitle>
                    <CardDescription className="text-center">
                        <FormattedMessage id="ResetPassword.Error.NoTokenDescription" />
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Link to="/forgot-password">
                        <Button>
                            <FormattedMessage id="ResetPassword.RequestNewLink" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <FormattedMessage id="ResetPassword.Title" />
                </CardTitle>
                <CardDescription>
                    <FormattedMessage id="ResetPassword.Description" />
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="ResetPasswordForm" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="newPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="ResetPasswordForm_NewPassword">
                                        <FormattedMessage id="ResetPassword.NewPassword" />
                                    </FieldLabel>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            id="ResetPasswordForm_NewPassword"
                                            type={showPasswords ? "text" : "password"}
                                            autoComplete="new-password"
                                            aria-invalid={fieldState.invalid}
                                            disabled={isPending}
                                        />
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="absolute inset-y-0 right-1 my-auto h-8 w-8"
                                            onClick={() => setShowPasswords((prev) => !prev)}
                                            tabIndex={-1}
                                        >
                                            {showPasswords ? (
                                                <EyeOffIcon className="size-4" aria-hidden="true" />
                                            ) : (
                                                <EyeIcon className="size-4" aria-hidden="true" />
                                            )}
                                            <span className="sr-only">
                                                {showPasswords 
                                                    ? intl.formatMessage({ id: "Profile.ChangePassword.Hide" })
                                                    : intl.formatMessage({ id: "Profile.ChangePassword.Show" })}
                                            </span>
                                        </Button>
                                    </div>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="confirmPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="ResetPasswordForm_ConfirmPassword">
                                        <FormattedMessage id="ResetPassword.ConfirmPassword" />
                                    </FieldLabel>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            id="ResetPasswordForm_ConfirmPassword"
                                            type={showPasswords ? "text" : "password"}
                                            autoComplete="new-password"
                                            aria-invalid={fieldState.invalid}
                                            disabled={isPending}
                                        />
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="absolute inset-y-0 right-1 my-auto h-8 w-8"
                                            onClick={() => setShowPasswords((prev) => !prev)}
                                            tabIndex={-1}
                                        >
                                            {showPasswords ? (
                                                <EyeOffIcon className="size-4" aria-hidden="true" />
                                            ) : (
                                                <EyeIcon className="size-4" aria-hidden="true" />
                                            )}
                                            <span className="sr-only">
                                                {showPasswords 
                                                    ? intl.formatMessage({ id: "Profile.ChangePassword.Hide" })
                                                    : intl.formatMessage({ id: "Profile.ChangePassword.Show" })}
                                            </span>
                                        </Button>
                                    </div>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                    <div className="mt-2 flex items-center gap-2 text-sm">
                                        {passwordsMatch ? (
                                            <>
                                                <CheckIcon className="size-4 text-emerald-500" aria-hidden="true" />
                                                <span className="text-emerald-600 dark:text-emerald-400">
                                                    <FormattedMessage id="Profile.ChangePassword.Match" />
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="size-4 text-amber-500" aria-hidden="true" />
                                                <span className="text-amber-600 dark:text-amber-400">
                                                    <FormattedMessage id="Profile.ChangePassword.NotMatch" />
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </Field>
                            )}
                        />
                        <Field>
                            <Button 
                                type="submit" 
                                form="ResetPasswordForm" 
                                disabled={isPending} 
                                className="w-full"
                            >
                                {isPending ? (
                                    <LoaderIcon
                                        role="status"
                                        aria-label="Loading"
                                        className="mr-2 size-4 animate-spin"
                                    />
                                ) : null}
                                {isPending ? (
                                    <FormattedMessage id="Actions.Loading" />
                                ) : (
                                    <FormattedMessage id="ResetPassword.Submit" />
                                )}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
};

export default ResetPasswordForm;
