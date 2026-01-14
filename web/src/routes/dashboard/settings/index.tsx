import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { requireRole } from '@/lib/authGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormattedMessage } from 'react-intl';
import StudyProgramsTable from '@/components/tables/StudyProgramsTable';
import InternshipHandlersTable from '@/components/tables/InternshipHandlersTable';
import CreateStudyProgramForm from '@/components/forms/CreateStudyProgramForm';
import CreateInternshipHandlerForm from '@/components/forms/CreateInternshipHandlerForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const Route = createFileRoute('/dashboard/settings/')({
    component: RouteComponent,
    beforeLoad: requireRole(['InternshipHandler']),
    loader: () => ({
        crumb: 'Settings'
    })
});

function RouteComponent() {
    const [isStudyProgramDialogOpen, setIsStudyProgramDialogOpen] = useState(false);
    const [isHandlerDialogOpen, setIsHandlerDialogOpen] = useState(false);

    return (
        <div className="flex flex-col h-full w-full p-2 md:p-4">
            <div className="w-full max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle><FormattedMessage id="Settings.Title" /></CardTitle>
                        <CardDescription><FormattedMessage id="Settings.Description" /></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {/* Study Programs Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium">
                                        <FormattedMessage id="Settings.StudyPrograms.Title" />
                                    </h3>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setIsStudyProgramDialogOpen(true)}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        <FormattedMessage id="Actions.Add" />
                                    </Button>
                                </div>
                                <StudyProgramsTable />
                            </div>

                            {/* Internship Handlers Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium">
                                        <FormattedMessage id="Settings.InternshipHandlers.Title" />
                                    </h3>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setIsHandlerDialogOpen(true)}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        <FormattedMessage id="Actions.Add" />
                                    </Button>
                                </div>
                                <InternshipHandlersTable />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <CreateStudyProgramForm open={isStudyProgramDialogOpen} onOpenChange={setIsStudyProgramDialogOpen} />
            <CreateInternshipHandlerForm open={isHandlerDialogOpen} onOpenChange={setIsHandlerDialogOpen} />
        </div>
    );
}
