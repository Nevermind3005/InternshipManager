import LoginForm from '@/components/forms/LoginForm';
import { requireRole } from '@/lib/authGuard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
    component: RouteComponent,
    beforeLoad: requireRole(['None'])
});

function RouteComponent() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
    );
}
