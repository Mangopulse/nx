"use client"
import * as React from "react";

import {
    ColumnDef,
    ColumnFiltersState,
    FilterFnOption,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    
} from "@tanstack/react-table";
import DebouncedInput from "./DebouncedInput";
import { Checkbox } from "../ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import IconButton from "../form/IconButton";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@radix-ui/react-dropdown-menu";

import Button from "../ui/button";


  


interface DataTableProps {
    data:any[];
    columns?: any[];
    selectionAvailable?:boolean
    title?:string
    filterFns?:any
  }

export default function DataTable({
    data=[],
    columns=[],
    selectionAvailable,
    title,
    filterFns,
}:DataTableProps) {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState("");

    if (data.length && selectionAvailable)
        columns = [
            {
                id: "select",
                header: ({ table }:any) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }:any) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            ...columns,
        ];
    const table  = useReactTable({
        data,
        columns,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        enableColumnFilters: true,
        enableGlobalFilter: true,
        // globalFilterFn : (row) => {
        //     for (const column of columns) {
        //         const accessor = column.accessorKey;
        //         let columnValue;
        //         if (column.id) columnValue = row.getValue(column.id);
        //         else if (accessor) columnValue = row.getValue(accessor);
        //         if (!columnValue) return;
        //         if (typeof column.filterFn == "function") {
        //             const columnFilterValue = column.filterFn(
        //                 columnValue,
        //                 globalFilter
        //             );
        //             if (columnFilterValue === true) return true;
        //         }
        //         if (
        //             typeof columnValue === "string" &&
        //             columnValue
        //                 .toLowerCase()
        //                 .includes(globalFilter.toLowerCase())
        //         ) {
        //             return true;
        //         }
        //     }
        //     return false;
        // },
       
        //onSortingChange: setSorting,
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
                <h3 className="font-semibold">{title}</h3>
                <div className="flex items-center space-x-2 ml-auto">
                    <DebouncedInput
                       // value={globalFilter ?? ""}
                        onChange={(value : string) => setGlobalFilter(String(value))}
                       // placeholder="Filter..."
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="ml-auto border-input/30"
                        >
                            Columns 
                            {/* <ChevronDownIcon className="ml-2 h-4 w-4" /> */}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {
                        
                        table.getAllColumns().filter((column) => column.getCanHide())
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
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-accent/80 text-accent-foreground">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            className="text-accent-foreground"
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
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    id={row.id}
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
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
                                    colSpan={columns?.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
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