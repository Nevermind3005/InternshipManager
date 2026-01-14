import { createFileRoute } from '@tanstack/react-router';
import EditInternshipForm from '@/components/forms/EditInternshipForm';

export const Route = createFileRoute('/dashboard/internships/edit/$internshipId')({
    component: RouteComponent,
    loader: () => ({
        crumb: 'Edit'
    })
});

function RouteComponent() {
    const { internshipId } = Route.useParams();
    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            <EditInternshipForm internshipId={internshipId} />
        </div>
    );
}

