import { useMemo } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
    password: string;
}

interface PasswordRequirement {
    id: string;
    label: string;
    test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
    {
        id: "minLength",
        label: "Validation.Password.MinLength",
        test: (password) => password.length >= 8,
    },
    {
        id: "uppercase",
        label: "Validation.Password.Uppercase",
        test: (password) => /[A-Z]/.test(password),
    },
    {
        id: "lowercase",
        label: "Validation.Password.Lowercase",
        test: (password) => /[a-z]/.test(password),
    },
    {
        id: "number",
        label: "Validation.Password.Number",
        test: (password) => /\d/.test(password),
    },
    {
        id: "special",
        label: "Validation.Password.Special",
        test: (password) => /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
    },
];

const strengthLevels = [
    { minScore: 0, label: "PasswordStrength.VeryWeak", color: "bg-red-500" },
    { minScore: 1, label: "PasswordStrength.Weak", color: "bg-orange-500" },
    { minScore: 2, label: "PasswordStrength.Medium", color: "bg-yellow-500" },
    { minScore: 3, label: "PasswordStrength.Strong", color: "bg-lime-500" },
    { minScore: 4, label: "PasswordStrength.VeryStrong", color: "bg-emerald-500" },
];

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
    const { score, passedRequirements } = useMemo(() => {
        const passed = passwordRequirements.map((req) => ({
            ...req,
            passed: req.test(password),
        }));
        const score = passed.filter((r) => r.passed).length;
        return { score, passedRequirements: passed };
    }, [password]);

    const strengthLevel = useMemo(() => {
        // Find the highest level that matches the score
        for (let i = strengthLevels.length - 1; i >= 0; i--) {
            if (score >= strengthLevels[i].minScore) {
                return strengthLevels[i];
            }
        }
        return strengthLevels[0];
    }, [score]);

    const progressWidth = (score / passwordRequirements.length) * 100;

    if (!password) {
        return null;
    }

    return (
        <div className="mt-3 space-y-3">
            {/* Strength bar */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                        <FormattedMessage id="PasswordStrength.Label" />
                    </span>
                    <span className={cn(
                        "font-medium",
                        score <= 1 && "text-red-600 dark:text-red-400",
                        score === 2 && "text-orange-600 dark:text-orange-400",
                        score === 3 && "text-yellow-600 dark:text-yellow-400",
                        score === 4 && "text-lime-600 dark:text-lime-400",
                        score === 5 && "text-emerald-600 dark:text-emerald-400"
                    )}>
                        <FormattedMessage id={strengthLevel.label} />
                    </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className={cn(
                            "h-full transition-all duration-300 ease-out",
                            strengthLevel.color
                        )}
                        style={{ width: `${progressWidth}%` }}
                    />
                </div>
            </div>

            {/* Requirements checklist */}
            <div className="space-y-1.5">
                <p className="text-sm font-medium text-muted-foreground">
                    <FormattedMessage id="PasswordStrength.Requirements" />
                </p>
                <ul className="space-y-1">
                    {passedRequirements.map((req) => (
                        <li
                            key={req.id}
                            className={cn(
                                "flex items-center gap-2 text-sm transition-colors",
                                req.passed
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-muted-foreground"
                            )}
                        >
                            {req.passed ? (
                                <CheckIcon className="size-4" aria-hidden="true" />
                            ) : (
                                <XIcon className="size-4" aria-hidden="true" />
                            )}
                            <FormattedMessage id={req.label} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PasswordStrengthMeter;
