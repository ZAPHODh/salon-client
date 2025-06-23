"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, DollarSign, TrendingUp, Clock, Star } from "lucide-react"

interface ProfessionalStatsProps {
    professional: Professional
}

export function ProfessionalStats({ professional }: ProfessionalStatsProps) {
    const totalServices = professional.services?.length || 0
    const totalAppointments = professional.appointments?.length || 0
    const totalCommissions = professional.commissions?.reduce((sum, commission) => sum + commission.amount, 0) || 0
    const totalRevenue = professional.appointments?.reduce((sum, appointment) => sum + appointment.service.price, 0) || 0
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const thisMonthAppointments =
        professional.appointments?.filter((appointment) => {
            const appointmentDate = new Date(appointment.date)
            return appointmentDate.getMonth() === currentMonth && appointmentDate.getFullYear() === currentYear
        }) || []

    const thisMonthRevenue = thisMonthAppointments.reduce((sum, appointment) => sum + appointment.service.price, 0)

    const thisMonthCommissions =
        professional.commissions
            ?.filter((commission) => {
                const commissionDate = new Date(commission.createdAt)
                return commissionDate.getMonth() === currentMonth && commissionDate.getFullYear() === currentYear
            })
            .reduce((sum, commission) => sum + commission.amount, 0) || 0
    const averageServicePrice =
        totalServices > 0 ? professional.services.reduce((sum, service) => sum + service.price, 0) / totalServices : 0

    const averageServiceDuration =
        totalServices > 0 ? professional.services.reduce((sum, service) => sum + service.duration, 0) / totalServices : 0

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
                        <CardTitle className="text-xs sm:text-sm font-medium">Receita Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg sm:text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground">Este mês: {formatCurrency(thisMonthRevenue)}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Comissões</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg sm:text-2xl font-bold">{formatCurrency(totalCommissions)}</div>
                        <p className="text-xs text-muted-foreground">Este mês: {formatCurrency(thisMonthCommissions)}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Agendamentos</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg sm:text-2xl font-bold">{totalAppointments}</div>
                        <p className="text-xs text-muted-foreground">Este mês: {thisMonthAppointments.length}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Serviços Oferecidos</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg sm:text-2xl font-bold">{totalServices}</div>
                        <p className="text-xs text-muted-foreground">Preço médio: {formatCurrency(averageServicePrice)}</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Performance do Mês</CardTitle>
                        <CardDescription>Comparação com metas e médias</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Agendamentos este mês</span>
                                <span>{thisMonthAppointments.length}/30</span>
                            </div>
                            <Progress value={(thisMonthAppointments.length / 30) * 100} className="h-2" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Meta de receita</span>
                                <span className="text-xs sm:text-sm">{formatCurrency(thisMonthRevenue)}/R$ 5.000</span>
                            </div>
                            <Progress value={(thisMonthRevenue / 5000) * 100} className="h-2" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Taxa de comissão</span>
                                <span>{professional.commissionRate}%</span>
                            </div>
                            <Progress value={Number.parseInt(professional.commissionRate)} className="h-2" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Informações dos Serviços</CardTitle>
                        <CardDescription>Estatísticas sobre os serviços oferecidos</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Preço médio por serviço</span>
                            <Badge variant="outline" className="text-xs">
                                {formatCurrency(averageServicePrice)}
                            </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm">Duração média</span>
                            <Badge variant="outline" className="text-xs">
                                <Clock className="mr-1 h-3 w-3" />
                                {formatDuration(averageServiceDuration)}
                            </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm">Serviço mais caro</span>
                            <Badge variant="outline" className="text-xs">
                                {professional.services.length > 0
                                    ? formatCurrency(Math.max(...professional.services.map((s) => s.price)))
                                    : formatCurrency(0)}
                            </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm">Serviço mais rápido</span>
                            <Badge variant="outline" className="text-xs">
                                <Clock className="mr-1 h-3 w-3" />
                                {professional.services.length > 0
                                    ? formatDuration(Math.min(...professional.services.map((s) => s.duration)))
                                    : "0min"}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
