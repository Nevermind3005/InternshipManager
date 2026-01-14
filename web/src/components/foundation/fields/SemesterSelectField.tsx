// SemesterSelect.tsx
import * as React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'; // Adjust path based on your shad-cn setup
import { FormattedMessage } from 'react-intl';

/**
 * Props for the SemesterSelect component.
 * This ensures compatibility with React Hook Form's Controller field props.
 */
interface SemesterSelectProps {
  /** The currently selected value (e.g., "summer" or "winter"). */
  value: string;
  /** Callback function to update the value. */
  onChange: (value: string) => void;
  /** Callback function for blur event (used by RHF for touch/validation). */
  onBlur: () => void;
  /** Optional ID for accessibility purposes. */
  id?: string;
  /** Optional disabled state. */
  disabled?: boolean;
  /** Optional accessibility invalid state. */
  'aria-invalid'?: boolean;
}

/**
 * A shad-cn Select component tailored for selecting a semester (Summer/Winter).
 * It's designed to be used within React Hook Form's Controller.
 */
export const SemesterSelectField: React.FC<SemesterSelectProps> = ({
    value,
    onChange,
    onBlur,
    id,
    disabled,
    'aria-invalid': ariaInvalid,
}) => {
    // The shad-cn Select component requires the value to be a string,
    // which matches the Controller's field.value.
    return (
        <Select
            value={value}
            onValueChange={onChange} // Passes the new value to RHF
            onOpenChange={(open) => {
                // Manually trigger onBlur when the select closes, if needed.
                // For 'Select' components, onBlur often tracks when the whole
                // component loses focus. We can use onOpenChange for this.
                if (!open) {
                    onBlur();
                }
            }}
            disabled={disabled}
        >
            <SelectTrigger
                id={id}
                // Use aria-invalid to style the trigger if needed (e.g., with data attributes)
                aria-invalid={ariaInvalid}
                // Explicitly setting onBlur here can sometimes interfere with
                // the native select blur; relying on onOpenChange is often better for RHF
                // with Select components.
            >
                <SelectValue placeholder="Select a semester" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="summer"><FormattedMessage id='Field.Semester.Summer'/></SelectItem>
                <SelectItem value="winter"><FormattedMessage id='Field.Semester.Winter'/></SelectItem>
            </SelectContent>
        </Select>
    );
};