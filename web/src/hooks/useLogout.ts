import { API } from "@/api/api";
import { authHttpClient } from "@/api/http";
import router from "@/lib/router";
import { useAuthStore } from "@/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";

export function useLogout() {
    const clearStore = useAuthStore((state) => state.clearStore);
    const queryClient = useQueryClient();

    const handleLogout = async () => { 
        try {
            await authHttpClient.post(API.Endpoints.Auth.Logout());
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            clearStore();
            queryClient.clear();
            router.navigate({ to: '/' });
        }
    };

    return { userLogout: handleLogout };
}