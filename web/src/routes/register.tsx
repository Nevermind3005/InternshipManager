import RegisterForm from '@/components/forms/RegisterForm';
import { requireRole } from '@/lib/authGuard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register')({
    component: RouteComponent,
    beforeLoad: requireRole(['None'])
});

function RouteComponent() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <RegisterForm />
            </div>
        </div>
    );
}
