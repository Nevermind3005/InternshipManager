import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type Role = "None" | "Student" | "Company" | "InternshipHandler";
export const Roles_All : Role[] = ["None", "Student", "Company", "InternshipHandler"];

interface IAuthTokenState {
    accessToken: string,
    refreshToken: string;
    role: Role,
    setAccessToken: (accessToken: string) => void;
    setRefreshToken: (refreshToken: string) => void;
    setRole: (role: Role) => void;
    clearStore: () => void;
};

export const useAuthStore = create<IAuthTokenState>()(
    devtools(
        persist(
            (set) => ({
                accessToken: '',
                refreshToken: '',
                role: 'None',
                setAccessToken: (newAccessToken) => set({ accessToken: newAccessToken }, undefined, 'auth/setAccessToken'),
                setRefreshToken: (newRefreshToken) => set({ refreshToken: newRefreshToken }, undefined, 'auth/setRefreshToken'),
                setRole: (newRole) => set({ role: newRole }, undefined, 'auth/setRole'),
                clearStore: () => set({ accessToken: '', refreshToken: '', role: 'None' }, undefined, 'auth/clearStore')
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
