import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useGetAllInternshipHandlers } from "@/api/hooks/useGetAllInternshipHandlers";
import { FormattedMessage } from "react-intl";
import { Skeleton } from "@/components/ui/skeleton";

const InternshipHandlersTable = () => {
    const { data: handlers, isLoading } = useGetAllInternshipHandlers();

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
                            <FormattedMessage id="Settings.InternshipHandlers.Name" />
                        </TableHead>
                        <TableHead>
                            <FormattedMessage id="Field.Email" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {handlers && handlers.length > 0 ? (
                        handlers.map((handler) => (
                            <TableRow key={handler.id}>
                                <TableCell className="font-medium">
                                    {handler.firstName} {handler.lastName}
                                </TableCell>
                                <TableCell>{handler.email}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                                <FormattedMessage id="Settings.InternshipHandlers.Empty" />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default InternshipHandlersTable;
