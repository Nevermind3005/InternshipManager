import { createFileRoute } from '@tanstack/react-router';
import { InternshipView } from '@/components/InternshipView';
import { z } from 'zod';

const searchSchema = z.object({
    token: z.string().optional(),
});

export const Route = createFileRoute('/internships/view/$internshipId')({
    component: RouteComponent,
    validateSearch: searchSchema,
});

function RouteComponent() {
    const { internshipId } = Route.useParams();
    const { token } = Route.useSearch();
    return <InternshipView internshipId={internshipId} token={token} showActions={true} />;
}

