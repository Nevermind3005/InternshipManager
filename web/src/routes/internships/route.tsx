import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/store/useAuthStore';

export const Route = createFileRoute('/internships')({
    component: RouteComponent,
    beforeLoad: ({ location }) => {
        // Allow anonymous access ONLY to the specific view route with an ID
        // Pattern: /internships/view/{id} (and nothing deeper)
        const viewRoutePattern = /^\/internships\/view\/[^/]+\/?$/;
        if (viewRoutePattern.test(location.pathname)) {
            return; // Skip role check for public view route
        }
        
        // For all other routes, require authentication
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
