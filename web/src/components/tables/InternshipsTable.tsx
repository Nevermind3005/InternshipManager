import * as React from "react";
import {
    getCoreRowModel,
    useReactTable,
    type CellContext,
    type ColumnDef,
} from "@tanstack/react-table";
import { ChevronDown, Download, PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IInternshipRes } from "@/models/internship/IInternshipRes";
import { formatDateOnlyString } from "@/lib/foundationUtils";
import { FormattedMessage } from "react-intl";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "@tanstack/react-router";
import { useGetAllInternships } from "@/api/hooks/useGetAllInternships";
import { useExportInternshipsCsv } from "@/api/hooks/useExportInternshipsCsv";
import PageableTable from "../foundation/PageableTable";
import InternshipFilters from "../filters/InternshipFilters";

interface FilterValues {
    name?: string;
    year?: string;
    semester?: string;
    studyProgramId?: string;
    company?: string;
    firstName?: string;
    lastName?: string;
    state?: string;
}

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
            accessorFn: row => row.studyProgram?.code,
            accessorKey: "studyProgram",
            header: () => {
                return (
                    <FormattedMessage id="Internship.TableHeader.StudyProgram"/>
                );
            },
            cell: ({ row }) => <div className="">{row.getValue("studyProgram") || "-"}</div>,
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
                            onClick={() => navigate({ to: `/dashboard/internships/edit/${row.original.id}` })}
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

export function InternshipsTable() {
    const pageSize = 20;
    const [filters, setFilters] = React.useState<FilterValues>({});
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: pageSize });

    const navigate = useNavigate();
    const { role } = useAuthStore();
    const isTeacher = role === "InternshipHandler";
    const { exportCsv, isExporting } = useExportInternshipsCsv();

    // Convert filters to API format
    const apiFilters = React.useMemo(() => {
        const result: Record<string, string> = {};
        if (filters.name) result.Name = filters.name;
        if (filters.year) result.Year = filters.year;
        if (filters.semester) result.Semester = filters.semester;
        if (filters.studyProgramId) result.StudyProgramId = filters.studyProgramId;
        if (filters.company) result.Company = filters.company;
        if (filters.firstName) result.FirstName = filters.firstName;
        if (filters.lastName) result.LastName = filters.lastName;
        if (filters.state) result.State = filters.state;
        return result;
    }, [filters]);

    const { data: internships } = useGetAllInternships({
        page: pagination.pageIndex + 1,
        pageSize: pageSize,
        filter: apiFilters,
    });

    const columns = getTableColumns(navigate);

    const totalPages = internships ? Math.ceil(internships.totalCount / pagination.pageSize) : 0;

    const table = useReactTable({
        data: internships?.items ?? [],
        columns,
        pageCount: totalPages,
        manualPagination: true,
        manualFiltering: true,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        state: {
            pagination,
        },
    });

    const handleFilterChange = (key: keyof FilterValues, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        // Reset to first page when filter changes
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    };

    const handleClearFilters = () => {
        setFilters({});
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    };

    return (
        <div className="flex flex-col h-full overflow-hidden w-full">
            {/* Filters - only for teachers */}
            {isTeacher && (
                <InternshipFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />
            )}

            {/* Column visibility dropdown and Export button */}
            <div className="flex items-center justify-end gap-2 py-2 shrink-0">
                {/* Export CSV button - only for teachers */}
                {isTeacher && (
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => exportCsv(apiFilters)}
                        disabled={isExporting}
                    >
                        <Download className="mr-1 h-4 w-4" />
                        {isExporting ? (
                            <FormattedMessage id="Export.Exporting" />
                        ) : (
                            <FormattedMessage id="Export.CSV" />
                        )}
                    </Button>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <FormattedMessage id="Filter.Columns" /> <ChevronDown className="ml-1 h-4 w-4" />
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

            {/* Table */}
            <PageableTable 
                table={table} 
                columns={columns} 
                onRowClick={(row) => navigate({ to: `/dashboard/internships/detail/${row.original.id}` })} 
                totalPages={totalPages}
            />
        </div>
    );
}
