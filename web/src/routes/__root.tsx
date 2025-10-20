import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { AppSidebar } from './sidebar';

const RootLayout = () => {
    return (<>
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <Toaster position="top-center" richColors />
                <SidebarTrigger />
                <Outlet />
                {/* <TanStackRouterDevtools /> */}

            </main>
        </SidebarProvider>
    </>);
};

export const Route = createRootRoute({ component: RootLayout });