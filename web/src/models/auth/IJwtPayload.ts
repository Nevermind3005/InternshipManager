import type { Role } from "@/store/useAuthStore";

export interface IJwtPayload {
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role" : Role;
}