"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    CreditCard,
    Calendar,
    DollarSign,
    Scissors,
    TrendingUp,
    Edit,
} from "lucide-react"
import { ProfessionalStats } from "@/components/professionals/professional-stats"
import { ProfessionalServices } from "@/components/professionals/professional-services"
import { ProfessionalAppointments } from "@/components/professionals/professional-appointments"
import { ProfessionalCommissions } from "@/components/professionals/professional-commissions"
import { ProfessionalTransactions } from "@/components/professionals/professional-transactions"



export default function ProfessionalDetailPage({ professional }: { professional: Professional }) {
    const router = useRouter()

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case "hair":
                return "Cabelo"
            case "nail":
                return "Unha"
            default:
                return category
        }
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "hair":
                return <Scissors className="h-4 w-4" />
            case "nail":
                return <User className="h-4 w-4" />
            default:
                return <User className="h-4 w-4" />
        }
    }

    return (
        <div className="container mx-auto py-4 px-4 sm:py-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <Button variant="ghost" onClick={() => router.back()} className="self-start">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>
                <Button className="self-start sm:self-auto">
                    <Edit className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Editar Profissional</span>
                    <span className="sm:hidden">Editar</span>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                                <AvatarFallback>
                                    {professional.name ? professional.name.charAt(0).toUpperCase() : <User className="h-6 w-6" />}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-xl sm:text-2xl">{professional.name}</CardTitle>
                                <CardDescription className="flex items-center mt-2">
                                    {getCategoryIcon(professional.category)}
                                    <span className="ml-2">{getCategoryLabel(professional.category)}</span>
                                </CardDescription>
                            </div>
                        </div>
                        <Badge variant="outline" className="text-sm sm:text-lg px-2 py-1 sm:px-3 self-start">
                            {professional.commissionRate}% Comissão
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                Informações de Contato
                            </h4>
                            {professional.email && (
                                <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <span className="text-sm break-all">{professional.email}</span>
                                </div>
                            )}
                            {professional.phone && (
                                <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <span className="text-sm">{professional.phone}</span>
                                </div>
                            )}
                            {professional.cpf && (
                                <div className="flex items-center space-x-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <span className="text-sm">{professional.cpf}</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                Informações do Salão
                            </h4>
                            {professional.salon && (
                                <>
                                    <div className="text-sm">
                                        <div className="font-medium">{professional.salon.name}</div>
                                        <div className="text-muted-foreground break-words">{professional.salon.address}</div>
                                        {professional.salon.city && <div className="text-muted-foreground">{professional.salon.city}</div>}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                Estatísticas Rápidas
                            </h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Serviços Oferecidos:</span>
                                    <span className="font-medium">{professional.services?.length || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Agendamentos:</span>
                                    <span className="font-medium">{professional.appointments?.length || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Comissões:</span>
                                    <span className="font-medium">{professional.commissions?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="overview" className="space-y-4">
                <div className="overflow-x-auto">
                    <TabsList className="grid w-max grid-cols-5 min-w-full md:w-full">
                        <TabsTrigger value="overview" className="flex items-center whitespace-nowrap px-3 py-2">
                            <TrendingUp className="mr-1 h-4 w-4 md:mr-2" />
                            <span className="hidden sm:inline">Visão Geral</span>
                            <span className="sm:hidden">Visão</span>
                        </TabsTrigger>
                        <TabsTrigger value="services" className="flex items-center whitespace-nowrap px-3 py-2">
                            <Scissors className="mr-1 h-4 w-4 md:mr-2" />
                            <span className="hidden sm:inline">Serviços</span>
                            <span className="sm:hidden">Serviços</span>
                        </TabsTrigger>
                        <TabsTrigger value="appointments" className="flex items-center whitespace-nowrap px-3 py-2">
                            <Calendar className="mr-1 h-4 w-4 md:mr-2" />
                            <span className="hidden sm:inline">Agendamentos</span>
                            <span className="sm:hidden">Agenda</span>
                        </TabsTrigger>
                        <TabsTrigger value="commissions" className="flex items-center whitespace-nowrap px-3 py-2">
                            <DollarSign className="mr-1 h-4 w-4 md:mr-2" />
                            <span className="hidden sm:inline">Comissões</span>
                            <span className="sm:hidden">Comissão</span>
                        </TabsTrigger>
                        <TabsTrigger value="transactions" className="flex items-center whitespace-nowrap px-3 py-2">
                            <CreditCard className="mr-1 h-4 w-4 md:mr-2" />
                            <span className="hidden sm:inline">Transações</span>
                            <span className="sm:hidden">Transação</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview">
                    <ProfessionalStats professional={professional} />
                </TabsContent>

                <TabsContent value="services">
                    <ProfessionalServices services={professional.services || []} />
                </TabsContent>

                <TabsContent value="appointments">
                    <ProfessionalAppointments appointments={professional.appointments || []} />
                </TabsContent>

                <TabsContent value="commissions">
                    <ProfessionalCommissions commissions={professional.commissions || []} />
                </TabsContent>

                <TabsContent value="transactions">
                    <ProfessionalTransactions transactions={professional.transactions || []} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
