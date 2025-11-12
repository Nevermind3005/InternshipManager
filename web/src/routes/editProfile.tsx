import ChangePersonalInformationForm from '@/components/forms/ChangePersonalInformationForm';
import { requireRole } from '@/lib/authGuard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/editProfile')({
    component: RouteComponent,
    beforeLoad: requireRole(['None']),
    loader: () => ({
        crumb: 'EditProfile'
    })
});

function RouteComponent() {
    return (
        <div className="flex h-full w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <ChangePersonalInformationForm />
            </div>
        </div>
    );
}