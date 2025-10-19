import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "dark" | "light" | "system";

type ThemeStore = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  applyTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set) => ({
            theme: "system",
            setTheme: (theme) => {
                set({ theme });
                // Apply immediately whenever theme changes
                const root = window.document.documentElement;
                root.classList.remove("light", "dark");

                if (theme === "system") {
                    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "dark"
                        : "light";
                    root.classList.add(systemTheme);
                } else {
                    root.classList.add(theme);
                }
            },
            applyTheme: (theme) => {
                const root = window.document.documentElement;
                root.classList.remove("light", "dark");

                if (theme === "system") {
                    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "dark"
                        : "light";
                    root.classList.add(systemTheme);
                } else {
                    root.classList.add(theme);
                }
            },
        }),
        {
            name: "Aerith_UserInterfaceTheme",
        }
    )
);