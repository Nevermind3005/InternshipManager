import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/account/profile/')({
    component: RouteComponent,
    loader: () => ({
        crumb: 'Profile'
    })
});

function RouteComponent() {
    return <div>Test</div>;
}
