"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, Plus } from "lucide-react"

interface ProfessionalServicesProps {
    services: Service[]
}

export function ProfessionalServices({ services }: ProfessionalServicesProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        if (hours > 0) {
            return `${hours}h ${mins}min`
        }
        return `${mins}min`
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Serviços Oferecidos</h3>
                    <p className="text-sm text-muted-foreground">
                        {services.length} serviço{services.length !== 1 ? "s" : ""} cadastrado{services.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Serviço
                </Button>
            </div>

            {services.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                        <div className="text-center space-y-2">
                            <h4 className="text-lg font-medium">Nenhum serviço cadastrado</h4>
                            <p className="text-sm text-muted-foreground px-4">
                                Adicione serviços para que este profissional possa atender clientes
                            </p>
                            <Button className="mt-4">
                                <Plus className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Adicionar Primeiro Serviço</span>
                                <span className="sm:hidden">Adicionar Serviço</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((service) => (
                        <Card key={service.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="min-w-0 flex-1">
                                        <CardTitle className="text-base sm:text-lg truncate">{service.name}</CardTitle>
                                        {service.description && (
                                            <CardDescription className="mt-1 text-sm line-clamp-2">{service.description}</CardDescription>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <DollarSign className="mr-1 h-4 w-4 flex-shrink-0" />
                                            <span>Preço</span>
                                        </div>
                                        <Badge variant="outline" className="font-semibold text-xs sm:text-sm">
                                            {formatCurrency(service.price)}
                                        </Badge>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Clock className="mr-1 h-4 w-4 flex-shrink-0" />
                                            <span>Duração</span>
                                        </div>
                                        <Badge variant="secondary" className="text-xs sm:text-sm">
                                            {formatDuration(service.duration)}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
