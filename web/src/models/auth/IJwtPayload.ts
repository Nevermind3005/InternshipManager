import type { Role } from "@/store/useAuthStore";

export interface IJwtPayload {
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role" : Role;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
}