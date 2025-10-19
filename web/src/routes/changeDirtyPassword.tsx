import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/changeDirtyPassword')({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Your password need's to be changed</div>;
}
