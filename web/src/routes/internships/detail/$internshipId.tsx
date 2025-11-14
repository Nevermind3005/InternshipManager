import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/internships/detail/$internshipId')({
    component: RouteComponent,
    loader: () => ({
        crumb: 'Detail'
    })
});

function RouteComponent() {
    const { internshipId } = Route.useParams();
    return <div>Internship ID: {internshipId}</div>;
}
