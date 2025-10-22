import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useChnageDefaultPassword } from "@/api/hooks/useChangeDefaultPassword";
import { HTTPError } from "ky";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import LoadingButton from "../LoadingButton";

const formSchema = z.object({
    password: z
        .string()
        .nonempty()
        .min(8)
        .max(64)
});

const ChangeDefaultPasswordForm = () => {
    const { mutate: changeDefaultPassword, isPending } = useChnageDefaultPassword();
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: ""
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        changeDefaultPassword(data, {
            onSuccess: (res) => navigate({ to: res.redirector }),
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
                <CardTitle>Change your default password</CardTitle>
                <CardDescription>Enter your new password</CardDescription>
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
                                    New Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="UserChangeDefaultPassword_Password"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="New Password"
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
                            <LoadingButton isPending={isPending} form="UserChangeDefaultPassword">Submit</LoadingButton>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
};

export default ChangeDefaultPasswordForm;