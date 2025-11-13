import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/store/useAuthStore';

export const Route = createFileRoute('/internships')({
    component: RouteComponent,
    beforeLoad: ({ location }) => {
        // Allow anonymous access to the view route
        if (location.pathname.startsWith('/internships/view/')) {
            return; // Skip role check for view route
        }
        // For other routes, require authentication
        const { role } = useAuthStore.getState();
        const allowedRoles = ['Student', 'InternshipHandler', 'Company'];
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
