import { createFileRoute } from '@tanstack/react-router';
import { FormattedMessage } from 'react-intl';
import ChangePersonalInformationForm from '@/components/forms/ChangePersonalInformationForm';
import ProfileSummaryCard from '@/components/profile/ProfileSummaryCard';

export const Route = createFileRoute('/account/profile/')({
    component: RouteComponent,
    loader: () => ({
        crumb: 'Profile'
    })
});

function RouteComponent() {
    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            <header className="mb-8 space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    <FormattedMessage id="Profile.MyProfile" />
                </h1>
                <p className="text-sm text-muted-foreground sm:text-base">
                    <FormattedMessage id="Profile.ViewDescription" />
                </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] xl:gap-8">
                <ProfileSummaryCard />
                <ChangePersonalInformationForm />
            </div>
        </div>
    );
}
