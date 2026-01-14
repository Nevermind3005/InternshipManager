import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/store/useAuthStore';
import LandingPage from '../components/LandingPage';

export const Route = createFileRoute('/')({
    component: LandingPage,
    beforeLoad: () => {
        const { role } = useAuthStore.getState();
        // If user is logged in, redirect to internships
        if (role !== 'None') {
            throw redirect({
                to: '/internships'
            });
        }
    },
    loader: () => ({
        crumb: 'Home'
    })
});
