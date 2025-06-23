"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useSession } from "./session"



interface FinancialContextProps {
    transactions: Transaction[]
    sales: Sale[]
    expenses: Expense[]
    commissions: Commission[]
    paymentMethods: PaymentMethod[]
    expenseCategories: ExpenseCategory[]
    loading: boolean
    error: string | null
    createTransaction: (transaction: Omit<Transaction, "id" | "createdAt" | "financialAccount">) => Promise<void>
    updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>
    deleteTransaction: (id: string) => Promise<void>
    fetchFinancialData: (dateRange?: { from: Date; to: Date }) => Promise<void>
}

const FinancialContext = createContext<FinancialContextProps | undefined>(undefined)

interface FinancialProviderProps {
    children: React.ReactNode
    initialData?: {
        transactions?: Transaction[]
        sales?: Sale[]
        expenses?: Expense[]
        commissions?: Commission[]
        paymentMethods?: PaymentMethod[]
        expenseCategories?: ExpenseCategory[]
    }
}

export const FinancialProvider: React.FC<FinancialProviderProps> = ({ children, initialData }) => {
    const [transactions, setTransactions] = useState<Transaction[]>(initialData?.transactions || [])
    const [sales, setSales] = useState<Sale[]>(initialData?.sales || [])
    const [expenses, setExpenses] = useState<Expense[]>(initialData?.expenses || [])
    const [commissions, setCommissions] = useState<Commission[]>(initialData?.commissions || [])
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialData?.paymentMethods || [])
    const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(initialData?.expenseCategories || [])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { session } = useSession()

    const fetchFinancialData = async (dateRange?: { from: Date; to: Date }) => {
        if (!session?.accessToken) return

        setLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams()
            if (dateRange) {
                params.append("from", dateRange.from.toISOString())
                params.append("to", dateRange.to.toISOString())
            }

            const [transactionsRes, salesRes, expensesRes, commissionsRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transactions?${params}`, {
                    headers: { Authorization: `Bearer ${session.accessToken}` },
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/sales?${params}`, {
                    headers: { Authorization: `Bearer ${session.accessToken}` },
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/expenses?${params}`, {
                    headers: { Authorization: `Bearer ${session.accessToken}` },
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/commissions?${params}`, {
                    headers: { Authorization: `Bearer ${session.accessToken}` },
                }),
            ])

            if (transactionsRes.ok) {
                const data = await transactionsRes.json()
                setTransactions(data.transactions || [])
            }

            if (salesRes.ok) {
                const data = await salesRes.json()
                setSales(data.sales || [])
            }

            if (expensesRes.ok) {
                const data = await expensesRes.json()
                setExpenses(data.expenses || [])
            }

            if (commissionsRes.ok) {
                const data = await commissionsRes.json()
                setCommissions(data.commissions || [])
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao carregar dados financeiros")
        } finally {
            setLoading(false)
        }
    }

    const createTransaction = async (transaction: Omit<Transaction, "id" | "createdAt" | "financialAccount">) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(transaction),
            })

            if (!res.ok) throw new Error("Erro ao criar transação")

            const data = await res.json()
            setTransactions((prev) => [...prev, data.transaction])
        } catch (err) {
            throw new Error(err instanceof Error ? err.message : "Erro ao criar transação")
        }
    }

    const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transactions/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(updates),
            })

            if (!res.ok) throw new Error("Erro ao atualizar transação")

            const data = await res.json()
            setTransactions((prev) => prev.map((t) => (t.id === id ? data.transaction : t)))
        } catch (err) {
            throw new Error(err instanceof Error ? err.message : "Erro ao atualizar transação")
        }
    }

    const deleteTransaction = async (id: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transactions/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            })

            if (!res.ok) throw new Error("Erro ao deletar transação")

            setTransactions((prev) => prev.filter((t) => t.id !== id))
        } catch (err) {
            throw new Error(err instanceof Error ? err.message : "Erro ao deletar transação")
        }
    }

    return (
        <FinancialContext.Provider
            value={{
                transactions,
                sales,
                expenses,
                commissions,
                paymentMethods,
                expenseCategories,
                loading,
                error,
                createTransaction,
                updateTransaction,
                deleteTransaction,
                fetchFinancialData,
            }}
        >
            {children}
        </FinancialContext.Provider>
    )
}

export const useFinancial = () => {
    const context = useContext(FinancialContext)
    if (!context) {
        throw new Error("useFinancial deve ser usado dentro de um FinancialProvider")
    }
    return context
}
