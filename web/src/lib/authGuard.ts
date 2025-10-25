import { useAuthStore, type Role } from "@/store/useAuthStore";
import { redirect } from "@tanstack/react-router";


export const requireRole = (allowedRoles: Role[]) => {
    return () => {
        const { role } = useAuthStore.getState();
        if (!allowedRoles.includes(role)) {
            throw redirect({
                to: '/',
                search: {
                    redirect: location.href
                }
            });
        }
    };
};