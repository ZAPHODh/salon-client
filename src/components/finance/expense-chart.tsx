"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"


interface ExpenseChartProps {
    expenses: Expense[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function ExpenseChart({ expenses }: ExpenseChartProps) {
    const categoryTotals = expenses.reduce(
        (acc, expense) => {
            const categoryName = expense.category.name
            acc[categoryName] = (acc[categoryName] || 0) + expense.amount
            return acc
        },
        {} as Record<string, number>,
    )

    const data = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
    }))

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">Nenhuma despesa registrada</div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
        </ResponsiveContainer>
    )
}
