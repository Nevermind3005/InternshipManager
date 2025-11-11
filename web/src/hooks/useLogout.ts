import { API } from "@/api/api";
import { authHttpClient } from "@/api/http";
import router from "@/lib/router";
import { useAuthStore } from "@/store/useAuthStore";

export function useLogout() {
    const clearStore = useAuthStore((state) => state.clearStore);
    const handleLogout = async () => { 
        try {
            await authHttpClient.post(API.Endpoints.Auth.Logout());
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            clearStore();
            router.navigate({ to: '/' });
        }
    };

    return { userLogout: handleLogout };
}