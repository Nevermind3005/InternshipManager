import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface YearSelectFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  id?: string;
  'aria-invalid'?: boolean;
  disabled?: boolean;
  placeholder?: string;
  startYear?: number;
  endYear?: number;
  reverseOrder?: boolean;
}

const YearSelectField = React.forwardRef<
  HTMLButtonElement,
  YearSelectFieldProps
>(
    (
        {
            value,
            onChange,
            onBlur,
            id,
            'aria-invalid': ariaInvalid,
            disabled,
            placeholder = 'Select year',
            startYear = new Date().getFullYear() - 2,
            endYear = new Date().getFullYear() + 2,
            reverseOrder = true,
        },
        ref
    ) => {
        const years = React.useMemo(() => {
            const yearArray = [];
            for (let year = startYear; year <= endYear; year++) {
                yearArray.push(year);
            }
            return reverseOrder ? yearArray.reverse() : yearArray;
        }, [startYear, endYear, reverseOrder]);

        return (
            <Select
                value={value}
                onValueChange={onChange}
                disabled={disabled}
            >
                <SelectTrigger
                    ref={ref}
                    id={id}
                    aria-invalid={ariaInvalid}
                    onBlur={onBlur}
                    className="w-full"
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                            {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }
);

export default YearSelectField;
