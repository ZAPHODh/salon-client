"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, TrendingUp, Calendar } from "lucide-react"

interface ProfessionalCommissionsProps {
    commissions: Commission[]
}

export function ProfessionalCommissions({ commissions }: ProfessionalCommissionsProps) {
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
        }).format(new Date(date))
    }

    const totalCommissions = commissions.reduce((sum, commission) => sum + commission.amount, 0)
    const averageCommission = commissions.length > 0 ? totalCommissions / commissions.length : 0

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const thisMonthCommissions = commissions.filter((commission) => {
        const commissionDate = new Date(commission.createdAt)
        return commissionDate.getMonth() === currentMonth && commissionDate.getFullYear() === currentYear
    })
    const thisMonthTotal = thisMonthCommissions.reduce((sum, commission) => sum + commission.amount, 0)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Acumulado</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalCommissions)}</div>
                        <p className="text-xs text-muted-foreground">
                            {commissions.length} comissão{commissions.length !== 1 ? "ões" : ""}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(thisMonthTotal)}</div>
                        <p className="text-xs text-muted-foreground">
                            {thisMonthCommissions.length} comissão{thisMonthCommissions.length !== 1 ? "ões" : ""}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Média por Comissão</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(averageCommission)}</div>
                        <p className="text-xs text-muted-foreground">Valor médio recebido</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Comissões</CardTitle>
                    <CardDescription>Todas as comissões recebidas pelo profissional</CardDescription>
                </CardHeader>
                <CardContent>
                    {commissions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">Nenhuma comissão registrada</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {commissions
                                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                    .map((commission) => (
                                        <TableRow key={commission.id}>
                                            <TableCell>{formatDate(commission.createdAt)}</TableCell>
                                            <TableCell className="font-medium">{formatCurrency(commission.amount)}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">Pago</Badge>
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
