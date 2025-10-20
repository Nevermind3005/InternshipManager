import { useEffect } from "react";
import { useThemeStore } from "../../store/useThemeStore";

export function ThemeInitializer() {
    const initializeTheme = useThemeStore((state) => state.initializeTheme);

    useEffect(() => {
        initializeTheme();
    }, [initializeTheme]);

    return null;
}
