"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface CustomerAppointmentsProps {
    appointments: Appointment[]
}

export function CustomerAppointments({ appointments }: CustomerAppointmentsProps) {

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return <Badge variant="default">Concluído</Badge>
            case "scheduled":
                return <Badge variant="secondary">Agendado</Badge>
            case "cancelled":
                return <Badge variant="destructive">Cancelado</Badge>
            default:
                return <Badge variant="outline">Desconhecido</Badge>
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Histórico de Agendamentos</CardTitle>
                <CardDescription>Últimos agendamentos do cliente</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {appointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                        {format(new Date(appointment.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                    </span>
                                    <Clock className="h-4 w-4 text-muted-foreground ml-4" />
                                    <span>
                                        {format(new Date(appointment.date), "HH:mm")}
                                    </span>
                                </div>
                                <div className="text-sm text-muted-foreground">{appointment.service.name}</div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <User className="h-3 w-3" />
                                    <span>{appointment.professional.name}</span>
                                </div>
                            </div>
                            <div className="text-right space-y-2">
                                {getStatusBadge(appointment.status)}
                                <div className="font-medium">
                                    {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(appointment.service.price)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
