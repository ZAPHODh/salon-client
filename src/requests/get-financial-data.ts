'use server';

import { verifySession } from "@/lib/auth/dal";

async function getFinancialData() {
    try {
        const { session } = await verifySession()

        if (!session) {
            return {
                transactions: [],
                sales: [],
                expenses: [],
                commissions: [],
                paymentMethods: [],
                expenseCategories: [],
            }
        }

        const [transactionsRes, salesRes, expensesRes, commissionsRes, paymentMethodsRes, categoriesRes] =
            await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/transactions`, {
                    headers: { Authorization: `Bearer ${session.accessToken}` },
                    cache: "no-store",
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/sales`, {
                    headers: { Authorization: `Bearer ${session.accessToken}` },
                    cache: "no-store",
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/expenses`, {
                    headers: { Authorization: `Bearer ${session.accessToken}` },
                    cache: "no-store",
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/commissions`, {
                    headers: { Authorization: `Bearer ${session.accessToken}` },
                    cache: "no-store",
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/payment-methods`, {
                    headers: { Authorization: `Bearer ${session.accessToken}` },
                    cache: "no-store",
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/expense-categories`, {
                    headers: { Authorization: `Bearer ${session.accessToken}` },
                    cache: "no-store",
                }),
            ])

        const [transactions, sales, expenses, commissions, paymentMethods, expenseCategories] = await Promise.all([
            transactionsRes.ok ? transactionsRes.json().then((data) => data.transactions || []) : [],
            salesRes.ok ? salesRes.json().then((data) => data.sales || []) : [],
            expensesRes.ok ? expensesRes.json().then((data) => data.expenses || []) : [],
            commissionsRes.ok ? commissionsRes.json().then((data) => data.commissions || []) : [],
            paymentMethodsRes.ok ? paymentMethodsRes.json().then((data) => data.paymentMethods || []) : [],
            categoriesRes.ok ? categoriesRes.json().then((data) => data.categories || []) : [],
        ])

        return {
            transactions,
            sales,
            expenses,
            commissions,
            paymentMethods,
            expenseCategories,
        }
    } catch (error) {
        console.error("Error fetching financial data:", error)
        return {
            transactions: [],
            sales: [],
            expenses: [],
            commissions: [],
            paymentMethods: [],
            expenseCategories: [],
        }
    }
}
export default getFinancialData;
export { getFinancialData };