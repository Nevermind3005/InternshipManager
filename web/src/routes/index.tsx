import { createFileRoute } from '@tanstack/react-router';
import { Landing } from '@/components/Landing';
import { requireAnonymous } from '@/lib/authGuard';

export const Route = createFileRoute('/')({
    component: Landing,
    beforeLoad: requireAnonymous(),
    loader: () => ({
        crumb: 'Home'
    })
});
