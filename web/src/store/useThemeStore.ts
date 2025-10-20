import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "dark" | "light";

type ThemeStore = {
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
  applyTheme: (theme: Theme) => void;
  initializeTheme: () => void;
};

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set, get) => ({
            theme: null, // no default, will detect system theme
            setTheme: (theme) => {
                set({ theme });
                const root = window.document.documentElement;
                root.classList.remove("light", "dark");
                root.classList.add(theme);
            },
            applyTheme: (theme) => {
                const root = window.document.documentElement;
                root.classList.remove("light", "dark");
                root.classList.add(theme);
            },
            initializeTheme: () => {
                const currentTheme = get().theme;
                if (!currentTheme) {
                    // Detect system theme
                    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                    const systemTheme: Theme = prefersDark ? "dark" : "light";

                    // Set and apply
                    get().setTheme(systemTheme);
                } else {
                    // Just apply stored theme
                    get().applyTheme(currentTheme);
                }
            },
        }),
        {
            name: "ThemeStore",
        }
    )
);
