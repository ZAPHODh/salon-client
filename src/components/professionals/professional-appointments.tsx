"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, DollarSign } from "lucide-react"


interface ProfessionalAppointmentsProps {
    appointments: Appointment[]
}

export function ProfessionalAppointments({ appointments }: ProfessionalAppointmentsProps) {
    const [statusFilter, setStatusFilter] = useState<string>("all")

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "confirmed":
                return <Badge variant="default">Confirmado</Badge>
            case "completed":
                return <Badge variant="secondary">Concluído</Badge>
            case "cancelled":
                return <Badge variant="destructive">Cancelado</Badge>
            case "rescheduled":
                return <Badge variant="outline">Reagendado</Badge>
            case "scheduled":
                return <Badge>Agendado</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date))
    }

    const filteredAppointments = appointments.filter(
        (appointment) => statusFilter === "all" || appointment.status.toLowerCase() === statusFilter,
    )

    const statusCounts = appointments.reduce(
        (acc, appointment) => {
            const status = appointment.status.toLowerCase()
            acc[status] = (acc[status] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Total</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg sm:text-2xl font-bold">{appointments.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Confirmados</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg sm:text-2xl font-bold">{statusCounts.confirmed || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Concluídos</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg sm:text-2xl font-bold">{statusCounts.completed || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Receita</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm sm:text-2xl font-bold">
                            {formatCurrency(
                                appointments
                                    .filter((a) => a.status.toLowerCase() === "completed")
                                    .reduce((sum, a) => sum + a.service.price, 0),
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Appointments Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                        <div>
                            <CardTitle>Agendamentos</CardTitle>
                            <CardDescription>Histórico de agendamentos do profissional</CardDescription>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filtrar por status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="confirmed">Confirmados</SelectItem>
                                <SelectItem value="completed">Concluídos</SelectItem>
                                <SelectItem value="cancelled">Cancelados</SelectItem>
                                <SelectItem value="rescheduled">Reagendados</SelectItem>
                                <SelectItem value="scheduled">Agendados</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredAppointments.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">Nenhum agendamento encontrado</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="min-w-[120px]">Data/Hora</TableHead>
                                        <TableHead className="min-w-[100px]">Cliente</TableHead>
                                        <TableHead className="min-w-[100px]">Serviço</TableHead>
                                        <TableHead className="min-w-[80px]">Valor</TableHead>
                                        <TableHead className="min-w-[100px]">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAppointments.map((appointment) => (
                                        <TableRow key={appointment.id}>
                                            <TableCell className="text-xs sm:text-sm">{formatDate(appointment.startDate)}</TableCell>
                                            <TableCell className="font-medium text-xs sm:text-sm">{appointment.customer.name}</TableCell>
                                            <TableCell className="text-xs sm:text-sm">{appointment.service.name}</TableCell>
                                            <TableCell className="text-xs sm:text-sm">{formatCurrency(appointment.service.price)}</TableCell>
                                            <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
