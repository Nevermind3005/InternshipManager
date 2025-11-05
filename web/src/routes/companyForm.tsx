import CompanyForm from '@/components/forms/CompanyForm';
import { requireRole } from '@/lib/authGuard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/companyForm')({
    component: RouteComponent,
    beforeLoad: requireRole(['Student']),
    loader: () => ({
        crumb: 'Company Form'
    })
});

function RouteComponent() {
    return (
        <div className="flex h-full w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <CompanyForm />
            </div>
        </div>
    );
}