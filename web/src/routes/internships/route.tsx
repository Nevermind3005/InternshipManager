import { requireRole } from '@/lib/authGuard';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/internships')({
    component: RouteComponent,
    beforeLoad: requireRole(['Student', 'InternshipHandler', 'Company']),
    loader: () => ({
        crumb: 'Internships'
    })
});

function RouteComponent() {
    return <Outlet />;
}
