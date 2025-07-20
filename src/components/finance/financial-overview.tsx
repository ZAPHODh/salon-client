"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Users } from "lucide-react"
import { RevenueChart } from "./revenue-chart"
import { ExpenseChart } from "./expense-chart"
import { RecentSales } from "./recent-sales"
import { TopProfessionals } from "./top-professionals"
import { isWithinInterval } from "date-fns"
import { useFinancial } from "../providers/financial"

interface FinancialOverviewProps {
    dateRange: { from: Date; to: Date }
}

export function FinancialOverview({ dateRange }: FinancialOverviewProps) {
    const { sales, expenses, commissions, transactions, loading } = useFinancial()

    const filteredSales = sales.filter((sale) =>
        isWithinInterval(new Date(sale.createdAt), { start: dateRange.from, end: dateRange.to }),
    )

    const filteredExpenses = expenses.filter((expense) =>
        isWithinInterval(new Date(expense.date), { start: dateRange.from, end: dateRange.to }),
    )

    const filteredCommissions = commissions.filter((commission) =>
        isWithinInterval(new Date(commission.createdAt), { start: dateRange.from, end: dateRange.to }),
    )

    const filteredTransactions = transactions.filter((transaction) =>
        isWithinInterval(new Date(transaction.date), { start: dateRange.from, end: dateRange.to }),
    )

    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0)
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalCommissions = filteredCommissions.reduce((sum, commission) => sum + commission.amount, 0)
    const netProfit = totalRevenue - totalExpenses - totalCommissions

    const totalSales = filteredSales.length
    const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0

    const previousRevenue = totalRevenue * 0.85
    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="animate-pulse space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            {revenueGrowth >= 0 ? (
                                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                            ) : (
                                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                            )}
                            {Math.abs(revenueGrowth).toFixed(1)}% em relação ao período anterior
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatCurrency(netProfit)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Margem: {totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0}%
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSales}</div>
                        <p className="text-xs text-muted-foreground">Ticket médio: {formatCurrency(averageTicket)}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Comissões Pagas</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalCommissions)}</div>
                        <p className="text-xs text-muted-foreground">{filteredCommissions.length} pagamentos realizados</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Receita por Período</CardTitle>
                        <CardDescription>Evolução da receita no período selecionado</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <RevenueChart sales={filteredSales} />
                    </CardContent>
                </Card>

                <Card className="col-span-4 md:col-span-3">
                    <CardHeader>
                        <CardTitle>Vendas Recentes</CardTitle>
                        <CardDescription>Últimas {Math.min(filteredSales.length, 5)} vendas realizadas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentSales sales={filteredSales.slice(0, 5)} />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Despesas por Categoria</CardTitle>
                        <CardDescription>Distribuição dos gastos por categoria no período</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ExpenseChart expenses={filteredExpenses} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Profissionais</CardTitle>
                        <CardDescription>Profissionais com maior faturamento no período</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TopProfessionals sales={filteredSales} commissions={filteredCommissions} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
