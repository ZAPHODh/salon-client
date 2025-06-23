"use client";

import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    ColumnFiltersState,
    FilterFn,
    PaginationState,
    Row,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    ChevronFirst,
    ChevronLast,
    ChevronLeft,
    ChevronRight,
    CircleX,
    Columns3,
    Ellipsis,
    Filter,
    ListFilter,
    Plus,
    Trash,
} from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useTranslations } from "next-intl";

export type DataType = (Sale | Expense);

const isSale = (item: DataType): item is Sale => 'totalAmount' in item;
const isExpense = (item: DataType): item is Expense => 'category' in item;

const multiColumnFilterFn: FilterFn<DataType> = (row, columnId, filterValue) => {
    const searchTerms = [];

    if (isSale(row.original)) {
        searchTerms.push(
            row.original.paymentMethod.name,
            ...row.original.items.flatMap(item =>
                item.service?.name || item.product?.name || ''
            )
        );
    } else {
        searchTerms.push(row.original.description, row.original.category.name);
    }

    return searchTerms.join(' ').toLowerCase().includes((filterValue ?? "").toLowerCase());
};

const typeFilterFn: FilterFn<DataType> = (row, columnId, filterValue: string[]) => {
    if (!filterValue?.length) return true;
    const type = isSale(row.original) ? "ENTRADA" : "SAIDA";
    return filterValue.includes(type);
};

