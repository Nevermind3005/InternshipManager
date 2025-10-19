import { useEffect } from "react";
import { useThemeStore } from "../../store/useThemeStore";

export function ThemeInitializer() {
    const { theme, applyTheme } = useThemeStore();

    useEffect(() => {
        applyTheme(theme);
    }, [theme, applyTheme]);

    return null;
}
