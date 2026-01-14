import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import LoadingButton from "../LoadingButton";
import { useCreateInternshipHandler } from "@/api/hooks/useCreateInternshipHandler";
import { errorResponseHandler } from "@/lib/errorResponseHandler";
import { FormattedMessage, useIntl } from "react-intl";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { useEffect } from "react";
import { toast } from "sonner";
import type { ICreateInternshipHandler } from "@/models/auth/ICreateInternshipHandler";

interface ICreateInternshipHandlerFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

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

const CreateInternshipHandlerForm = ({ open, onOpenChange }: ICreateInternshipHandlerFormProps) => {
    const intl = useIntl();
    const { mutate: createHandler, isPending } = useCreateInternshipHandler();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        const reqJson: ICreateInternshipHandler = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
        };
        createHandler(reqJson, {
            onError: async (error) => {
                errorResponseHandler(error, intl);
            },
            onSuccess: () => {
                toast.success(intl.formatMessage({ id: "Settings.InternshipHandlers.CreateSuccess" }));
                onOpenChange(false);
            }
        });
    };

    const { reset } = form;

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        <FormattedMessage id="Settings.InternshipHandlers.Create" />
                    </DialogTitle>
                    <DialogDescription>
                        <FormattedMessage id="Settings.InternshipHandlers.CreateDescription" />
                    </DialogDescription>
                </DialogHeader>
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
                                        placeholder="name@ukf.sk"
                                        autoComplete="off"
                                        type="email"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
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
                                            placeholder="Ján"
                                            autoComplete="off"
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
                                            placeholder="Novák"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </div>
                        <Field>
                            <LoadingButton isPending={isPending} form="CreateInternshipHandler">
                                <FormattedMessage id="Actions.Create" />
                            </LoadingButton>
                        </Field>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateInternshipHandlerForm;
