"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { useSession } from "./session"

interface FinancialContextType {
    sales: Sale[]
    expenses: Expense[]
    commissions: Commission[]
    transactions: Transaction[]
    loading: boolean
    fetchFinancialData: (dateRange: { from: Date; to: Date }) => Promise<void>
    createTransaction: (data: any) => Promise<void>
    updateTransaction: (id: string, data: any) => Promise<void>
    deleteTransaction: (id: string) => Promise<void>
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined)

export function FinancialProvider({ children }: { children: ReactNode }) {
    const [sales, setSales] = useState<Sale[]>([])
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [commissions, setCommissions] = useState<Commission[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(false)

    const { session } = useSession()
    const getAuthHeaders = useCallback(() => {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        }

        if (session?.accessToken) {
            headers.Authorization = `Bearer ${session.accessToken}`
        }

        return headers
    }, [session?.accessToken])

    const authenticatedFetch = useCallback(
        async (url: string, options: RequestInit = {}) => {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...getAuthHeaders(),
                    ...options.headers,
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return response
        },
        [getAuthHeaders],
    )

    const fetchFinancialData = useCallback(
        async (dateRange: { from: Date; to: Date }) => {
            if (!session?.accessToken) {
                console.warn("No access token available, skipping financial data fetch")
                return
            }

            setLoading(true)
            try {
                const fromParam = dateRange.from.toISOString()
                const toParam = dateRange.to.toISOString()

                const [salesResult, expensesResult, commissionsResult, transactionsResult] = await Promise.allSettled([
                    authenticatedFetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/sales?from=${fromParam}&to=${toParam}`,
                    ).then(async (res) => {
                        const data = await res.json()
                        return Array.isArray(data) ? data : data.data || []
                    }),
                    authenticatedFetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/expenses?from=${fromParam}&to=${toParam}`,
                    ).then(async (res) => {
                        const data = await res.json()
                        return Array.isArray(data) ? data : data.data || []
                    }),
                    authenticatedFetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/commissions?from=${fromParam}&to=${toParam}`,
                    ).then(async (res) => {
                        const data = await res.json()
                        return Array.isArray(data) ? data : data.data || []
                    }),
                    authenticatedFetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transactions?from=${fromParam}&to=${toParam}`,
                    ).then(async (res) => {
                        const data = await res.json()
                        return Array.isArray(data) ? data : data.data || []
                    }),
                ])
                if (salesResult.status === "fulfilled") {
                    setSales(Array.isArray(salesResult.value) ? salesResult.value : [])
                } else {
                    console.error("Failed to fetch sales:", salesResult.reason)
                    setSales([])
                }

                if (expensesResult.status === "fulfilled") {
                    setExpenses(Array.isArray(expensesResult.value) ? expensesResult.value : [])
                } else {
                    console.error("Failed to fetch expenses:", expensesResult.reason)
                    setExpenses([])
                }

                if (commissionsResult.status === "fulfilled") {
                    setCommissions(Array.isArray(commissionsResult.value) ? commissionsResult.value : [])
                } else {
                    console.error("Failed to fetch commissions:", commissionsResult.reason)
                    setCommissions([])
                }

                if (transactionsResult.status === "fulfilled") {
                    setTransactions(Array.isArray(transactionsResult.value) ? transactionsResult.value : [])
                } else {
                    console.error("Failed to fetch transactions:", transactionsResult.reason)
                    setTransactions([])
                }
            } catch (error) {
                console.error("Error fetching financial data:", error)
                setSales([])
                setExpenses([])
                setCommissions([])
                setTransactions([])
            } finally {
                setLoading(false)
            }
        },
        [session?.accessToken, authenticatedFetch],
    )

    const createTransaction = useCallback(
        async (data: any) => {
            if (!session?.accessToken) {
                console.error("No access token available")
                return
            }
            try {
                const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transactions`, {
                    method: "POST",
                    body: JSON.stringify(data),
                })
                const newTransaction = await response.json()
                setTransactions((prev) => [...prev, newTransaction])
            } catch (error) {
                console.error("Error creating transaction:", error)
            }
        },
        [session?.accessToken, authenticatedFetch],
    )

    const updateTransaction = useCallback(
        async (id: string, data: any) => {
            if (!session?.accessToken) {
                console.error("No access token available")
                return
            }

            try {
                const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transactions/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(data),
                })
                const updatedTransaction = await response.json()
                setTransactions((prev) => prev.map((t) => (t.id === id ? updatedTransaction : t)))
            } catch (error) {
                console.error("Error updating transaction:", error)
            }
        },
        [session?.accessToken, authenticatedFetch],
    )

    const deleteTransaction = useCallback(
        async (id: string) => {
            if (!session?.accessToken) {
                console.error("No access token available")
                return
            }

            try {
                await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transactions/${id}`, {
                    method: "DELETE",
                })
                setTransactions((prev) => prev.filter((t) => t.id !== id))
            } catch (error) {
                console.error("Error deleting transaction:", error)
            }
        },
        [session?.accessToken, authenticatedFetch],
    )

    return (
        <FinancialContext.Provider
            value={{
                sales,
                expenses,
                commissions,
                transactions,
                loading,
                fetchFinancialData,
                createTransaction,
                updateTransaction,
                deleteTransaction,
            }}
        >
            {children}
        </FinancialContext.Provider>
    )
}

