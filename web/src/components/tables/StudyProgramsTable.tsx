import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useGetAllStudyPrograms } from "@/api/hooks/useGetAllStudyPrograms";
import { FormattedMessage } from "react-intl";
import { Skeleton } from "@/components/ui/skeleton";

const StudyProgramsTable = () => {
    const { data: studyPrograms, isLoading } = useGetAllStudyPrograms();

    if (isLoading) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <FormattedMessage id="Settings.StudyPrograms.Code" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {studyPrograms && studyPrograms.length > 0 ? (
                        studyPrograms.map((program) => (
                            <TableRow key={program.id}>
                                <TableCell className="font-medium">{program.code}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell className="h-24 text-center text-muted-foreground">
                                <FormattedMessage id="Settings.StudyPrograms.Empty" />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default StudyProgramsTable;
