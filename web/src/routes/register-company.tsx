import CompanyRegisterForm from '@/components/forms/CompanyRegisterForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register-company')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <CompanyRegisterForm />
        </div>
    );
}
