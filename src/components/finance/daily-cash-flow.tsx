"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    TrendingDown,
} from "lucide-react"
import { format, startOfDay, endOfDay, isToday, isYesterday } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useFinancial } from "../providers/financial"
import { DailyCashFlowForm } from "./daily-cash-flow-form"

export function DailyCashFlow() {
    const { transactions, deleteTransaction } = useFinancial()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [categoryFilter, setCategoryFilter] = useState<string>("all")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingEntry, setEditingEntry] = useState<Transaction | null>(null)
    const [deletingEntry, setDeletingEntry] = useState<Transaction | null>(null)

    const dailyTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date)
        const selectedStart = startOfDay(selectedDate)
        const selectedEnd = endOfDay(selectedDate)
        return transactionDate >= selectedStart && transactionDate <= selectedEnd
    })


    const filteredTransactions = dailyTransactions.filter((transaction) => {
        const matchesSearch =
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesType = typeFilter === "all" || transaction.type === typeFilter
        const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter

        return matchesSearch && matchesType && matchesCategory
    })

    const dailyIncome = dailyTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const dailyExpense = dailyTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const dailyBalance = dailyIncome - dailyExpense

    const categories = Array.from(new Set(transactions.map((t) => t.category)))

    const handleDelete = async () => {
        if (deletingEntry) {
            await deleteTransaction(deletingEntry.id)
            setDeletingEntry(null)
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    const formatTime = (date: Date) => {
        return format(new Date(date), "HH:mm", { locale: ptBR })
    }

    const getDateLabel = (date: Date) => {
        if (isToday(date)) return "Hoje"
        if (isYesterday(date)) return "Ontem"
        return format(date, "dd/MM/yyyy", { locale: ptBR })
    }

    const getTransactionIcon = (type: string) => {
        return type === "income" ? (
            <ArrowUpRight className="h-4 w-4 text-green-600" />
        ) : (
            <ArrowDownRight className="h-4 w-4 text-red-600" />
        )
    }

    const getTransactionBadge = (type: string) => {
        return type === "income" ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
                Entrada
            </Badge>
        ) : (
            <Badge variant="destructive">Saída</Badge>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="md:col-span-1">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Data Selecionada</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Input
                            type="date"
                            value={format(selectedDate, "yyyy-MM-dd")}
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                            className="w-full"
                        />
                        <p className="text-xs text-muted-foreground mt-2">{getDateLabel(selectedDate)}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Entradas</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(dailyIncome)}</div>
                        <p className="text-xs text-muted-foreground">
                            {dailyTransactions.filter((t) => t.type === "income").length} transações
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saídas</CardTitle>
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(dailyExpense)}</div>
                        <p className="text-xs text-muted-foreground">
                            {dailyTransactions.filter((t) => t.type === "expense").length} transações
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saldo do Dia</CardTitle>
                        {dailyBalance >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${dailyBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatCurrency(dailyBalance)}
                        </div>
                        <p className="text-xs text-muted-foreground">{dailyTransactions.length} transações total</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                        <div>
                            <CardTitle>Movimentação Diária</CardTitle>
                            <CardDescription>Entradas e saídas de {getDateLabel(selectedDate).toLowerCase()}</CardDescription>
                        </div>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nova Entrada
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Adicionar Movimentação</DialogTitle>
                                    <DialogDescription>
                                        Registre uma nova entrada ou saída para {getDateLabel(selectedDate).toLowerCase()}
                                    </DialogDescription>
                                </DialogHeader>
                                <DailyCashFlowForm
                                    selectedDate={selectedDate}
                                    onSuccess={() => setIsAddDialogOpen(false)}
                                    onCancel={() => setIsAddDialogOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar movimentações..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full sm:w-[140px]">
                                <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="income">Entradas</SelectItem>
                                <SelectItem value="expense">Saídas</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full sm:w-[160px]">
                                <SelectValue placeholder="Categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block sm:hidden space-y-3">
                        {filteredTransactions.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                {dailyTransactions.length === 0
                                    ? `Nenhuma movimentação em ${getDateLabel(selectedDate).toLowerCase()}`
                                    : "Nenhuma movimentação encontrada com os filtros aplicados"}
                            </div>
                        ) : (
                            filteredTransactions
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((transaction) => (
                                    <Card key={transaction.id} className="p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center space-x-2">
                                                {getTransactionIcon(transaction.type)}
                                                <div>
                                                    <h4 className="font-medium">{transaction.description}</h4>
                                                    <p className="text-sm text-muted-foreground">{transaction.category}</p>
                                                    {/* {transaction.professional && (
                            <p className="text-xs text-muted-foreground">Prof: {transaction.professional.name}</p>
                          )} */}
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => setEditingEntry(transaction as any)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => setDeletingEntry(transaction as any)}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">{formatTime(transaction.date)}</span>
                                            <div className="flex items-center space-x-2">
                                                {getTransactionBadge(transaction.type)}
                                                <span
                                                    className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                                                >
                                                    {transaction.type === "expense" ? "-" : "+"}
                                                    {formatCurrency(transaction.amount)}
                                                </span>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Hora</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Profissional</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead className="text-right">Valor</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTransactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            {dailyTransactions.length === 0
                                                ? `Nenhuma movimentação em ${getDateLabel(selectedDate).toLowerCase()}`
                                                : "Nenhuma movimentação encontrada com os filtros aplicados"}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredTransactions
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell className="font-mono">{formatTime(transaction.date)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        {getTransactionIcon(transaction.type)}
                                                        <span className="ml-2">{transaction.description}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{transaction.category}</TableCell>
                                                <TableCell>
                                                    {/* Since Transaction doesn't have professional directly, we'll need to handle this differently */}
                                                    <span className="text-muted-foreground">-</span>
                                                </TableCell>
                                                <TableCell>{getTransactionBadge(transaction.type)}</TableCell>
                                                <TableCell className="text-right font-medium">
                                                    <span className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                                                        {transaction.type === "expense" ? "-" : "+"}
                                                        {formatCurrency(transaction.amount)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => setEditingEntry(transaction as any)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => setDeletingEntry(transaction as any)}
                                                                className="text-destructive"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Excluir
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Summary Footer */}
                    {filteredTransactions.length > 0 && (
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-4 border-t space-y-2 sm:space-y-0">
                            <div className="text-sm text-muted-foreground">
                                {filteredTransactions.length} de {dailyTransactions.length} movimentações
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                                <span className="text-green-600">
                                    Entradas:{" "}
                                    {formatCurrency(
                                        filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
                                    )}
                                </span>
                                <span className="text-red-600">
                                    Saídas:{" "}
                                    {formatCurrency(
                                        filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
                                    )}
                                </span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Editar Movimentação</DialogTitle>
                        <DialogDescription>Atualize as informações da movimentação</DialogDescription>
                    </DialogHeader>
                    {editingEntry && (
                        <DailyCashFlowForm
                            transaction={editingEntry}
                            selectedDate={selectedDate}
                            onSuccess={() => setEditingEntry(null)}
                            onCancel={() => setEditingEntry(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deletingEntry} onOpenChange={(open) => !open && setDeletingEntry(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir esta movimentação? Esta ação não pode ser desfeita.
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
        </div>
    )
}
