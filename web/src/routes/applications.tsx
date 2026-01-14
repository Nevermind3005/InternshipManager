import CreateApplicationForm from '@/components/forms/CreateApplicationForm';
import FloatingActionButton from '@/components/foundation/FloatingActionButton';
import { ApplicationsTable } from '@/components/tables/ApplicationsTable';
import { requireRole } from '@/lib/authGuard';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/applications')({
    component: RouteComponent,
    beforeLoad: requireRole(['InternshipHandler']),
    loader: () => ({
        crumb: 'Applications'
    })
});

function RouteComponent() {
    const [ isCompanyDialogOpen, setIsCompanyDialogOpen ] = useState(false);
    
    return (
        <div className="flex flex-col h-full w-full justify-center p-2">
            <div className="w-full flex flex-col h-full mx-auto">
                <ApplicationsTable />
                <FloatingActionButton onClick={() => setIsCompanyDialogOpen(true)}/>
            </div>
            <CreateApplicationForm open={isCompanyDialogOpen} onOpenChange={setIsCompanyDialogOpen}/>
        </div>
    );
}
