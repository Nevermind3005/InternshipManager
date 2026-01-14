import { createFileRoute } from '@tanstack/react-router';
import { InternshipView } from '@/components/InternshipView';
import { useAuthStore } from '@/store/useAuthStore';

export const Route = createFileRoute('/dashboard/internships/detail/$internshipId')({
    component: RouteComponent,
    loader: () => ({
        crumb: 'Detail'
    })
});

function RouteComponent() {
    const { internshipId } = Route.useParams();
    const role = useAuthStore((state) => state.role);
    const showActions = role === 'CompanyRepresentative' || role === 'InternshipHandler';

    return <InternshipView internshipId={internshipId} showActions={showActions} />;
}
