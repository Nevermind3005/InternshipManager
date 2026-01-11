import ResetPasswordForm from '@/components/forms/ResetPasswordForm';
import { requireRole } from '@/lib/authGuard';
import { createFileRoute } from '@tanstack/react-router';
import * as z from 'zod';

const resetPasswordSearchSchema = z.object({
    token: z.string().optional().default('')
});

export const Route = createFileRoute('/reset-password')({
    component: RouteComponent,
    beforeLoad: requireRole(['None']),
    validateSearch: resetPasswordSearchSchema,
    loader: () => ({
        crumb: 'Reset Password'
    })
});

function RouteComponent() {
    const { token } = Route.useSearch();
    
    return (
        <div className="flex h-full w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <ResetPasswordForm token={token} />
            </div>
        </div>
    );
}
