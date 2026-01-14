import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { useState, forwardRef } from "react";
import { format } from "date-fns";

interface DatePickerFieldProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  "aria-invalid"?: boolean;
}

const DatePickerField = forwardRef<HTMLButtonElement, DatePickerFieldProps>(
    (
        {
            value,
            onChange,
            placeholder = "Select date",
            disabled = false,
            id,
            "aria-invalid": ariaInvalid,
        },
        ref
    ) => {
        const [open, setOpen] = useState(false);

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        variant="outline"
                        id={id}
                        className={`w-full justify-between font-normal ${
                            ariaInvalid ? "border-red-500" : ""
                        }`}
                        disabled={disabled}
                        type="button"
                    >
                        {value ? format(value, "PPP") : placeholder}
                        <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={(date) => {
                            onChange?.(date);
                            setOpen(false);
                        }}
                        captionLayout="dropdown"
                        startMonth={new Date(2000, 0)}
                        endMonth={new Date(new Date().getFullYear() + 50, 0)}
                        disabled={disabled}
                    />
                </PopoverContent>
            </Popover>
        );
    }
);

DatePickerField.displayName = "DatePickerField";

export default DatePickerField;