import { FormattedMessage } from "react-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { LoaderIcon, MapPin, Phone } from "lucide-react";
import { useGetPersonalInformation } from "@/api/hooks/useGetPersonalInformation";

const ProfileSummaryCard = () => {
    const { data, isLoading, isError, refetch } = useGetPersonalInformation();

    if (isLoading) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle><FormattedMessage id="Profile.PersonalInformation" /></CardTitle>
                    <CardDescription><FormattedMessage id="Profile.ViewDescription" /></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
                        <LoaderIcon className="size-4 animate-spin" aria-hidden="true" />
                        <FormattedMessage id="Actions.Loading" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isError || !data) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle><FormattedMessage id="Profile.PersonalInformation" /></CardTitle>
                    <CardDescription><FormattedMessage id="Profile.ViewDescription" /></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-muted-foreground">
                            <FormattedMessage id="Profile.LoadError" />
                        </p>
                        <Button variant="outline" className="w-fit" onClick={() => void refetch()}>
                            <FormattedMessage id="Actions.Retry" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const addressLine = [
        data.address?.street,
        data.address?.buildingNumber
    ].filter(Boolean).join(" ");

    const cityLine = [
        data.address?.zipCode,
        data.address?.city
    ].filter(Boolean).join(" ");

    const renderValue = (value?: string) => value && value.trim().length > 0
        ? value
        : <span className="text-muted-foreground/70">—</span>;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">
                    {data.firstName} {data.lastName}
                </CardTitle>
                <CardDescription>
                    <FormattedMessage id="Profile.PersonalInformation" />
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <FormattedMessage id="Profile.PhoneNumber" />
                    </p>
                    <div className="flex items-center gap-3 text-base font-medium text-foreground">
                        <Phone className="size-4 text-muted-foreground" aria-hidden="true" />
                        <span>{renderValue(data.phone)}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <FormattedMessage id="Profile.Address" />
                    </p>
                    <div className="flex items-start gap-3 text-base font-medium text-foreground">
                        <MapPin className="size-4 text-muted-foreground" aria-hidden="true" />
                        <div className="space-y-1">
                            <span className="block">{renderValue(addressLine)}</span>
                            <span className="block">{renderValue(cityLine)}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProfileSummaryCard;