export default function FinancialTable({ data }: { data: DataType[] }) {
    const t = useTranslations('financial.table');
    const id = useId();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const inputRef = useRef<HTMLInputElement>(null);
    const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: false }]);

    const columns: ColumnDef<DataType>[] = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label={t('selectAll')}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label={t('selectRow')}
                />
            ),
            size: 28,
            enableSorting: false,
            enableHiding: false,
        },
        {
            header: t('headers.description'),
            accessorKey: "description",
            cell: ({ row }) => {
                if (isExpense(row.original)) return row.original.description;
                return row.original.items
                    .map(item => item.service?.name || item.product?.name)
                    .filter(Boolean)
                    .join(', ') || '-';
            },
            size: 200,
            filterFn: multiColumnFilterFn,
            enableHiding: false,
        },
        {
            header: t('headers.date'),
            accessorKey: "date",
            cell: ({ row }) => {
                const date = isExpense(row.original)
                    ? row.original.date
                    : row.original.createdAt;
                return format(date, "dd/MM/yyyy", { locale: ptBR });
            },
            size: 120,
        },
        {
            header: t('headers.amount'),
            accessorKey: "amount",
            cell: ({ row }) => {
                const amount = isExpense(row.original)
                    ? row.original.amount
                    : row.original.totalAmount;

                return new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(amount);
            },
            size: 120,
        },
        {
            header: t('headers.category'),
            accessorKey: "category.name",
            cell: ({ row }) => {
                if (isExpense(row.original)) return row.original.category.name;
                return row.original.paymentMethod.name;
            },
            size: 150,
        },
        {
            header: t('headers.type'),
            accessorKey: "type",
            cell: ({ row }) => {
                const type = isSale(row.original) ? "ENTRADA" : "SAIDA";
                return (
                    <Badge
                        className={cn(
                            type === "SAIDA"
                                ? "bg-red-500/20 text-red-700 dark:text-red-300"
                                : "bg-green-500/20 text-green-700 dark:text-green-300"
                        )}
                    >
                        {type === "SAIDA" ? t('types.outflow') : t('types.inflow')}
                    </Badge>
                );
            },
            size: 100,
            filterFn: typeFilterFn,
        },
        {
            id: "actions",
            header: () => <span className="sr-only">{t('headers.actions')}</span>,
            cell: ({ row }) => <RowActions row={row} />,
            size: 60,
            enableHiding: false,
        },
    ], [t]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        enableSortingRemoval: false,
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        state: { sorting, pagination, columnFilters, columnVisibility },
    });

    const uniqueTypeValues = useMemo(() => ["ENTRADA", "SAIDA"], []);
    const statusCounts = useMemo(() => {
        const countMap = new Map<string, number>();
        data.forEach(item => {
            const type = isSale(item) ? "ENTRADA" : "SAIDA";
            countMap.set(type, (countMap.get(type) || 0) + 1);
        });
        return countMap;
    }, [data]);

    const selectedStatuses = useMemo(() => {
        const filterValue = table.getColumn("type")?.getFilterValue() as string[];
        return filterValue ?? [];
    }, [table.getColumn("type")?.getFilterValue()]);

    const handleDeleteRows = () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const updatedData = data.filter(
            item => !selectedRows.some(row => row.original.id === item.id)
        );
        table.resetRowSelection();
    };

    const handleStatusChange = (checked: boolean, value: string) => {
        const filterValue = table.getColumn("type")?.getFilterValue() as string[];
        const newFilterValue = filterValue ? [...filterValue] : [];
        checked ? newFilterValue.push(value) : newFilterValue.splice(newFilterValue.indexOf(value), 1);
        table.getColumn("type")?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
    };

    return (
        <div className="space-y-4 w-full mx-auto px-4 pb-18">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full sm:w-auto">
                    <div className="col-span-1 xs:col-span-2 sm:col-span-1">
                        <div className="relative w-full">
                            <Input
                                ref={inputRef}
                                className={cn("peer w-full sm:min-w-60 ps-9", Boolean(table.getColumn("description")?.getFilterValue() as string) && "pe-9")}
                                value={(table.getColumn("description")?.getFilterValue() ?? "") as string}
                                onChange={(e) => table.getColumn("description")?.setFilterValue(e.target.value)}
                                placeholder={t('filter.placeholder')}
                            />
                            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                                <ListFilter size={16} className="opacity-60" />
                            </div>
                            {Boolean(table.getColumn("description")?.getFilterValue() as string) && (
                                <button className="absolute end-0 top-0 flex h-full w-9 items-center justify-center">
                                    <CircleX size={16} className="opacity-60" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-3 col-span-1">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full sm:w-auto">
                                    <Filter className="sm:-ms-1 me-0 sm:me-2" size={16} />
                                    <span className="hidden sm:inline">{t('filter.type')}</span>
                                    {selectedStatuses.length > 0 && (
                                        <span className="-me-1 ms-3 h-5 px-1 text-xs border rounded">
                                            {selectedStatuses.length}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="min-w-36 p-3" align="start">
                                <div className="space-y-3">
                                    <div className="text-xs text-muted-foreground">{t('filter.typeLabel')}</div>
                                    {uniqueTypeValues.map((value, i) => (
                                        <div key={value} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`${id}-${i}`}
                                                checked={selectedStatuses.includes(value)}
                                                onCheckedChange={(checked) => handleStatusChange(checked as boolean, value)}
                                            />
                                            <Label htmlFor={`${id}-${i}`} className="flex justify-between gap-2">
                                                {value === "SAIDA" ? t('types.outflow') : t('types.inflow')}
                                                <span className="text-xs text-muted-foreground">
                                                    {statusCounts.get(value)}
                                                </span>
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full sm:w-auto">
                                    <Columns3 className="sm:-ms-1 me-0 sm:me-2" size={16} />
                                    <span className="hidden sm:inline">{t('columns.title')}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{t('columns.label')}</DropdownMenuLabel>
                                {table.getAllColumns()
                                    .filter(column => column.getCanHide())
                                    .map(column => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            checked={column.getIsVisible()}
                                            onCheckedChange={value => column.toggleVisibility(!!value)}
                                        >
                                            {t(`headers.${column.id.toLowerCase()}` as any)}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    {table.getSelectedRowModel().rows.length > 0 && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" className="financial-table-actions">
                                    <Trash className="sm:-ms-1 me-0 sm:me-2" size={16} />
                                    <span className="hidden sm:inline">{t('actions.delete')}</span>
                                    <span className="-me-1 ms-3 h-5 px-1 text-xs border rounded">
                                        {table.getSelectedRowModel().rows.length}
                                    </span>
                                </Button>
                            </AlertDialogTrigger>
                        </AlertDialog>
                    )}
                    <Button variant="outline" className="financial-table-actions">
                        <Plus className="sm:-ms-1 me-0 sm:me-2" size={16} />
                        <span className="hidden sm:inline">{t('actions.new')}</span>
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-background">
                <ScrollArea className="w-full">
                    <Table className="min-w-[600px] lg:min-w-full">
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead
                                            key={header.id}
                                            style={{ width: header.getSize() }}
                                            className="h-11"
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map(row => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        {t('messages.noResults')}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>

            <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-3">
                    <Label className="max-sm:sr-only">{t('pagination.itemsPerPage')}</Label>
                    <Select
                        value={table.getState().pagination.pageSize.toString()}
                        onValueChange={value => table.setPageSize(Number(value))}
                    >
                        <SelectTrigger className="w-fit">
                            <SelectValue placeholder={t('pagination.itemsPerPage')} />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 25, 50].map(pageSize => (
                                <SelectItem key={pageSize} value={pageSize.toString()}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grow text-right text-sm text-muted-foreground">
                    {t('pagination.range', {
                        from: table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1,
                        to: Math.min(
                            table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                            table.getState().pagination.pageSize,
                            table.getRowCount()
                        ),
                        total: table.getRowCount()
                    })}
                </div>
                <div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => table.firstPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <ChevronFirst size={16} />
                                </Button>
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <ChevronLeft size={16} />
                                </Button>
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <ChevronRight size={16} />
                                </Button>
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => table.lastPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <ChevronLast size={16} />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}

function RowActions({ row }: { row: Row<DataType> }) {
    const t = useTranslations('financial.table.actions');
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="shadow-none">
                    <Ellipsis size={16} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem>{t('edit')}</DropdownMenuItem>
                    <DropdownMenuItem>{t('duplicate')}</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>{t('export')}</DropdownMenuItem>
                    <DropdownMenuItem>{t('archive')}</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                    {t('delete')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}