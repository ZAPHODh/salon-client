"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface TopProfessionalsProps {
    sales: Sale[]
    commissions: Commission[]
}

export function TopProfessionals({ sales, commissions }: TopProfessionalsProps) {
    const professionalStats = sales.reduce(
        (acc, sale) => {
            if (sale.professional) {
                const id = sale.professional.id
                if (!acc[id]) {
                    acc[id] = {
                        id,
                        name: sale.professional.name,
                        revenue: 0,
                        salesCount: 0,
                        commission: 0,
                    }
                }
                acc[id].revenue += sale.totalAmount
                acc[id].salesCount += 1
            }
            return acc
        },
        {} as Record<string, any>,
    )

    commissions.forEach((commission) => {
        const id = commission.professional.id
        if (professionalStats[id]) {
            professionalStats[id].commission += commission.amount
        }
    })

    const topProfessionals = Object.values(professionalStats)
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 5)

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    if (topProfessionals.length === 0) {
        return <div className="text-center py-4 text-muted-foreground">Nenhum dado de profissional disponível</div>
    }

    return (
        <div className="space-y-4">
            {topProfessionals.map((professional: any, index) => (
                <div key={professional.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                            {index + 1}
                        </Badge>
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>
                                {professional.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">{professional.name}</p>
                            <p className="text-xs text-muted-foreground">{professional.salesCount} vendas</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(professional.revenue)}</p>
                        <p className="text-xs text-muted-foreground">Comissão: {formatCurrency(professional.commission)}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
