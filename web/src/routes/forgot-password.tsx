import ForgotPasswordForm from '@/components/forms/ForgotPasswordForm';
import { requireAnonymous } from '@/lib/authGuard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/forgot-password')({
    component: RouteComponent,
    beforeLoad: requireAnonymous(),
    loader: () => ({
        crumb: 'Forgot Password'
    })
});

function RouteComponent() {
    return (
        <div className="flex h-full w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <ForgotPasswordForm />
            </div>
        </div>
    );
}
