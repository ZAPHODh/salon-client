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
import { Plus, Search, MoreHorizontal, Edit, Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { TransactionForm } from "./transaction-form"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useFinancial } from "../providers/financial"

interface FinancialTransactionsProps {
    dateRange: { from: Date; to: Date }
}

export function FinancialTransactions({ dateRange }: FinancialTransactionsProps) {
    const { transactions, deleteTransaction, loading } = useFinancial()
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch =
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = typeFilter === "all" || transaction.type === typeFilter
        return matchesSearch && matchesType
    })

    const handleDelete = async () => {
        if (deletingTransaction) {
            await deleteTransaction(deletingTransaction.id)
            setDeletingTransaction(null)
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
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
                Receita
            </Badge>
        ) : (
            <Badge variant="destructive">Despesa</Badge>
        )
    }

    const totalIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Receitas</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Despesas</CardTitle>
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saldo Líquido</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className={`text-2xl font-bold ${(totalIncome - totalExpense) >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                            {formatCurrency(totalIncome - totalExpense)}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                        <div>
                            <CardTitle>Transações Financeiras</CardTitle>
                            <CardDescription>Gerencie todas as transações do salão</CardDescription>
                        </div>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nova Transação
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Adicionar Nova Transação</DialogTitle>
                                    <DialogDescription>Registre uma nova transação financeira</DialogDescription>
                                </DialogHeader>
                                <TransactionForm
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
                                placeholder="Buscar transações..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filtrar por tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="income">Receitas</SelectItem>
                                <SelectItem value="expense">Despesas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block sm:hidden space-y-3">
                        {filteredTransactions.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">Nenhuma transação encontrada</div>
                        ) : (
                            filteredTransactions.map((transaction) => (
                                <Card key={transaction.id} className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center space-x-2">
                                            {getTransactionIcon(transaction.type)}
                                            <div>
                                                <h4 className="font-medium">{transaction.description}</h4>
                                                <p className="text-sm text-muted-foreground">{transaction.category}</p>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setEditingTransaction(transaction)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setDeletingTransaction(transaction)}
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">
                                            {format(new Date(transaction.date), "dd/MM/yyyy", { locale: ptBR })}
                                        </span>
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
                                    <TableHead>Data</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead className="text-right">Valor</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTransactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Nenhuma transação encontrada
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredTransactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>{format(new Date(transaction.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    {getTransactionIcon(transaction.type)}
                                                    <span className="ml-2">{transaction.description}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{transaction.category}</TableCell>
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
                                                        <DropdownMenuItem onClick={() => setEditingTransaction(transaction)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => setDeletingTransaction(transaction)}
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
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={!!editingTransaction} onOpenChange={(open) => !open && setEditingTransaction(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Editar Transação</DialogTitle>
                        <DialogDescription>Atualize as informações da transação</DialogDescription>
                    </DialogHeader>
                    {editingTransaction && (
                        <TransactionForm
                            transaction={editingTransaction}
                            onSuccess={() => setEditingTransaction(null)}
                            onCancel={() => setEditingTransaction(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deletingTransaction} onOpenChange={(open) => !open && setDeletingTransaction(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
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
