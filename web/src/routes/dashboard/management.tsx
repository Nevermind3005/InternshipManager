import CreateInternshipHandler from '@/components/forms/CreateInternshipHandler';
import { requireRole } from '@/lib/authGuard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/management')({
    component: RouteComponent,
    beforeLoad: requireRole(['InternshipHandler']),
    loader: () => ({
        crumb: 'Management'
    })
    
});

function RouteComponent() {
    return (
        <div className="flex h-full w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <CreateInternshipHandler />
            </div>
        </div>
    );
}
