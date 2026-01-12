import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoaderIcon } from "lucide-react";
import { FormattedMessage, useIntl } from 'react-intl';
import { errorResponseHandler } from "@/lib/errorResponseHandler";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { useEffect } from "react";
import { useRegisterRepresentative } from "@/api/hooks/useRegisterRepresentative";
import type { IRepresentativeRegisterReq } from "@/models/user/representative/IRepresentativeRegister";

interface ICompanyRepresentativeFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    email: string;
    companyId: string;
}

const phoneRegex = /^\+?[0-9]{6,19}$/;

// TODO later add error messages and translations
const formSchema = z.object({
    email: z
        .string()
        .email(),
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
        .nonempty("Telefónne číslo je povinné")
        .min(7, "Telefónne číslo je príliš krátke")
        .max(20, "Telefónne číslo je príliš dlhé")
        .regex(phoneRegex, "Telefónne číslo môže obsahovať len čísla a znak +"),
});

const CompanyRepresentativeForm = ({ open, onOpenChange, email, companyId } : ICompanyRepresentativeFormProps) => {
    const { mutate: create, isPending } = useRegisterRepresentative();
    const intl = useIntl();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email,
            firstName: "",
            lastName: "",
            phone: "",
        }
    });

    useEffect(() => {
        if (email) {
            form.reset({ ...form.getValues(), email });
        }
    }, [email, form]);

    const { reset } = form;

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        const reqJson: IRepresentativeRegisterReq = {
            companyId: companyId, 
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone
        };
        create(reqJson, {
            onSuccess() {
                onOpenChange(false);
            },
            onError: async (error) => {
                errorResponseHandler(error, intl);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle><FormattedMessage id="CompanySignUp.SignUp" /></DialogTitle>
                    <DialogDescription><FormattedMessage id="CompanySignUp.Description" /></DialogDescription>
                </DialogHeader>
                <form id="CompanyRegisterForm" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="StudentRegisterForm_Email">
                                        <FormattedMessage id="SignUp.PrimaryEmail" />
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="StudentRegisterForm_Email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="name.surname@student.ukf.sk"
                                        autoComplete="on"
                                        disabled
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
                                                <FormattedMessage id="SignUp.firstName" />
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
                                                <FormattedMessage id="SignUp.lastName" />
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
                                    <FieldLabel htmlFor="CompanyRepresentativeForm_Phone">
                                        <FormattedMessage id="SignUp.PhoneNumber" />
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="CompanyRepresentativeForm_Phone"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="+421901234567"
                                        autoComplete="tel"
                                    />
                                    <FieldDescription>
                                        <FormattedMessage id="Validation.Phone.Hint" />
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Field>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" form="CompanyRegisterForm" disabled={isPending}>
                                    {isPending ? <LoaderIcon
                                        role="status"
                                        aria-label="Loading"
                                        className="size-4 animate-spin"
                                    /> : null}
                                    {isPending ? <FormattedMessage id="CompanySignUp.Processing" /> : <FormattedMessage id="Actions.Save" />}
                                </Button>                            
                            </DialogFooter>
                        </Field>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CompanyRepresentativeForm;