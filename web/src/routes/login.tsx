import LoginForm from '@/components/forms/LoginForm';
import { requireAnonymous } from '@/lib/authGuard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
    component: RouteComponent,
    beforeLoad: requireAnonymous(),
    loader: () => ({
        crumb: 'Login'
    })
});

function RouteComponent() {
    return (
        <div className="flex h-full w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
    );
}
