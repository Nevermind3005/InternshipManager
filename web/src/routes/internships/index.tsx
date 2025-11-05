import FloatingActionButton from '@/components/foundation/FloatingActionButton';
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
                <DataTableDemo />
                <FloatingActionButton onClick={() => { router.navigate({ to: '/internships/new' }); }}/>
            </div>
        </div>
    );
   
}
