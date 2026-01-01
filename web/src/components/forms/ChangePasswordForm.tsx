import * as z from "zod";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoaderIcon, EyeIcon, EyeOffIcon, CheckIcon, AlertCircle } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "sonner";
import { errorResponseHandler } from "@/lib/errorResponseHandler";
import { useChangePassword } from "@/api/hooks/useChangePassword";
import type { IChangePasswordReq } from "@/models/auth/IChangePasswordReq";

const formSchema = z.object({
    currentPassword: z
        .string()
        .min(8, "Password must be at least 8 characters."),
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters."),
    confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters.")
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
});

const ChangePasswordForm = () => {
    const intl = useIntl();
    const { mutate: changePassword, isPending, reset } = useChangePassword();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPasswords, setShowNewPasswords] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: "",
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
        const payload: IChangePasswordReq = {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
        };

        changePassword(payload, {
            onSuccess: () => {
                toast.success(intl.formatMessage({ id: "Profile.ChangePassword.Success" }));
                form.reset();
                reset();
            },
            onError: async (mutationError) => {
                await errorResponseHandler(mutationError as Error, intl);
            }
        });
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle><FormattedMessage id="Profile.ChangePassword.Title" /></CardTitle>
                <CardDescription><FormattedMessage id="Profile.ChangePassword.Description" /></CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FieldGroup>
                        <Controller
                            name="currentPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="ChangePassword_Current">
                                        <FormattedMessage id="Profile.ChangePassword.Current" />
                                    </FieldLabel>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            id="ChangePassword_Current"
                                            type={showCurrentPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            aria-invalid={fieldState.invalid}
                                            disabled={isPending}
                                        />
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="absolute inset-y-0 right-1 my-auto h-8 w-8"
                                            onClick={() => setShowCurrentPassword((prev) => !prev)}
                                            tabIndex={-1}
                                        >
                                            {showCurrentPassword ? <EyeOffIcon className="size-4" aria-hidden="true" /> : <EyeIcon className="size-4" aria-hidden="true" />}
                                            <span className="sr-only">
                                                {showCurrentPassword ? intl.formatMessage({ id: "Profile.ChangePassword.Hide" }) : intl.formatMessage({ id: "Profile.ChangePassword.Show" })}
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
                            name="newPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="ChangePassword_New">
                                        <FormattedMessage id="Profile.ChangePassword.New" />
                                    </FieldLabel>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            id="ChangePassword_New"
                                            type={showNewPasswords ? "text" : "password"}
                                            autoComplete="new-password"
                                            aria-invalid={fieldState.invalid}
                                            disabled={isPending}
                                        />
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="absolute inset-y-0 right-1 my-auto h-8 w-8"
                                            onClick={() => setShowNewPasswords((prev) => !prev)}
                                            tabIndex={-1}
                                        >
                                            {showNewPasswords ? <EyeOffIcon className="size-4" aria-hidden="true" /> : <EyeIcon className="size-4" aria-hidden="true" />}
                                            <span className="sr-only">
                                                {showNewPasswords ? intl.formatMessage({ id: "Profile.ChangePassword.Hide" }) : intl.formatMessage({ id: "Profile.ChangePassword.Show" })}
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
                                    <FieldLabel htmlFor="ChangePassword_Confirm">
                                        <FormattedMessage id="Profile.ChangePassword.Confirm" />
                                    </FieldLabel>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            id="ChangePassword_Confirm"
                                            type={showNewPasswords ? "text" : "password"}
                                            autoComplete="new-password"
                                            aria-invalid={fieldState.invalid}
                                            disabled={isPending}
                                        />
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="absolute inset-y-0 right-1 my-auto h-8 w-8"
                                            onClick={() => setShowNewPasswords((prev) => !prev)}
                                            tabIndex={-1}
                                        >
                                            {showNewPasswords ? <EyeOffIcon className="size-4" aria-hidden="true" /> : <EyeIcon className="size-4" aria-hidden="true" />}
                                            <span className="sr-only">
                                                {showNewPasswords ? intl.formatMessage({ id: "Profile.ChangePassword.Hide" }) : intl.formatMessage({ id: "Profile.ChangePassword.Show" })}
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
                    </FieldGroup>
                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending && (
                            <LoaderIcon
                                role="status"
                                aria-label="Loading"
                                className="mr-2 size-4 animate-spin"
                            />
                        )}
                        <FormattedMessage id={isPending ? "Profile.Saving" : "Profile.ChangePassword.Submit"} />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        disabled={isPending}
                        className="w-full"
                        onClick={() => {
                            form.reset();
                            reset();
                        }}
                    >
                        <FormattedMessage id="Profile.ChangePassword.Clear" />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ChangePasswordForm;
