"use client"

import { useState } from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, Search, Eye, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CustomerForm } from "./customer-form"
import Link from "next/link"
import { useCustomer } from "../providers/customer"
import { ImportCustomer } from "../widgets/import-customer"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { set } from "date-fns"
import { deleteCustomer } from "@/requests/customers"




export function CustomersDataTable() {
    const { customers, error } = useCustomer()
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [showForm, setShowForm] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
    const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null)
    const columns: ColumnDef<Customer>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Selecionar todos"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Selecionar linha"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Nome
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => {
                const email = row.getValue("email") as string
                return <div className="text-muted-foreground">{email || "N/A"}</div>
            },
        },
        {
            accessorKey: "phone",
            header: "Telefone",
            cell: ({ row }) => {
                const phone = row.getValue("phone") as string
                return <div>{phone || "N/A"}</div>
            },
        },
        {
            accessorKey: "city",
            header: "Cidade",
            cell: ({ row }) => {
                const city = row.getValue("city") as string
                return <div>{city || "N/A"}</div>
            },
        },
        {
            accessorKey: "genre",
            header: "Gênero",
            cell: ({ row }) => {
                const genre = row.getValue("genre") as string
                return (
                    <Badge variant="outline">
                        {genre === "male" ? "Masculino" : genre === "female" ? "Feminino" : genre || "N/A"}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "birthDay",
            header: "Aniversário",
            cell: ({ row }) => {
                const birthDay = row.getValue("birthDay") as Date
                if (!birthDay) return <div>N/A</div>
                return <div>{new Date(birthDay).toLocaleDateString("pt-BR")}</div>
            },
        },
        {
            accessorKey: "appointments",
            header: "Agendamentos",
            cell: ({ row }) => {
                const appointments = row.original.appointments || []
                return <div className="text-center">{appointments.length}</div>
            },
        },
        {
            accessorKey: "sales",
            header: "Vendas",
            cell: ({ row }) => {
                const sales = row.original.sales || []
                const totalSales = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0)
                return (
                    <div className="font-medium">
                        {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        }).format(totalSales)}
                    </div>
                )
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const customer = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/customers/${customer.slug}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver detalhes
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingCustomer(customer)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => setDeletingCustomer(customer)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
    const table = useReactTable({
        data: customers,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })
    const handleDelete = async () => {
        if (deletingCustomer) {
            await deleteCustomer(deletingCustomer.id)
            setDeletingCustomer(null)
        }
    }
    return (
        <div className="w-full space-y-4">
            {error &&
                <div className="w-full p-4 text-center text-red-600">Erro ao carregar clientes: {error}</div>
            }
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="flex flex-1 items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar clientes..."
                            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                            className="pl-8 max-w-sm"
                        />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-x-2 gap-2">
                    <div className="flex gap-2">
                        <ImportCustomer />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    Colunas <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        const columnNames: Record<string, string> = {
                                            name: "Nome",
                                            email: "Email",
                                            phone: "Telefone",
                                            city: "Cidade",
                                            genre: "Gênero",
                                            birthDay: "Aniversário",
                                            appointments: "Agendamentos",
                                            sales: "Vendas",
                                        }

                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            >
                                                {columnNames[column.id] || column.id}
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Button onClick={() => setShowForm(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Cliente
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Nenhum cliente encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} linha(s)
                    selecionada(s).
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Anterior
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Próximo
                    </Button>
                </div>
            </div>
            {editingCustomer && (
                <CustomerForm
                    customer={editingCustomer as any}
                    open={!!editingCustomer}
                    onOpenChange={(setOpen) => {
                        if (!setOpen) setEditingCustomer(null)
                    }
                    }
                />
            )}
            <AlertDialog open={!!deletingCustomer} onOpenChange={(open) => !open && setDeletingCustomer(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir o profissional <strong>{deletingCustomer?.name}</strong>? Esta ação não
                            pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <CustomerForm open={showForm} onOpenChange={setShowForm} />
        </div>
    )
}
