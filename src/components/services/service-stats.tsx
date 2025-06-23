"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Clock, Scissors, Calendar } from "lucide-react"



interface ServiceStatsProps {
    services: Service[]
}

export function ServiceStats({ services }: ServiceStatsProps) {
    const totalServices = services.length
    const totalAppointments = services.reduce((sum, service) => sum + (service.appointments?.length || 0), 0)
    const averagePrice = totalServices > 0 ? services.reduce((sum, service) => sum + service.price, 0) / totalServices : 0
    const averageDuration =
        totalServices > 0 ? services.reduce((sum, service) => sum + service.duration, 0) / totalServices : 0
    const mostExpensive = services.length > 0 ? Math.max(...services.map((s) => s.price)) : 0
    const cheapest = services.length > 0 ? Math.min(...services.map((s) => s.price)) : 0
    const longest = services.length > 0 ? Math.max(...services.map((s) => s.duration)) : 0
    const shortest = services.length > 0 ? Math.min(...services.map((s) => s.duration)) : 0
    const servicesWithProfessional = services.filter((s) => s.professional).length
    const servicesWithoutProfessional = services.filter((s) => !s.professional).length
    const popularServices = services
        .map((service) => ({
            ...service,
            appointmentCount: service.appointments?.length || 0,
        }))
        .sort((a, b) => b.appointmentCount - a.appointmentCount)
        .slice(0, 5)

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
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Total de Serviços</CardTitle>
                        <Scissors className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg sm:text-2xl font-bold">{totalServices}</div>
                        <p className="text-xs text-muted-foreground">{servicesWithProfessional} com profissional</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Preço Médio</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg sm:text-2xl font-bold">{formatCurrency(averagePrice)}</div>
                        <p className="text-xs text-muted-foreground">
                            {formatCurrency(cheapest)} - {formatCurrency(mostExpensive)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Duração Média</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg sm:text-2xl font-bold">{formatDuration(averageDuration)}</div>
                        <p className="text-xs text-muted-foreground">
                            {formatDuration(shortest)} - {formatDuration(longest)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Agendamentos</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg sm:text-2xl font-bold">{totalAppointments}</div>
                        <p className="text-xs text-muted-foreground">
                            {totalServices > 0 ? Math.round(totalAppointments / totalServices) : 0} por serviço
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Distribuição de Serviços</CardTitle>
                        <CardDescription>Análise da atribuição de profissionais</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Com profissional atribuído</span>
                                <span>
                                    {servicesWithProfessional}/{totalServices}
                                </span>
                            </div>
                            <Progress
                                value={totalServices > 0 ? (servicesWithProfessional / totalServices) * 100 : 0}
                                className="h-2"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Sem profissional atribuído</span>
                                <span>
                                    {servicesWithoutProfessional}/{totalServices}
                                </span>
                            </div>
                            <Progress
                                value={totalServices > 0 ? (servicesWithoutProfessional / totalServices) * 100 : 0}
                                className="h-2"
                            />
                        </div>

                        <div className="pt-2 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Serviço mais caro</span>
                                <Badge variant="outline">{formatCurrency(mostExpensive)}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Serviço mais barato</span>
                                <Badge variant="outline">{formatCurrency(cheapest)}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Serviços Mais Populares</CardTitle>
                        <CardDescription>Baseado no número de agendamentos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {popularServices.length === 0 ? (
                            <div className="text-center py-4 text-muted-foreground">Nenhum agendamento registrado</div>
                        ) : (
                            <div className="space-y-3">
                                {popularServices.map((service, index) => (
                                    <div key={service.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                                                {index + 1}
                                            </Badge>
                                            <div className="min-w-0 flex-1">
                                                <div className="font-medium text-sm truncate">{service.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {formatCurrency(service.price)} • {formatDuration(service.duration)}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            {service.appointmentCount} agendamentos
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
