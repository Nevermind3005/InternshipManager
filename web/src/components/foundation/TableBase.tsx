import { FormattedMessage } from "react-intl";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { flexRender, type ColumnDef, type Row, type Table as TStackTable } from "@tanstack/react-table";

interface ITableBaseProps<T> { 
    table: TStackTable<T>,
    columns: ColumnDef<T>[],
    onRowClick?: (row: Row<T>) => void;
}

const TableBase = <T,>(
    { 
        table,
        columns,
        onRowClick
    } : ITableBaseProps<T>
) => {
    return (
        <Table className="w-full">
            <TableHeader className="sticky top-0 bg-background z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            );
                        })}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            className={`${onRowClick && 'cursor-pointer'} hover:bg-gray-100 dark:hover:bg-neutral-900`}
                            onClick={onRowClick ? () => {onRowClick(row);} : undefined}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center">
                            <FormattedMessage id="Table.NoResults"/>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>

    );
};

export default TableBase;