export function useFinancial() {
    const context = useContext(FinancialContext)
    if (!context) {
        throw new Error("useFinancial must be used within a FinancialProvider")
    }
    return context
}


// "use client"

// import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
// import { useSession } from "./session"


// interface FinancialContextType {
//     sales: Sale[]
//     expenses: Expense[]
//     commissions: Commission[]
//     transactions: Transaction[]
//     loading: boolean
//     fetchFinancialData: (dateRange: { from: Date; to: Date }) => Promise<void>
//     createTransaction: (data: any) => Promise<void>
//     updateTransaction: (id: string, data: any) => Promise<void>
//     deleteTransaction: (id: string) => Promise<void>
// }

// const FinancialContext = createContext<FinancialContextType | undefined>(undefined)

// export function FinancialProvider({ children }: { children: ReactNode }) {
//     const [sales, setSales] = useState<Sale[]>([])
//     const [expenses, setExpenses] = useState<Expense[]>([])
//     const [commissions, setCommissions] = useState<Commission[]>([])
//     const [transactions, setTransactions] = useState<Transaction[]>([])
//     const [loading, setLoading] = useState(false)
//     const { session } = useSession()
//     const getAuthHeaders = useCallback(() => {
//         const headers: HeadersInit = {
//             "Content-Type": "application/json",
//         }

//         if (session?.accessToken) {
//             headers.Authorization = `Bearer ${session.accessToken}`
//         }

//         return headers
//     }, [session?.accessToken])
//     const authenticatedFetch = useCallback(
//         async (url: string, options: RequestInit = {}) => {
//             const response = await fetch(url, {
//                 ...options,
//                 headers: {
//                     ...getAuthHeaders(),
//                     ...options.headers,
//                 },
//             })

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`)
//             }

//             return response
//         },
//         [getAuthHeaders],
//     )
//     const fetchFinancialData = useCallback(async (dateRange: { from: Date; to: Date }) => {
//         setLoading(true)

//         try {
//             const fromParam = dateRange.from.toISOString()
//             const toParam = dateRange.to.toISOString()

//             const [salesResult, expensesResult, commissionsResult, transactionsResult] = await Promise.allSettled([
//                 authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/sales?from=${fromParam}&to=${toParam}`).then((res) => res.json()),
//                 authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/expenses?from=${fromParam}&to=${toParam}`).then((res) => res.json()),
//                 authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/commissions?from=${fromParam}&to=${toParam}`).then((res) => res.json()),
//                 authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transactions?from=${fromParam}&to=${toParam}`).then((res) => res.json()),
//             ])

//             if (salesResult.status === "fulfilled") setSales(salesResult.value)
//             if (expensesResult.status === "fulfilled") setExpenses(expensesResult.value)
//             if (commissionsResult.status === "fulfilled") setCommissions(commissionsResult.value)
//             if (transactionsResult.status === "fulfilled") setTransactions(transactionsResult.value)
//         } catch (error) {
//             console.error("Error fetching financial data:", error)
//         } finally {
//             console.log(sales, expenses, commissions, transactions)
//             setLoading(false)
//         }
//     }, [])

//     const createTransaction = useCallback(async (data: any) => {
//         try {
//             const response = await fetch("/api/v1/transactions", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(data),
//             })
//             const newTransaction = await response.json()
//             setTransactions((prev) => [...prev, newTransaction])
//         } catch (error) {
//             console.error("Error creating transaction:", error)
//         }
//     }, [])

//     const updateTransaction = useCallback(async (id: string, data: any) => {
//         try {
//             const response = await fetch(`/api/v1/transactions/${id}`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(data),
//             })
//             const updatedTransaction = await response.json()
//             setTransactions((prev) => prev.map((t) => (t.id === id ? updatedTransaction : t)))
//         } catch (error) {
//             console.error("Error updating transaction:", error)
//         }
//     }, [])

//     const deleteTransaction = useCallback(async (id: string) => {
//         try {
//             await fetch(`/api/v1/transactions/${id}`, { method: "DELETE" })
//             setTransactions((prev) => prev.filter((t) => t.id !== id))
//         } catch (error) {
//             console.error("Error deleting transaction:", error)
//         }
//     }, [])

//     return (
//         <FinancialContext.Provider
//             value={{
//                 sales,
//                 expenses,
//                 commissions,
//                 transactions,
//                 loading,
//                 fetchFinancialData,
//                 createTransaction,
//                 updateTransaction,
//                 deleteTransaction,
//             }}
//         >
//             {children}
//         </FinancialContext.Provider>
//     )
// }

// export function useFinancial() {
//     const context = useContext(FinancialContext)
//     if (!context) {
//         throw new Error("useFinancial must be used within a FinancialProvider")
//     }
//     return context
// }
