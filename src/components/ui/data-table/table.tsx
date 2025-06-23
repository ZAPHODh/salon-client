"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    SortingState,
    VisibilityState,
    getSortedRowModel,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useReactToPrint } from "react-to-print";
import { useRef, useState } from "react";
import { AnyZodObject } from "zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../input";
import { DataTableViewOptions } from "./col-toggle";
import { DataTablePagination } from "./pagination";
import { Card } from "../card";
import { FieldConfig, GenericFormsInput } from "../input/generic";
import { SheetForm } from "@/components/widgets/sheet-form";
import { ExportTo } from "@/components/widgets/export";
import { useTranslations } from "next-intl";

import { ImportCustomer } from "@/components/widgets/import-customer";

interface DataTableProps<TData, TValue> {
    imports?: true;
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    exportTo?: true;
    newItem?: {
        name?: string;
        schema: AnyZodObject;
        defaultValues: any;
        fieldConfig: Record<string, FieldConfig<AnyZodObject>>;
    };
    onNewItem?: (newItem: any) => void;
    handleRowClick?: (data: TData) => void;
}

export function DataTable<TData, TValue>({
    imports,
    columns,
    data,
    exportTo,
    newItem,
    onNewItem,
    handleRowClick,
}: DataTableProps<TData, TValue>) {
    const t = useTranslations('table.dataTable');
    const contentRef = useRef<HTMLTableElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            globalFilter,
            rowSelection,
        },
    });
    const handleExport = async (format: "csv" | "excel" | "pdf" | "print") => {
        const selectedData = table
            .getSelectedRowModel()
            .rows.map((row) => row.original);

        if (selectedData.length === 0) {
            toast(t('error.exportNoSelection'), {
                description: t('error.exportNoSelectionDesc'),
            });
            return;
        }

        if (format === "print") {
            reactToPrintFn();
            return;
        }

        try {
            const response = await fetch("/api/export_to", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    format,
                    data: selectedData,
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao exportar os dados.");
            }

            const result = await response.json();
            const fileUrl = result.fileUrl;

            const link = document.createElement("a");
            link.href = fileUrl;
            link.download = `export.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch {
            toast(t('error.exportGeneric'), {
                description: t('error.exportGenericDesc'),
            });

        }
    };
    return (
        <div className="flex flex-col p-4 gap-4 w-full">
            <Card>
                <div className="flex flex-col lg:flex-row items-center p-4 gap-4 overflow-x-auto">
                    <Input
                        placeholder={t('search.placeholder')}
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="max-w-sm"
                    />
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full">
                        <div className="flex flex-row items-start md:items-center gap-2 w-full">
                            {exportTo && <ExportTo exportTo={(format) => handleExport(format)} />}
                            {newItem && onNewItem && (
                                <SheetForm
                                    schema={newItem.schema}
                                    triggerLabel={
                                        <>
                                            <Plus />
                                            {t('addButton', { name: newItem.name as string })}
                                        </>
                                    }
                                    onSubmit={onNewItem}
                                    title={
                                        newItem.name
                                            ? t('form.title', { name: newItem.name })
                                            : t('form.defaultTitle')
                                    }
                                    defaultValues={newItem.defaultValues}
                                >
                                    <GenericFormsInput
                                        variants="single"
                                        fieldConfig={newItem.fieldConfig}
                                    />
                                </SheetForm>
                            )}
                        </div>
                        {imports && <ImportCustomer />}
                    </div>
                    <DataTableViewOptions table={table} />
                </div>
            </Card>
            <Card>
                <div className="overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader>
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
                                        onClick={
                                            handleRowClick
                                                ? () => handleRowClick(row.original)
                                                : undefined
                                        }
                                        style={{ cursor: handleRowClick ? "pointer" : "default" }}
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
                                        {t('noResults')}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <DataTablePagination table={table} />
            </Card>
            <div ref={contentRef} className="hidden print:block">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getSelectedRowModel().rows.length ? (
                            table.getSelectedRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell, index) => (
                                        <TableCell
                                            key={cell.id}
                                            className={index === 0 ? "print:hidden" : ""}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                                    {t('print.noSelection')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}