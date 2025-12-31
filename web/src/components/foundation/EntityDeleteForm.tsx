import { Field, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import LoadingButton from "../LoadingButton";
import { errorResponseHandler } from "@/lib/errorResponseHandler";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { KyResponse } from "ky";
import { useIntl } from "react-intl";

interface IEntityDeleteFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    confirmPhrase: string;
    useDeletor: UseMutationResult<KyResponse<unknown>, Error, string, unknown>;
    title: string;
}

const EntityDelteForm = ({ 
    open, 
    onOpenChange, 
    useDeletor, 
    confirmPhrase, 
    title 
} : IEntityDeleteFormProps) => {
    const [value, setValue] = useState("");
    const intl = useIntl();
    const { mutate: deletor, isPending } = useDeletor;

    const onSubmit = () => {
        deletor("data", {
            onError: async (error) => {
                errorResponseHandler(error, intl);
            },
            onSuccess() {
                onOpenChange(false);
            },
        });
    };
  
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>Please type <span className="font-bold">"{confirmPhrase}"</span> to confirm the action</DialogDescription>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                        <Input
                            id="CreateApplication_Name"
                            autoComplete="off"
                            type="text"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setValue(e.target.value); }}
                        />
                    </Field>
                    <Field>
                        <LoadingButton isPending={isPending} disabled={value !== confirmPhrase} variant="destructive">Submit</LoadingButton>
                    </Field>
                </FieldGroup>
            </DialogContent>
        </Dialog>
    );
};

export default EntityDelteForm;