"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"


interface RevenueChartProps {
    sales: Sale[]
}

export function RevenueChart({ sales }: RevenueChartProps) {
    const endDate = new Date()
    const startDate = subMonths(endDate, 11)
    const months = eachMonthOfInterval({ start: startDate, end: endDate })

    const data = months.map((month) => {
        const monthStart = startOfMonth(month)
        const monthEnd = endOfMonth(month)

        const monthSales = sales.filter((sale) => {
            const saleDate = new Date(sale.createdAt)
            return saleDate >= monthStart && saleDate <= monthEnd
        })

        const total = monthSales.reduce((sum, sale) => sum + sale.totalAmount, 0)

        return {
            name: format(month, "MMM", { locale: ptBR }),
            total: total,
            count: monthSales.length,
        }
    })

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatCurrency} />
                <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Receita"]}
                    labelFormatter={(label) => `Mês: ${label}`}
                />
                <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
            </BarChart>
        </ResponsiveContainer>
    )
}
