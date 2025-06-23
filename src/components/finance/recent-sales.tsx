"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"


interface RecentSalesProps {
    sales: Sale[]
}

export function RecentSales({ sales }: RecentSalesProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    if (sales.length === 0) {
        return <div className="text-center py-4 text-muted-foreground">Nenhuma venda recente</div>
    }

    return (
        <div className="space-y-8">
            {sales.map((sale) => (
                <div key={sale.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback>
                            {sale.customer?.name ? sale.customer.name.charAt(0).toUpperCase() : "C"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{sale.customer?.name || "Cliente não identificado"}</p>
                        <p className="text-sm text-muted-foreground">
                            {sale.professional?.name && `Atendido por ${sale.professional.name} • `}
                            {format(new Date(sale.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                    </div>
                    <div className="ml-auto font-medium">{formatCurrency(sale.totalAmount)}</div>
                </div>
            ))}
        </div>
    )
}
