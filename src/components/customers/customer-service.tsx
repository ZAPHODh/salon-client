"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CustomerServicesProps {
    services: Service[]
}

export function CustomerServices({ services }: CustomerServicesProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Serviços Mais Utilizados</CardTitle>
                <CardDescription>Histórico de serviços do cliente</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {services.map((service) => (
                        <div key={service.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">{service.name}</p>
                                    <p className="text-sm text-muted-foreground">{service.professional?.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">
                                        {new Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }).format(service.price)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
