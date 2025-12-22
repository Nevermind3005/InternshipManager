import CreateApplicationForm from '@/components/forms/CreateApplicationForm';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { requireRole } from '@/lib/authGuard';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export const Route = createFileRoute('/applications')({
    component: RouteComponent,
    beforeLoad: requireRole(['InternshipHandler']),
    loader: () => ({
        crumb: 'Applications'
    })
});

function RouteComponent() {
    const [ isCompanyDialogOpen, setIsCompanyDialogOpen ] = useState(false);
    
    return <div>
        <div className='flex py-2 justify-between'>
            <p>Applications</p>
            <Button className="w-35 mx-2" type="button" onClick={() => setIsCompanyDialogOpen(true)}>
                <FormattedMessage id="Application.CreateApiKey" />
            </Button>
        </div>
        <Separator className="" />

        <CreateApplicationForm open={isCompanyDialogOpen} onOpenChange={setIsCompanyDialogOpen}/>
    </div>;
}
