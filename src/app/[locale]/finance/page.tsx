"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"

import { FinancialOverview } from "@/components/finance/financial-overview"
import { ProfessionalFinancials } from "@/components/finance/professional-financials"
import { ProductFinancials } from "@/components/finance/product-financials"
import { FinancialTransactions } from "@/components/finance/financial-transactions"
import { Download, TrendingUp, DollarSign, CreditCard, Users, Calendar } from "lucide-react"
import { DailyCashFlow } from "@/components/finance/daily-cash-flow"

export default function FinancePage() {
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
    })

    return (
        <div className="container mx-auto py-4 px-4 sm:py-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard Financeiro</h2>
                    <p className="text-muted-foreground">Acompanhe o desempenho financeiro do seu salão</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <CalendarDateRangePicker date={dateRange} onDateChange={(value) => {
                        if (!value || !value.from || !value.to) return
                        setDateRange({ from: value.from, to: value.to })
                    }} />
                    <Button>
                        <Download className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Exportar</span>
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <div className="overflow-x-auto">
                    <TabsList className="grid w-max grid-cols-4 min-w-full md:w-full">
                        <TabsTrigger value="overview" className="flex items-center whitespace-nowrap px-3 py-2">
                            <TrendingUp className="mr-1 h-4 w-4 md:mr-2" />
                            <span>Visão Geral</span>
                        </TabsTrigger>
                        <TabsTrigger value="professionals" className="flex items-center whitespace-nowrap px-3 py-2">
                            <Users className="mr-1 h-4 w-4 md:mr-2" />
                            <span>Profissionais</span>
                        </TabsTrigger>
                        <TabsTrigger value="products" className="flex items-center whitespace-nowrap px-3 py-2">
                            <DollarSign className="mr-1 h-4 w-4 md:mr-2" />
                            <span>Produtos</span>
                        </TabsTrigger>
                        <TabsTrigger value="transactions" className="flex items-center whitespace-nowrap px-3 py-2">
                            <CreditCard className="mr-1 h-4 w-4 md:mr-2" />
                            <span>Transações</span>
                        </TabsTrigger>
                        <TabsTrigger value="daily" className="flex items-center whitespace-nowrap px-3 py-2">
                            <Calendar className="mr-1 h-4 w-4 md:mr-2" />
                            <span>Diário</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview">
                    <FinancialOverview dateRange={dateRange} />
                </TabsContent>

                <TabsContent value="professionals">
                    <ProfessionalFinancials dateRange={dateRange} />
                </TabsContent>

                <TabsContent value="products">
                    <ProductFinancials dateRange={dateRange} />
                </TabsContent>

                <TabsContent value="transactions">
                    <FinancialTransactions dateRange={dateRange} />
                </TabsContent>

                <TabsContent value="daily">
                    <DailyCashFlow />
                </TabsContent>
            </Tabs>
        </div>
    )
}
