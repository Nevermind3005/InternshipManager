import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type Role = "None" | "Student" | "CompanyRepresentative" | "InternshipHandler";
export const Roles_All : Role[] = ["None", "Student", "CompanyRepresentative", "InternshipHandler"];

interface IAuthTokenState {
    accessToken: string,
    refreshToken: string;
    role: Role,
    userId: string;
    setAccessToken: (accessToken: string) => void;
    setRefreshToken: (refreshToken: string) => void;
    setRole: (role: Role) => void;
    setUserId: (userId: string) => void;
    clearStore: () => void;
};

export const useAuthStore = create<IAuthTokenState>()(
    devtools(
        persist(
            (set) => ({
                accessToken: '',
                refreshToken: '',
                role: 'None',
                userId: '',
                setAccessToken: (newAccessToken) => set({ accessToken: newAccessToken }, undefined, 'auth/setAccessToken'),
                setRefreshToken: (newRefreshToken) => set({ refreshToken: newRefreshToken }, undefined, 'auth/setRefreshToken'),
                setRole: (newRole) => set({ role: newRole }, undefined, 'auth/setRole'),
                setUserId: (newUserId) => set({ userId: newUserId }, undefined, 'auth/setUserId'),
                clearStore: () => set({ accessToken: '', refreshToken: '', role: 'None', userId: '' }, undefined, 'auth/clearStore')
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
