import CreateInternshipHandler from '@/components/forms/CreateInternshipHandler';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/test')({
    component: RouteComponent,
});

function RouteComponent() {
    return <CreateInternshipHandler />;
}
