import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en-US" | "sk-SK";

interface ILanguageState {
    locale: Language,
    setLocale: (lang: Language) => void;
};

export const useLanguageStore = create<ILanguageState>()(
    persist(
        (set) => ({
            locale: 'sk-SK',
            setLocale: (lang) => set({ locale: lang })
        }),
        {
            name: 'LanguageStore'
        }
    )
);
