import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoaderIcon } from "lucide-react";
import { FormattedMessage, useIntl } from 'react-intl';
import { errorResponseHandler } from "@/lib/errorResponseHandler";
import { useCreateCompany } from "@/api/hooks/useCreateCompany";
import type { ICompanyReq } from "@/models/company/ICompanyReq";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { useEffect } from "react";

interface ICompanyRegisterFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// TODO later add error messages and translations
const formSchema = z.object({
    companyName: z
        .string()
        .nonempty()
        .max(255),
    city: z
        .string()
        .nonempty()
        .max(182),
    street: z
        .string()
        .nonempty()
        .max(128),
    buildingNumber: z
        .string()
        .nonempty()
        .max(16),
    zipCode: z
        .string()
        .nonempty()
        .max(16),
});

const CompanyRegisterForm = ({ open, onOpenChange } : ICompanyRegisterFormProps) => {
    const { mutate: create, isPending } = useCreateCompany();
    const intl = useIntl();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyName: "",
            city: "",
            street: "",
            buildingNumber: "",
            zipCode: "",
        }
    });

    const { reset } = form;

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        const reqJson: ICompanyReq = {
            name: data.companyName,
            address: {
                city: data.city,
                street: data.street,
                buildingNumber: data.buildingNumber,
                zipCode: data.zipCode
            },
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
                        {/* Company Name */}
                        <Controller
                            name="companyName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="CompanyRegisterForm_CompanyName">
                                        <FormattedMessage id="CompanySignUp.CompanyName" />
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="CompanyRegisterForm_CompanyName"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="ABC s.r.o."
                                        autoComplete="organization"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        {/* Address Section */}
                        <Field>
                            <Field className="grid grid-cols-2 gap-4">
                                <Controller
                                    name="city"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="CompanyRegisterForm_City">
                                                <FormattedMessage id="CompanySignUp.City" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="CompanyRegisterForm_City"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Nitra"
                                                autoComplete="address-level2"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="street"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="CompanyRegisterForm_Street">
                                                <FormattedMessage id="CompanySignUp.Street" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="CompanyRegisterForm_Street"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Štefánikova trieda"
                                                autoComplete="address-line1"
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
                            <Field className="grid grid-cols-2 gap-4">
                                <Controller
                                    name="buildingNumber"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="CompanyRegisterForm_BuildingNumber">
                                                <FormattedMessage id="CompanySignUp.BuildingNumber" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="CompanyRegisterForm_BuildingNumber"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="77/54"
                                                autoComplete="off"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="zipCode"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="CompanyRegisterForm_ZipCode">
                                                <FormattedMessage id="CompanySignUp.PostalCode" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="CompanyRegisterForm_ZipCode"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="949 01"
                                                autoComplete="postal-code"
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

export default CompanyRegisterForm;