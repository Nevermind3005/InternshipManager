import { createFileRoute } from '@tanstack/react-router';
import { InternshipView } from '@/components/InternshipView';
import { useAuthStore } from '@/store/useAuthStore';

export const Route = createFileRoute('/internships/detail/$internshipId')({
    component: RouteComponent,
    loader: () => ({
        crumb: 'Detail'
    })
});

function RouteComponent() {
    const { internshipId } = Route.useParams();
    const role = useAuthStore((state) => state.role);
    const showActions = role === 'CompanyRepresentative';

    return <InternshipView internshipId={internshipId} showActions={showActions} />;
}
