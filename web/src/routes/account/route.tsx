import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/account')({
    component: RouteComponent,
    loader: () => ({
        crumb: 'Account'
    })
});

function RouteComponent() {
    return <Outlet />;
}
