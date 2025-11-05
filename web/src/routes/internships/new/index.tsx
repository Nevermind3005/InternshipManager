import CreateInternshipForm from '@/components/forms/CreateInternshipForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/internships/new/')({
    component: RouteComponent,
    loader: () => ({
        crumb: 'New'
    })
});

function RouteComponent() {
    return (
        <div className="flex h-full w-full p-6 md:p-10">
            <div className="w-full max-w-m">
                <CreateInternshipForm />
            </div>
        </div>
    );
}
