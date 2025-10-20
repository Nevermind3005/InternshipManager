import { useThemeStore } from "../store/useThemeStore";
import { Switch } from "./ui/switch";
import { Sun, Moon } from "lucide-react";

const ThemeSwitch = () => {
    const { theme, setTheme } = useThemeStore();

    return (
        <div className="flex items-center space-x-2 mt-2">
            {theme === "dark" ? (
                <Moon className="h-5 w-5 text-gray-300" />
            ) : (
                <Sun className="h-5 w-5 text-yellow-500" />
            )}
            <Switch
                id="theme-switch"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
        </div>
    );
};

export default ThemeSwitch;
