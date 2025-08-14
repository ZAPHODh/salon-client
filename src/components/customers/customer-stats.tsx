import type React from "react"

interface CustomerStatsProps {
    customer: Customer
}

const CustomerStats: React.FC<CustomerStatsProps> = ({ customer }) => {
    const { sales, appointments, transactions } = customer

    const totalSales = sales?.length || 0
    const totalAppointments = appointments?.length || 0
    const totalTransactions = transactions?.length || 0

    return (
        <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Informações do cliente</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm font-medium text-gray-500">Total de vendas</p>
                    <p className="text-xl font-semibold text-gray-900">{totalSales}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Total de agendamentos</p>
                    <p className="text-xl font-semibold text-gray-900">{totalAppointments}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Total de transações</p>
                    <p className="text-xl font-semibold text-gray-900">{totalTransactions}</p>
                </div>
            </div>
        </div>
    )
}

export default CustomerStats
