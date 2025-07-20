"use client"

import { useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Users } from "lucide-react"
import { isWithinInterval } from "date-fns"
import { useFinancial } from "../providers/financial"
import { useProfessional } from "../providers/professional"

interface ProfessionalFinancialsProps {
    dateRange: { from: Date; to: Date }
}

export function ProfessionalFinancials({ dateRange }: ProfessionalFinancialsProps) {
    const { sales, commissions, fetchFinancialData } = useFinancial()
    const { professionals } = useProfessional()
    const [selectedProfessional, setSelectedProfessional] = useState<string>("all")

    const fetchData = useCallback(() => {
        fetchFinancialData(dateRange)
    }, [dateRange.from.getTime(), dateRange.to.getTime()])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const filteredSales = sales.filter((sale) =>
        isWithinInterval(new Date(sale.createdAt), { start: dateRange.from, end: dateRange.to }),
    )

    const filteredCommissions = commissions.filter((commission) =>
        isWithinInterval(new Date(commission.createdAt), { start: dateRange.from, end: dateRange.to }),
    )

    const professionalStats = professionals
        .map((professional) => {
            const professionalSales = filteredSales.filter((sale) => sale.professional?.id === professional.id)
            const professionalCommissions = filteredCommissions.filter(
                (commission) => commission.professional.id === professional.id,
            )

            const revenue = professionalSales.reduce((sum, sale) => sum + sale.totalAmount, 0)
            const commissionTotal = professionalCommissions.reduce((sum, commission) => sum + commission.amount, 0)
            const salesCount = professionalSales.length
            const averageTicket = salesCount > 0 ? revenue / salesCount : 0

            return {
                id: professional.id,
                name: professional.name,
                revenue,
                commissionTotal,
                salesCount,
                averageTicket,
                commissionRate: professional.commissionRate,
            }
        })
        .sort((a, b) => b.revenue - a.revenue)

    const filteredData =
        selectedProfessional === "all" ? professionalStats : professionalStats.filter((p) => p.id === selectedProfessional)

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    const chartData = professionalStats.slice(0, 10).map((professional) => ({
        name: professional.name.split(" ")[0],
        revenue: professional.revenue,
        commission: professional.commissionTotal,
    }))

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Análise por Profissional</CardTitle>
                    <CardDescription>Selecione um profissional para análise detalhada do período</CardDescription>
                </CardHeader>
                <CardContent>
                    <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
                        <SelectTrigger className="w-full sm:w-[300px]">
                            <SelectValue placeholder="Selecione um profissional" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os profissionais</SelectItem>
                            {professionals.map((professional) => (
                                <SelectItem key={professional.id} value={professional.id}>
                                    {professional.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {selectedProfessional !== "all" && filteredData.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(filteredData[0].revenue)}</div>
                            <p className="text-xs text-muted-foreground">{filteredData[0].salesCount} vendas realizadas</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Comissões</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(filteredData[0].commissionTotal)}</div>
                            <p className="text-xs text-muted-foreground">Taxa: {filteredData[0].commissionRate}%</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(filteredData[0].averageTicket)}</div>
                            <p className="text-xs text-muted-foreground">Por venda realizada</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Eficiência</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {filteredData[0].revenue > 0
                                    ? ((filteredData[0].commissionTotal / filteredData[0].revenue) * 100).toFixed(1)
                                    : 0}
                                %
                            </div>
                            <p className="text-xs text-muted-foreground">Comissão/Receita</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Charts and Rankings */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Receita por Profissional</CardTitle>
                        <CardDescription>Top 10 profissionais por faturamento no período</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => formatCurrency(value)}
                                />
                                <Tooltip formatter={(value: number) => [formatCurrency(value), "Receita"]} />
                                <Bar dataKey="revenue" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ranking de Profissionais</CardTitle>
                        <CardDescription>Classificação por desempenho financeiro no período</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {professionalStats.slice(0, 8).map((professional, index) => (
                                <div key={professional.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                                            {index + 1}
                                        </Badge>
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>P</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{professional.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {professional.salesCount} vendas • {professional.commissionRate}% comissão
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{formatCurrency(professional.revenue)}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatCurrency(professional.commissionTotal)} comissão
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
