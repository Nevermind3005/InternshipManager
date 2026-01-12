import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import LoadingButton from "../LoadingButton";
import { useCreateStudyProgram } from "@/api/hooks/useCreateStudyProgram";
import { errorResponseHandler } from "@/lib/errorResponseHandler";
import { FormattedMessage, useIntl } from "react-intl";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { useEffect } from "react";
import { toast } from "sonner";

interface ICreateStudyProgramFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
    code: z
        .string()
        .nonempty()
        .min(2)
        .max(16)
});

const CreateStudyProgramForm = ({ open, onOpenChange }: ICreateStudyProgramFormProps) => {
    const intl = useIntl();
    const { mutate: createStudyProgram, isPending } = useCreateStudyProgram();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: ""
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        createStudyProgram(data, {
            onError: async (error) => {
                errorResponseHandler(error, intl);
            },
            onSuccess: () => {
                toast.success(intl.formatMessage({ id: "Settings.StudyPrograms.CreateSuccess" }));
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
                        <FormattedMessage id="Settings.StudyPrograms.Create" />
                    </DialogTitle>
                    <DialogDescription>
                        <FormattedMessage id="Settings.StudyPrograms.CreateDescription" />
                    </DialogDescription>
                </DialogHeader>
                <form id="CreateStudyProgram" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="code"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="CreateStudyProgram_Code">
                                        <FormattedMessage id="Settings.StudyPrograms.Code" />
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="CreateStudyProgram_Code"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="AI22M"
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
                            <LoadingButton isPending={isPending} form="CreateStudyProgram">
                                <FormattedMessage id="Actions.Create" />
                            </LoadingButton>
                        </Field>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateStudyProgramForm;
