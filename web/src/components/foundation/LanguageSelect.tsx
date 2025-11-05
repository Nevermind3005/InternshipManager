import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguageStore, type Language } from "@/store/useLanguageStore";
import { Check, Globe } from "lucide-react";
import { FormattedMessage } from "react-intl";

const LanguageSelect = () => {
    const { locale, setLocale } = useLanguageStore();

    const availableLanguages = [
        { code: "en-US", label: "English" },
        { code: "sk-SK", label: "Slovenský" },
    ];

    const currentLang = availableLanguages.find((l) => l.code === locale);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-28 justify-center">
                    <Globe className="h-4 w-4" />
                    <span className="pb-[1px]">{currentLang?.label ?? "Select language"}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                className="w-[--radix-dropdown-menu-trigger-width]"
            >
                <DropdownMenuLabel><FormattedMessage id="Field.SelectLanguage"/></DropdownMenuLabel>
                {availableLanguages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLocale(lang.code as Language)}
                        className="flex items-center justify-between"
                    >
                        {lang.label}
                        {locale === lang.code && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageSelect;
