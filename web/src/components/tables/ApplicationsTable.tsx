import React from "react";
import PageableTable from "../foundation/PageableTable";
import { getCoreRowModel, useReactTable, type CellContext, type ColumnDef, type ColumnFiltersState } from "@tanstack/react-table";
import { FormattedMessage } from "react-intl";
import type { IApplicationGetRes } from "@/models/application/IApplicationGetRes";
import { useGetAllApplications } from "@/api/hooks/useGetAllApplications";
import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";

const getTableColumns = () => {
    const columns: ColumnDef<IApplicationGetRes>[] = [
        {
            accessorKey: "name",
            header: () => {
                return (
                    <FormattedMessage id="Application.Name"/>
                );
            },
            cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "clientId",
            header: () => {
                return (
                    <FormattedMessage id="Application.ClientId"/>
                );
            },
            cell: ({ row }) => <div className="">{row.getValue("clientId")}</div>,
        },
        {
            id: "actions",
            header: () => {
                return (
                    // Keep the ****** pinned to the right side
                    <div className="flex justify-end pr-4">
                        <FormattedMessage id="Internship.TableHeader.Actions"/>
                    </div>
                );
            },
            cell: ({ row }: CellContext<IApplicationGetRes, unknown>) => (
                // Keep the ****** pinned to the right side
                <div className="flex justify-end pr-4" onClick={(e) => e.stopPropagation()}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log(row.original.name)}
                        className="h-8 w-8 p-0"
                    >
                        <Trash2Icon className="h-4 w-4" />
                        <span className="sr-only">
                            <FormattedMessage id="Internship.Edit" />
                        </span>
                    </Button>
                </div>
            ),
        },
    ];
    return columns;
};

export function ApplicationsTable() {
    const pageSize = 20;
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: pageSize });

    const { data: companies } = useGetAllApplications({
        page: pagination.pageIndex + 1,
        pageSize: pageSize,
        filter: Object.fromEntries(
            columnFilters.map(f => [f.id, String(f.value ?? "")])
        ),
    });

    const columns = getTableColumns();

    const totalPages = companies ? Math.ceil(companies.totalCount / pagination.pageSize) : 0;
    console.log(totalPages);
    const table = useReactTable({
        data: companies?.items ?? [],
        columns,
        pageCount: totalPages,
        manualPagination: true,
        manualFiltering: true,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        state: {
            columnFilters,
            pagination,
        },
    });

    return (
        <div className="flex flex-col h-full overflow-hidden w-full">
            <PageableTable table={table} columns={columns} totalPages={totalPages}/>
        </div>
    );
}
