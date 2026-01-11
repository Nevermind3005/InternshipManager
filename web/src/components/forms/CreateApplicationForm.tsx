import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import LoadingButton from "../LoadingButton";
import { useCreateApplication } from "@/api/hooks/useCreateApplication";
import { errorResponseHandler } from "@/lib/errorResponseHandler";
import { FormattedMessage, useIntl } from "react-intl";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useEffect, useState } from "react";
import type { IApplicationCreateRes } from "@/models/application/IApplicationCreateRes";
import CopyButton from "../foundation/CopyButton";
import SecretInput from "../foundation/SecretInput";

interface ICreateApplicationFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
    name: z
        .string()
        .nonempty()
        .min(8)
        .max(64)
});

const CreateApplicationForm = ({ open, onOpenChange } : ICreateApplicationFormProps) => {
    const [applicationInfo, setApplicationInfo] = useState<IApplicationCreateRes | null>(null);
    const intl = useIntl();
    const { mutate: createApplication, isPending } = useCreateApplication();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        createApplication(data, {
            onError: async (error) => {
                errorResponseHandler(error, intl);
            },
            onSuccess: async (success) => {
                setApplicationInfo(success);
            }
        });
    };

    const { reset } = form;
    
    useEffect(() => {
        if (!open) {
            setApplicationInfo(null);
            reset();
        }
    }, [open, reset]);
    
  
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle><FormattedMessage id="Application.CreateApiKey" /></DialogTitle>
                </DialogHeader>
                {!applicationInfo ? <form id="CreateApplication" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="CreateApplication_Name">
                                    Application name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="CreateApplication_Name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Space Mission API"
                                        autoComplete="off"
                                        type="text"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Field>
                            <LoadingButton isPending={isPending} form="CreateApplication">Submit</LoadingButton>
                        </Field>
                    </FieldGroup>
                </form> : <div>
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="applicationName">Application Name</FieldLabel>
                                <div className="flex items-center gap-2">
                                    <Input id="applicationName" type="text" value={applicationInfo.name} readOnly />
                                    <CopyButton content={applicationInfo.name}/>
                                </div>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="clientId">Client Id</FieldLabel>
                                <div className="flex items-center gap-2">
                                    <Input id="clientId" type="text" value={applicationInfo.clientId} readOnly />
                                    <CopyButton content={applicationInfo.clientId}/>
                                </div>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="clientSecret">Client Secret</FieldLabel>
                                <div className="flex items-center gap-2">
                                    <SecretInput id="clientSecret" value={applicationInfo.clientSecret} readOnly />
                                    <CopyButton content={applicationInfo.clientSecret}/>
                                </div>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </div>}
            </DialogContent>
        </Dialog>
    );
};

export default CreateApplicationForm;