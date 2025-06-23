"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react"

interface ProfessionalTransactionsProps {
    transactions: Transaction[]
}

export function ProfessionalTransactions({ transactions }: ProfessionalTransactionsProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date))
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

    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const netAmount = totalIncome - totalExpense

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
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${netAmount >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatCurrency(netAmount)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Transações</CardTitle>
                    <CardDescription>Todas as transações financeiras relacionadas ao profissional</CardDescription>
                </CardHeader>
                <CardContent>
                    {transactions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">Nenhuma transação registrada</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead className="text-right">Valor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions
                                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                    .map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>{formatDate(transaction.date)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    {getTransactionIcon(transaction.type)}
                                                    <span className="ml-2">{transaction.description}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getTransactionBadge(transaction.type)}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                <span className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                                                    {transaction.type === "expense" ? "-" : "+"}
                                                    {formatCurrency(transaction.amount)}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
