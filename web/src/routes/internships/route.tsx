import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/store/useAuthStore';

export const Route = createFileRoute('/internships')({
    component: RouteComponent,
    beforeLoad: ({ location }) => {
        const { role } = useAuthStore.getState();
        const allowedRoles = ['Student', 'InternshipHandler', 'CompanyRepresentative'];
        if (!allowedRoles.includes(role)) {
            throw redirect({
                to: '/',
                search: {
                    redirect: location.href
                }
            });
        }
    },
    loader: () => ({
        crumb: 'Internships'
    })
});

function RouteComponent() {
    return <Outlet />;
}
