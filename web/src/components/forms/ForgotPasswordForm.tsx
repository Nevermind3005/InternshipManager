import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useRequestPasswordReset } from "@/api/hooks/useRequestPasswordReset";
import { Link } from "@tanstack/react-router";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { LoaderIcon, CheckCircle2, ArrowLeft } from "lucide-react";
import { Input } from "../ui/input";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "sonner";

const formSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address")
});

const ForgotPasswordForm = () => {
    const { mutate: requestPasswordReset, isPending } = useRequestPasswordReset();
    const intl = useIntl();
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        requestPasswordReset(data, {
            onSuccess: () => {
                setIsSubmitted(true);
            },
            onError: (error) => {
                // Log error for debugging (check browser console)
                console.error("RequestPasswordReset error:", error);
                
                // Only show error for network/server issues
                // Don't reveal if email exists or not
                toast.error(intl.formatMessage({ id: "Error.Generic" }));
            }
        });
    };

    if (isSubmitted) {
        return (
            <Card>
                <CardHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <CardTitle className="text-center">
                        <FormattedMessage id="ForgotPassword.EmailSent" />
                    </CardTitle>
                    <CardDescription className="text-center">
                        <FormattedMessage id="ForgotPassword.CheckInbox" />
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center text-sm text-muted-foreground">
                        <FormattedMessage id="ForgotPassword.Instructions" />
                    </p>
                    <div className="flex justify-center">
                        <Link to="/login">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                <FormattedMessage id="ForgotPassword.BackToLogin" />
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <FormattedMessage id="ForgotPassword.Title" />
                </CardTitle>
                <CardDescription>
                    <FormattedMessage id="ForgotPassword.Description" />
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="ForgotPasswordForm" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="ForgotPasswordForm_Email">
                                        <FormattedMessage id="SignIn.Email" />
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="ForgotPasswordForm_Email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder={intl.formatMessage({ id: "SignIn.Email" })}
                                        autoComplete="email"
                                        type="email"
                                        disabled={isPending}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Field>
                            <Button type="submit" form="ForgotPasswordForm" disabled={isPending} className="w-full">
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
                                    <FormattedMessage id="ForgotPassword.Submit" />
                                )}
                            </Button>
                            <FieldDescription className="text-center mt-4">
                                <Link to="/login" className="text-primary hover:underline">
                                    <ArrowLeft className="inline-block mr-1 h-3 w-3" />
                                    <FormattedMessage id="ForgotPassword.BackToLogin" />
                                </Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
};

export default ForgotPasswordForm;
