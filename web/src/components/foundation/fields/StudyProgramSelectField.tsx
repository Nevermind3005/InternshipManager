import * as React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetAllStudyPrograms } from "@/api/hooks/useGetAllStudyPrograms";
import { FormattedMessage } from "react-intl";

interface StudyProgramSelectFieldProps {
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    id?: string;
    "aria-invalid"?: boolean;
    disabled?: boolean;
    placeholder?: string;
}

const StudyProgramSelectField = React.forwardRef<
    HTMLButtonElement,
    StudyProgramSelectFieldProps
>(
    (
        {
            value,
            onChange,
            onBlur,
            id,
            "aria-invalid": ariaInvalid,
            disabled,
            placeholder,
        },
        ref
    ) => {
        const { data: studyPrograms, isLoading } = useGetAllStudyPrograms();

        return (
            <Select
                value={value}
                onValueChange={onChange}
                disabled={disabled || isLoading}
            >
                <SelectTrigger
                    ref={ref}
                    id={id}
                    aria-invalid={ariaInvalid}
                    onBlur={onBlur}
                    className="w-full"
                >
                    <SelectValue placeholder={placeholder || <FormattedMessage id="Field.StudyProgram.Select" />} />
                </SelectTrigger>
                <SelectContent>
                    {isLoading ? (
                        <SelectItem value="loading" disabled>
                            <FormattedMessage id="Actions.Loading" />
                        </SelectItem>
                    ) : studyPrograms && studyPrograms.length > 0 ? (
                        studyPrograms.map((program) => (
                            <SelectItem key={program.id} value={program.id}>
                                {program.code}
                            </SelectItem>
                        ))
                    ) : (
                        <SelectItem value="empty" disabled>
                            <FormattedMessage id="Field.StudyProgram.Empty" />
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>
        );
    }
);

StudyProgramSelectField.displayName = "StudyProgramSelectField";

export default StudyProgramSelectField;
