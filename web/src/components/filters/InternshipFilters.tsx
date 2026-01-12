import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormattedMessage, useIntl } from "react-intl";
import { X } from "lucide-react";
import YearSelectField from "@/components/foundation/fields/YearSelectField";
import { SemesterSelectField } from "@/components/foundation/fields/SemesterSelectField";
import StudyProgramSelectField from "@/components/foundation/fields/StudyProgramSelectField";
import StateSelectField from "@/components/foundation/fields/StateSelectField";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent } from "@/components/ui/card";

interface FilterValues {
    name?: string;
    year?: string;
    semester?: string;
    studyProgramId?: string;
    company?: string;
    firstName?: string;
    lastName?: string;
    state?: string;
}

interface InternshipFiltersProps {
    filters: FilterValues;
    onFilterChange: (key: keyof FilterValues, value: string) => void;
    onClearFilters: () => void;
}

const InternshipFilters = ({ filters, onFilterChange, onClearFilters }: InternshipFiltersProps) => {
    const intl = useIntl();
    const { role } = useAuthStore();
    const isTeacher = role === "InternshipHandler";

    const hasActiveFilters = Object.values(filters).some(v => v && v !== "");

    return (
        <Card className="mb-4">
            <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">
                        <FormattedMessage id="Filter.Title" />
                    </h3>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearFilters}
                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4 mr-1" />
                            <FormattedMessage id="Filter.Clear" />
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Názov */}
                    <div className="space-y-1">
                        <Label htmlFor="filter-name" className="text-xs">
                            <FormattedMessage id="Filter.Name" />
                        </Label>
                        <Input
                            id="filter-name"
                            placeholder={intl.formatMessage({ id: "Filter.Name.Placeholder" })}
                            value={filters.name || ""}
                            onChange={(e) => onFilterChange("name", e.target.value)}
                            className="h-9"
                        />
                    </div>

                    {/* Rok */}
                    <div className="space-y-1">
                        <Label htmlFor="filter-year" className="text-xs">
                            <FormattedMessage id="Filter.Year" />
                        </Label>
                        <YearSelectField
                            id="filter-year"
                            value={filters.year || ""}
                            onChange={(val) => onFilterChange("year", val)}
                            placeholder={intl.formatMessage({ id: "Filter.Year.Placeholder" })}
                        />
                    </div>

                    {/* Semester */}
                    <div className="space-y-1">
                        <Label htmlFor="filter-semester" className="text-xs">
                            <FormattedMessage id="Filter.Semester" />
                        </Label>
                        <SemesterSelectField
                            id="filter-semester"
                            value={filters.semester || ""}
                            onChange={(val) => onFilterChange("semester", val)}
                            onBlur={() => {}}
                        />
                    </div>

                    {/* Študijný program */}
                    <div className="space-y-1">
                        <Label htmlFor="filter-studyProgram" className="text-xs">
                            <FormattedMessage id="Filter.StudyProgram" />
                        </Label>
                        <StudyProgramSelectField
                            id="filter-studyProgram"
                            value={filters.studyProgramId || ""}
                            onChange={(val) => onFilterChange("studyProgramId", val)}
                        />
                    </div>

                    {/* Firma */}
                    <div className="space-y-1">
                        <Label htmlFor="filter-company" className="text-xs">
                            <FormattedMessage id="Filter.Company" />
                        </Label>
                        <Input
                            id="filter-company"
                            placeholder={intl.formatMessage({ id: "Filter.Company.Placeholder" })}
                            value={filters.company || ""}
                            onChange={(e) => onFilterChange("company", e.target.value)}
                            className="h-9"
                        />
                    </div>

                    {/* Meno študenta - len pre učiteľa */}
                    {isTeacher && (
                        <>
                            <div className="space-y-1">
                                <Label htmlFor="filter-firstName" className="text-xs">
                                    <FormattedMessage id="Filter.FirstName" />
                                </Label>
                                <Input
                                    id="filter-firstName"
                                    placeholder={intl.formatMessage({ id: "Filter.FirstName.Placeholder" })}
                                    value={filters.firstName || ""}
                                    onChange={(e) => onFilterChange("firstName", e.target.value)}
                                    className="h-9"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="filter-lastName" className="text-xs">
                                    <FormattedMessage id="Filter.LastName" />
                                </Label>
                                <Input
                                    id="filter-lastName"
                                    placeholder={intl.formatMessage({ id: "Filter.LastName.Placeholder" })}
                                    value={filters.lastName || ""}
                                    onChange={(e) => onFilterChange("lastName", e.target.value)}
                                    className="h-9"
                                />
                            </div>
                        </>
                    )}

                    {/* Stav */}
                    <div className="space-y-1">
                        <Label htmlFor="filter-state" className="text-xs">
                            <FormattedMessage id="Filter.State" />
                        </Label>
                        <StateSelectField
                            id="filter-state"
                            value={filters.state || ""}
                            onChange={(val) => onFilterChange("state", val === "all" ? "" : val)}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default InternshipFilters;
