import { CustomerAppointments } from "@/components/customers/customer-appointments"
import { CustomerTransactions } from "@/components/customers/customer-transactions"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Edit } from "lucide-react"
import Link from "next/link"
import CustomerStats from "./customer-stats"



export default async function CustomerPage({ customer }: { customer: Customer }) {

    return (
        <div className="container mx-auto py-4 px-4 sm:py-6 space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/customers">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl">{customer.name}</CardTitle>
                            <CardDescription>
                                Cliente desde {new Date(customer.createdAt).toLocaleDateString("pt-BR")}
                            </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">

                            <Button size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{customer.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{customer.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{customer.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                                Nascimento: {customer.birthDay ? new Date(customer.birthDay).toLocaleDateString("pt-BR") : "Não informado"}
                            </span>
                        </div>
                    </div>

                </CardContent>
            </Card>

            <CustomerStats customer={customer} />


            <Tabs defaultValue="appointments" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
                    <TabsTrigger value="transactions">Transações</TabsTrigger>
                </TabsList>

                <TabsContent value="appointments" className="space-y-4">
                    {customer.appointments && <CustomerAppointments appointments={customer.appointments} />}
                </TabsContent>
                <TabsContent value="transactions" className="space-y-4">
                    {customer.transactions && <CustomerTransactions transactions={customer.transactions} />}
                </TabsContent>
            </Tabs>
        </div>
    )
}
