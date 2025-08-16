'use client'

import { CustomersDataTable } from "@/components/customers/customers-table";


export default function CustomerPage() {
    return (
        <div className="container mx-auto py-4 px-4 sm:py-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Clientes</h2>
                    <p className="text-muted-foreground">Gerencie os clientes do seu salão</p>
                </div>
            </div>
            <CustomersDataTable />
        </div>
    );
}