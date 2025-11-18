import { createFileRoute } from '@tanstack/react-router';
import { InternshipView } from '@/components/InternshipView';

export const Route = createFileRoute('/internships/detail/$internshipId')({
    component: RouteComponent,
    loader: () => ({
        crumb: 'Detail'
    })
});

function RouteComponent() {
    const { internshipId } = Route.useParams();
    return <InternshipView internshipId={internshipId} showActions={false} />;
}
