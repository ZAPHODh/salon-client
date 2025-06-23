"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface CustomerTransactionsProps {
    transactions: Transaction[]
}

export function CustomerTransactions({ transactions }: CustomerTransactionsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Histórico de Transações</CardTitle>
                <CardDescription>Últimas transações financeiras do cliente</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                                <div
                                    className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                                        }`}
                                >
                                    {transaction.type === "income" ? (
                                        <ArrowUpRight className="h-4 w-4" />
                                    ) : (
                                        <ArrowDownRight className="h-4 w-4" />
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">{transaction.description}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(transaction.date).toLocaleDateString("pt-BR")} • {transaction.description}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-medium ${transaction.amount > 0 ? "text-green-600" : "text-blue-600"}`}>
                                    {transaction.amount > 0 ? "+" : ""}
                                    {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(Math.abs(transaction.amount))}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
