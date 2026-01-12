import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { requireRole } from '@/lib/authGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormattedMessage } from 'react-intl';
import StudyProgramsTable from '@/components/tables/StudyProgramsTable';
import CreateStudyProgramForm from '@/components/forms/CreateStudyProgramForm';
import FloatingActionButton from '@/components/foundation/FloatingActionButton';

export const Route = createFileRoute('/settings/')({
    component: RouteComponent,
    beforeLoad: requireRole(['InternshipHandler']),
    loader: () => ({
        crumb: 'Settings'
    })
});

function RouteComponent() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="flex flex-col h-full w-full p-2 md:p-4">
            <div className="w-full max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle><FormattedMessage id="Settings.Title" /></CardTitle>
                        <CardDescription><FormattedMessage id="Settings.Description" /></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium mb-4">
                                    <FormattedMessage id="Settings.StudyPrograms.Title" />
                                </h3>
                                <StudyProgramsTable />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <FloatingActionButton onClick={() => setIsDialogOpen(true)} />
            </div>
            <CreateStudyProgramForm open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </div>
    );
}
