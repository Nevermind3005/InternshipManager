import FloatingActionButton from '@/components/foundation/FloatingActionButton';
import { PermissionGuard } from '@/components/foundation/PermissionGuard';
import { InternshipsTable } from '@/components/tables/InternshipsTable';
import router from '@/lib/router';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/internships/')({
    component: RouteComponent,
});

function RouteComponent() {
    return (        
        <div className="flex flex-col h-full w-full justify-center p-2">
            <div className="w-full flex flex-col h-full mx-auto">
                {/** TODO: Replace with actual table */}
                <InternshipsTable />
                {/** Only studnt should see button to create a new internship */}
                <PermissionGuard roles={['Student']}>
                    <FloatingActionButton onClick={() => { router.navigate({ to: '/internships/new' }); }}/>
                </PermissionGuard>
            </div>
        </div>
    );
   
}
