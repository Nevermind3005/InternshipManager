import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface IAuthTokenState {
    accessToken: string,
    refreshToken: string;
    setAccessToken: (accessToken: string) => void;
    setRefreshToken: (refreshToken: string) => void;
    clearTokens: () => void;
};

export const useAuthStore = create<IAuthTokenState>()(
    devtools(
        persist(
            (set) => ({
                accessToken: '',
                refreshToken: '',
                setAccessToken: (newAccessToken) => set({ accessToken: newAccessToken }, undefined, 'auth/setAccessToken'),
                setRefreshToken: (newRefreshToken) => set({ refreshToken: newRefreshToken }, undefined, 'auth/setRefreshToken'),
                clearTokens: () => set({ accessToken: '', refreshToken: '' }, undefined, 'auth/clearTokens')
            }),
            {
                name: 'AuthStore'
            }
        ),
        {
            name: 'AuthStore'
        }
    )
);
