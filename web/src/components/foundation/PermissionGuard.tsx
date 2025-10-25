import { useAuthStore, type Role } from "@/store/useAuthStore";

interface IPermissionGuardProps {
  children: React.ReactNode
  roles: Role[]
  fallback?: React.ReactNode
}

export function PermissionGuard({
    children,
    roles = [],
    fallback = null,
}: IPermissionGuardProps) {
    const role = useAuthStore((state) => state.role);

    console.log(role);

    const hasRequiredRoles = roles.length === 0 || roles.includes(role);

    if (hasRequiredRoles) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}