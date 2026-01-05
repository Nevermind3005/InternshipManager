import * as React from "react";
import {
    getCoreRowModel,
    useReactTable,
    type CellContext,
    type ColumnDef,
    type ColumnFiltersState,
} from "@tanstack/react-table";
import { ChevronDown, PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { IInternshipRes } from "@/models/internship/IInternshipRes";
import { formatDateOnlyString } from "@/lib/foundationUtils";
import { FormattedMessage } from "react-intl";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "@tanstack/react-router";
import { useGetAllInternships } from "@/api/hooks/useGetAllInternships";
import PageableTable from "../foundation/PageableTable";

const getTableColumns = (navigate: ReturnType<typeof useNavigate>) => {
    const { role } = useAuthStore.getState();

    const columns: ColumnDef<IInternshipRes>[] = [
        {
            accessorKey: "name",
            header: () => {
                return (
                    <FormattedMessage id="Internship.TableHeader.Name"/>
                );
            },
            cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "description",
            header: () => {
                return (
                    <FormattedMessage id="Internship.TableHeader.Description"/>
                );
            },
            cell: ({ row }) => <div className="">{row.getValue("description")}</div>,
        },
        ...(role === "InternshipHandler" || role === "Company" ? [
            {
                accessorFn: (row: IInternshipRes) => row.student?.firstName,
                accessorKey: "firstName",
                header: () => {
                    return (
                        <FormattedMessage id="Internship.TableHeader.FirstName"/>
                    );
                },
                cell: ({ row }: CellContext<IInternshipRes, unknown>) => <div className="">{row.getValue("firstName")}</div>,
            },
            {
                accessorFn: (row: IInternshipRes) => row.student?.lastName,
                accessorKey: "lastName",
                header: () => {
                    return (
                        <FormattedMessage id="Internship.TableHeader.LastName"/>
                    );
                },
                cell: ({ row }: CellContext<IInternshipRes, unknown>) => <div className="">{row.getValue("lastName")}</div>,
            },
        ] : []),
        {
            accessorFn: row => row.company?.name,
            accessorKey: "companyName",
            header: () => {
                return (
                    <FormattedMessage id="Internship.TableHeader.CompanyName"/>
                );
            },
            cell: ({ row }) => <div className="">{row.getValue("companyName")}</div>,
        },
        {
            accessorKey: "startDate",
            header: () => {
                return (
                    <FormattedMessage id="Internship.TableHeader.StartDate"/>
                );
            },
            cell: ({ row }) => {
                const dateValue: string = row.getValue("startDate");
                const formatted = formatDateOnlyString(dateValue);
                return <div>{formatted}</div>;
            },
        },
        {
            accessorKey: "endDate",
            header: () => {
                return (
                    <FormattedMessage id="Internship.TableHeader.EndDate"/>
                );
            },
            cell: ({ row }) => {
                const dateValue: string = row.getValue("endDate");
                const formatted = formatDateOnlyString(dateValue);
                return <div>{formatted}</div>;
            },
        },
        {
            accessorKey: "year",
            header: () => {
                return (
                    <FormattedMessage id="Internship.TableHeader.Year"/>
                );
            },
            cell: ({ row }) => <div className="">{row.getValue("year")}</div>,
        },
        {
            accessorKey: "semester",
            header: () => {
                return (
                    <FormattedMessage id="Internship.TableHeader.Semester"/>
                );
            },
            cell: ({ row }) => <div className=""><FormattedMessage id={`Internship.Semester.${row.getValue("semester")}`}/></div>,
        },
        {
            accessorKey: "state",
            header: () => {
                return (
                    <FormattedMessage id="Internship.TableHeader.State"/>
                );
            },
            cell: ({ row }) => <div className=""><FormattedMessage id={`Internship.State.${row.getValue("state")}`}/></div>,
        },
        ...(role === "InternshipHandler" ? [
            {
                id: "actions",
                header: () => {
                    return (
                        <FormattedMessage id="Internship.TableHeader.Actions"/>
                    );
                },
                cell: ({ row }: CellContext<IInternshipRes, unknown>) => (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate({ to: `/internships/edit/${row.original.id}` })}
                            className="h-8 w-8 p-0"
                        >
                            <PencilIcon className="h-4 w-4" />
                            <span className="sr-only">
                                <FormattedMessage id="Internship.Edit" />
                            </span>
                        </Button>
                    </div>
                ),
            },
        ] : []),
    ];
    return columns;
};

export function DataTableDemo() {
    const pageSize = 20;
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: pageSize });

    const navigate = useNavigate();

    const { data: companies } = useGetAllInternships({
        page: pagination.pageIndex + 1,
        pageSize: pageSize,
        filter: Object.fromEntries(
            columnFilters.map(f => [f.id, String(f.value ?? "")])
        ),
    });

    const columns = getTableColumns(navigate);

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
            <div className="flex items-center py-4 shrink-0">
                <Input
                    placeholder="Filter names..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <PageableTable table={table} columns={columns} onRowClick={(row) => navigate({ to: `/internships/detail/${row.original.id}` })} totalPages={totalPages}/>
            {/* <div className="flex-1 overflow-y-auto rounded-md border min-h-0">
                <TableBase table={table} columns={columns} onRowClick={(row) => navigate({ to: `/internships/detail/${row.original.id}` })}/>
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
            </div> */}
        </div>
    );
}
