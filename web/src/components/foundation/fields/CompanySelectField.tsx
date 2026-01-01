import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useGetAllCompanies } from "@/api/hooks/useGetAllCompanies";

interface CompanySelectProps {
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    placeholder?: string;
    id?: string;
    "aria-invalid"?: boolean;
}

// TODO add translations
export const CompanySelectField: React.FC<CompanySelectProps> = ({
    value,
    onChange,
    onBlur,
    placeholder = "Select company...",
    id,
    "aria-invalid": ariaInvalid,
}) => {
    const [open, setOpen] = React.useState(false);
    const { data: companies, isLoading } = useGetAllCompanies();

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-invalid={ariaInvalid}
                    onBlur={onBlur}
                    className="w-[200px] justify-between"
                >
                    {isLoading
                        ? "Loading..."
                        : value
                            ? (() => {
                                const selectedCompany = companies?.find((c) => c.id === value);
                                return selectedCompany
                                    ? `${selectedCompany.name} - ${selectedCompany.address.street} ${selectedCompany.address.buildingNumber} ${selectedCompany.address.city} ${selectedCompany.address.zipCode}`
                                    : placeholder;
                            })()
                            : placeholder}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-full min-w[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search company..." />
                    <CommandList>
                        <CommandEmpty>No company found.</CommandEmpty>
                        <CommandGroup>
                            {companies?.map((company) => (
                                <CommandItem
                                    key={company.id}
                                    value={company.name.toLocaleLowerCase()}
                                    onSelect={() => {
                                        onChange?.(company.id);
                                        setOpen(false);
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === company.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {`${company.name} - ${company.address.street} ${company.address.buildingNumber} ${company.address.city} ${company.address.zipCode}`}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default CompanySelectField;