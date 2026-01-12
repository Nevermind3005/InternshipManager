import * as React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FormattedMessage } from "react-intl";

const INTERNSHIP_STATES = [
    { value: "all", labelId: "Filter.State.All" },
    { value: "Created", labelId: "Internship.State.Created" },
    { value: "Confirmed", labelId: "Internship.State.Confirmed" },
    { value: "Rejected", labelId: "Internship.State.Rejected" },
    { value: "Approved", labelId: "Internship.State.Approved" },
    { value: "Passed", labelId: "Internship.State.Passed" },
    { value: "Failed", labelId: "Internship.State.Failed" },
];

interface StateSelectFieldProps {
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    id?: string;
    "aria-invalid"?: boolean;
    disabled?: boolean;
}

const StateSelectField = React.forwardRef<HTMLButtonElement, StateSelectFieldProps>(
    ({ value, onChange, onBlur, id, "aria-invalid": ariaInvalid, disabled }, ref) => {
        return (
            <Select
                value={value || "all"}
                onValueChange={(val) => onChange?.(val)}
                disabled={disabled}
            >
                <SelectTrigger
                    ref={ref}
                    id={id}
                    aria-invalid={ariaInvalid}
                    onBlur={onBlur}
                    className="w-full"
                >
                    <SelectValue placeholder={<FormattedMessage id="Filter.State.All" />} />
                </SelectTrigger>
                <SelectContent>
                    {INTERNSHIP_STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                            <FormattedMessage id={state.labelId} />
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }
);

StateSelectField.displayName = "StateSelectField";

export default StateSelectField;
