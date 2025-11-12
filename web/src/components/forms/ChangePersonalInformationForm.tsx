import { useEffect } from "react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { LoaderIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "sonner";
import { useGetPersonalInformation } from "@/api/hooks/useGetPersonalInformation";
import { useUpdatePersonalInformation } from "@/api/hooks/useUpdatePersonalInformation";
import type { IUpdatePersonalInformationReq } from "@/models/user/IUpdatePersonalInformationReq";
import { errorResponseHandler } from "@/lib/errorResponseHandler";

const formSchema = z.object({
    firstName: z
        .string()
        .nonempty("First name is required")
        .max(128, "First name is too long"),
    lastName: z
        .string()
        .nonempty("Last name is required")
        .max(128, "Last name is too long"),
    phone: z
        .string()
        .nonempty("Phone number is required")
        .max(20, "Phone number is too long"),
    city: z
        .string()
        .nonempty("City is required")
        .max(128, "City name is too long"),
    street: z
        .string()
        .nonempty("Street is required")
        .max(128, "Street name is too long"),
    buildingNumber: z
        .string()
        .nonempty("Building number is required")
        .max(16, "Building number is too long"),
    zipCode: z
        .string()
        .nonempty("ZIP code is required")
        .max(16, "ZIP code is too long")
});

const ChangePersonalInformationForm = () => {
    const navigate = useNavigate();
    const intl = useIntl();
    const { data: personalInformation, isLoading, isError, error, refetch } = useGetPersonalInformation();
    const { mutate: updatePersonalInformation, isPending } = useUpdatePersonalInformation();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phone: "",
            city: "",
            street: "",
            buildingNumber: "",
            zipCode: ""
        }
    });

    useEffect(() => {
        if (personalInformation) {
            form.reset({
                firstName: personalInformation.firstName,
                lastName: personalInformation.lastName,
                phone: personalInformation.phone,
                city: personalInformation.address?.city ?? "",
                street: personalInformation.address?.street ?? "",
                buildingNumber: personalInformation.address?.buildingNumber ?? "",
                zipCode: personalInformation.address?.zipCode ?? ""
            });
        }
    }, [personalInformation, form]);

    useEffect(() => {
        if (isError && error) {
            void errorResponseHandler(error instanceof Error ? error : new Error("Failed to load personal information"), intl);
        }
    }, [isError, error, intl]);

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        const payload: IUpdatePersonalInformationReq = {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            address: {
                city: data.city,
                street: data.street,
                buildingNumber: data.buildingNumber,
                zipCode: data.zipCode
            }
        };

        updatePersonalInformation(payload, {
            onSuccess: () => {
                toast.success(intl.formatMessage({ id: "Profile.UpdateSuccess" }));
            },
            onError: async (mutationError) => {
                await errorResponseHandler(mutationError as Error, intl);
            }
        });
    };

    if (isLoading) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle><FormattedMessage id="Profile.EditProfile" /></CardTitle>
                    <CardDescription><FormattedMessage id="Profile.EditDescription" /></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 py-10">
                        <LoaderIcon className="size-5 animate-spin" aria-hidden="true" />
                        <span>{intl.formatMessage({ id: "Actions.Loading" })}</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle><FormattedMessage id="Profile.EditProfile" /></CardTitle>
                    <CardDescription><FormattedMessage id="Profile.EditDescription" /></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-muted-foreground">
                            <FormattedMessage id="Profile.LoadError" />
                        </p>
                        <Button variant="outline" className="w-fit" onClick={() => void refetch()}>
                            <FormattedMessage id="Actions.Retry" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle><FormattedMessage id="Profile.EditProfile" /></CardTitle>
                <CardDescription><FormattedMessage id="Profile.EditDescription" /></CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form id="EditProfileForm" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FieldGroup>
                        <Field>
                            <Field className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Controller
                                    name="firstName"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="EditProfileForm_FirstName">
                                                <FormattedMessage id="Profile.FirstName" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="EditProfileForm_FirstName"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="John"
                                                autoComplete="given-name"
                                                disabled={isPending}
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
                                            <FieldLabel htmlFor="EditProfileForm_LastName">
                                                <FormattedMessage id="Profile.LastName" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="EditProfileForm_LastName"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Doe"
                                                autoComplete="family-name"
                                                disabled={isPending}
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
                                    <FieldLabel htmlFor="EditProfileForm_Phone">
                                        <FormattedMessage id="Profile.PhoneNumber" />
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="EditProfileForm_Phone"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="+421xxxxxxxxx"
                                        autoComplete="tel"
                                        disabled={isPending}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Field>
                            <Field className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Controller
                                    name="city"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="EditProfileForm_City">
                                                <FormattedMessage id="Profile.City" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="EditProfileForm_City"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Nitra"
                                                autoComplete="address-level2"
                                                disabled={isPending}
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
                                            <FieldLabel htmlFor="EditProfileForm_Street">
                                                <FormattedMessage id="Profile.Street" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="EditProfileForm_Street"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Štefánikova trieda"
                                                autoComplete="address-line1"
                                                disabled={isPending}
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
                            <Field className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Controller
                                    name="buildingNumber"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="EditProfileForm_BuildingNumber">
                                                <FormattedMessage id="Profile.BuildingNumber" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="EditProfileForm_BuildingNumber"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="77/54"
                                                autoComplete="off"
                                                disabled={isPending}
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
                                            <FieldLabel htmlFor="EditProfileForm_ZipCode">
                                                <FormattedMessage id="Profile.PostalCode" />
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="EditProfileForm_ZipCode"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="949 01"
                                                autoComplete="postal-code"
                                                disabled={isPending}
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
                            <div className="flex flex-col gap-3 md:flex-row">
                                <Button
                                    type="submit"
                                    form="EditProfileForm"
                                    disabled={isPending}
                                    className="flex-1"
                                >
                                    {isPending && (
                                        <LoaderIcon
                                            role="status"
                                            aria-label="Loading"
                                            className="size-4 animate-spin md:mr-2"
                                        />
                                    )}
                                    <FormattedMessage id={isPending ? "Profile.Saving" : "Profile.SaveChanges"} />
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate({ to: "/" })}
                                    disabled={isPending}
                                    className="flex-1"
                                >
                                    <FormattedMessage id="Profile.Cancel" />
                                </Button>
                            </div>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
};

export default ChangePersonalInformationForm;