import { Button } from "../ui/button";
import TableBase from "./TableBase";
import { type ColumnDef, type Row, type Table as TStackTable } from "@tanstack/react-table";


interface IPageableTableProps<T> { 
    table: TStackTable<T>,
    columns: ColumnDef<T>[],
    onRowClick?: (row: Row<T>) => void;
    totalPages: number
}

const PageableTable = <T,>(
    { 
        table,
        columns,
        onRowClick,
        totalPages
    } : IPageableTableProps<T>) => {
    const pagination = table.getState().pagination;
    return (
        <>
            <div className="flex-1 overflow-y-auto rounded-md border min-h-0">
                <TableBase table={table} columns={columns} onRowClick={onRowClick}/>
            </div>
            <div className="flex items-center justify-start space-x-2 py-4 shrink-0">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(0)}
                    disabled={pagination.pageIndex === 0}
                >
                    {"<<"}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={pagination.pageIndex === 0}
                >
    Previous
                </Button>

                {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                        key={i}
                        variant={i === pagination.pageIndex ? "default" : "outline"}
                        size="sm"
                        onClick={() => table.setPageIndex(i)}
                    >
                        {i + 1}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={pagination.pageIndex >= totalPages - 1}
                >
    Next
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(totalPages - 1)}
                    disabled={pagination.pageIndex >= totalPages - 1}
                >
                    {">>"}
                </Button>
            </div>
        </>
    );
};

export default PageableTable;