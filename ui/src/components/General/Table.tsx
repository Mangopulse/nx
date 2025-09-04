import * as React from "react";
import {
    CaretSortIcon,
    ChevronDownIcon,
    DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
    ColumnDef,
    ColumnFiltersState,
    FilterFnOption,
    FilterMeta,
    Row,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import IconButton from "../form/IconButton";
import { Checkbox } from "../ui/checkbox";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import MiniRotatingLoader from "../loaders/MiniRotatingLoader";
import TableSkeletonRows from "@/skeletons/TableSkeletonRows";
// import DebouncedInput from "./DebouncedInput";

interface IDataTableProps {
    data: any[];
    columns: Array<ColumnDef<any>>;
    selectionAvailable?: boolean;
    title?: string;
    manualPagination?: boolean;
    canMoveNext?: boolean;
    canMovePrev?: boolean;
    moveNext?: React.MouseEventHandler<HTMLButtonElement>;
    movePrev?: React.MouseEventHandler<HTMLButtonElement>;
    isLoading?: boolean;
    pageSize?: number;
    pagesCount?: number;
    currentPage?: number;
}

export default function DataTable({
    data = [],
    columns = [],
    selectionAvailable,
    title,
    manualPagination = false,
    canMoveNext = true,
    canMovePrev = true,
    moveNext = () => {},
    movePrev = () => {},
    isLoading,
    pageSize,
    pagesCount,
    currentPage,
}: IDataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState("");

    if (data?.length && selectionAvailable)
        columns = [
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value: boolean) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value: boolean) =>
                            row.toggleSelected(!!value)
                        }
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            ...columns,
        ];
    const table = useReactTable({
        data,
        columns,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        manualPagination: manualPagination,
        enableColumnFilters: true,
        enableGlobalFilter: true,
        globalFilterFn: ((row) => {
            for (const column of columns) {
                const accessor = (column as any).accessorKey;
                let columnValue: Row<any>;
                if (column.id) columnValue = row.getValue(column.id);
                else if (accessor) columnValue = row.getValue(accessor);
                else return;
                if (typeof column.filterFn === "function") {
                    const columnFilterValue = column.filterFn(
                        columnValue,
                        globalFilter,
                        null,
                        (meta: FilterMeta) => false
                    );
                    if (columnFilterValue === true) return true;
                }
                if (
                    typeof columnValue === "string" &&
                    (columnValue as string)
                        .toLowerCase()
                        .includes(globalFilter.toLowerCase())
                ) {
                    return true;
                }
            }
            return false;
        }) as FilterFnOption<any>,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    });

    return (
        <div className="w-full">
            <div className="flex items-center pb-2">
                {title && <h3 className="font-semibold">{title}</h3>}
                <div className="flex items-center space-x-2 ml-auto">
                    {/* <DebouncedInput
                        value={globalFilter ?? ""}
                        onChange={(value) => setGlobalFilter(String(value))}
                        placeholder="Filter..."
                    /> */}
                </div>
                {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="ml-auto border-input/30"
                        >
                            Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
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
                </DropdownMenu> */}
            </div>
            <Table>
                <TableHeader className="bg-accent/80 text-accent-foreground">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        className="text-primary/60"
                                        key={header.id}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        pageSize ? (
                            <TableSkeletonRows
                                rowCount={pageSize}
                                colSpan={columns.length}
                            />
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-center"
                                >
                                    <div className="w-fit mx-auto py-24">
                                        <MiniRotatingLoader />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                id={row.id}
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className="bg-accent/30"
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
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                    {/* if the data is short on the last page, fill the table with empty rows */}
                    {!isLoading &&
                    data?.length &&
                    pageSize &&
                    data?.length < pageSize
                        ? new Array(pageSize - data?.length)
                              .fill(0)
                              .map((_, i) => (
                                  <TableRow key={i} className="border-none pointer-events-none">
                                      <TableCell
                                          colSpan={columns.length}
                                          className="bg-accent/30 h-9"
                                      ></TableCell>
                                  </TableRow>
                              ))
                        : ""}
                </TableBody>
            </Table>
            {table.getRowModel().rows?.length && manualPagination ? (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <IconButton
                        variant={"outline"}
                        onClick={movePrev}
                        disabled={Boolean(
                            isLoading || !data?.length || !canMovePrev
                        )}
                        size={"sm"}
                    >
                        <ArrowLeftIcon size={15} strokeWidth={"1"} />
                    </IconButton>
                    {currentPage && pagesCount ? (
                        <p className="text-sm opacity-60">
                            page {currentPage} of {pagesCount}
                        </p>
                    ) : (
                        ""
                    )}
                    <IconButton
                        variant={"outline"}
                        onClick={moveNext}
                        disabled={Boolean(
                            isLoading || !data?.length || !canMoveNext
                        )}
                        size={"sm"}
                    >
                        <ArrowRightIcon size={15} strokeWidth={"1"} />
                    </IconButton>
                </div>
            ) : (
                ""
            )}

            <div className="flex items-center justify-end space-x-2 py-4">
                {selectionAvailable && (
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s)
                        selected.
                    </div>
                )}
                <div className="flex">
                    <IconButton
                        icon="fa-solid fa-arrow-left"
                        variant="ghost"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    ></IconButton>
                    <IconButton
                        icon="fa-solid fa-arrow-right"
                        variant="ghost"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    ></IconButton>
                </div>
            </div>
        </div>
    );
}
