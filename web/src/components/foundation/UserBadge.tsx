import { useGetPersonalInformation } from "@/api/hooks/useGetPersonalInformation";
import { useAuthStore } from "@/store/useAuthStore";
import { Badge } from "../ui/badge";
import { Loader2, UserCircle } from "lucide-react";
import { useIntl } from "react-intl";

export const UserBadge = () => {
    const role = useAuthStore((state) => state.role);
    const userId = useAuthStore((state) => state.userId);
    const { data, isLoading } = useGetPersonalInformation();
    const intl = useIntl();

    if (!userId || role === "None") {
        return null;
    }

    const roleLabel = intl.formatMessage({ id: `Roles.${role}.Label`, defaultMessage: role });

    return (
        <div className="flex items-center gap-3 rounded-full border border-border/60 bg-background px-3 py-1 shadow-sm">
            <UserCircle className="size-5 text-muted-foreground" aria-hidden="true" />
            <div className="flex flex-col leading-tight">
                <span className="text-sm font-medium text-foreground">
                    {isLoading ? (
                        <span className="flex items-center gap-1 text-muted-foreground">
                            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                            {intl.formatMessage({ id: "Actions.Loading" })}
                        </span>
                    ) : (
                        data ? `${data.firstName} ${data.lastName}` : intl.formatMessage({ id: "Profile.UnknownUser", defaultMessage: "Unknown user" })
                    )}
                </span>
                <Badge variant="secondary" className="mt-1 w-fit text-xs font-normal uppercase tracking-wide">
                    {roleLabel}
                </Badge>
            </div>
        </div>
    );
};

export default UserBadge;
