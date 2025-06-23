"use client"

import { DailyCashFlow } from "@/components/finance/daily-cash-flow"


export default function DailyCashFlowPage() {
    return (
        <div className="container mx-auto py-4 px-4 sm:py-6">
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Movimentação Diária</h2>
                    <p className="text-muted-foreground">Controle detalhado das entradas e saídas do caixa por dia</p>
                </div>
                <DailyCashFlow />
            </div>
        </div>
    )
}
