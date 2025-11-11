import FloatingActionButton from '@/components/foundation/FloatingActionButton';
import { PermissionGuard } from '@/components/foundation/PermissionGuard';
import { DataTableDemo } from '@/components/tables/InternshipsTable';
import router from '@/lib/router';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/internships/')({
    component: RouteComponent,
});

function RouteComponent() {
    return (        
        <div className="flex h-full w-full justify-center p-2 md:p-4">
            <div className="w-full max-w-m">
                {/** TODO: Replace with actual table */}
                <DataTableDemo />
                {/** Only studnt should see button to create a new internship */}
                <PermissionGuard roles={['Student']}>
                    <FloatingActionButton onClick={() => { router.navigate({ to: '/internships/new' }); }}/>
                </PermissionGuard>
            </div>
        </div>
    );
   
}
