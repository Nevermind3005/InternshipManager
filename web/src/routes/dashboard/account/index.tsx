import { createFileRoute } from '@tanstack/react-router';
import { FormattedMessage } from 'react-intl';
import ChangePersonalInformationForm from '@/components/forms/ChangePersonalInformationForm';
import ChangePasswordForm from '@/components/forms/ChangePasswordForm';
import ProfileSummaryCard from '@/components/profile/ProfileSummaryCard';
import { requireRole } from '@/lib/authGuard';

export const Route = createFileRoute('/dashboard/account/')({
    component: RouteComponent,
    beforeLoad: requireRole(['Student', 'InternshipHandler', 'CompanyRepresentative']),
    loader: () => ({
        crumb: 'Account'
    })
});

function RouteComponent() {
    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            <header className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    <FormattedMessage id="Account.MyAccount" />
                </h1>
            </header>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] xl:gap-8">
                <div className="flex flex-col gap-6">
                    <ProfileSummaryCard />
                    <ChangePasswordForm />
                </div>
                <ChangePersonalInformationForm />
            </div>
        </div>
    );
}

