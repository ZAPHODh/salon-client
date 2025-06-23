"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Clock, DollarSign, Scissors, BarChart3, User } from "lucide-react"
import { ServiceForm } from "./service-form"
import { ServiceStats } from "./service-stats"
import { useService } from "../providers/service"
import { useProfessional } from "../providers/professional"

export function ServicesDataTable() {
    const { services, deleteService } = useService()
    const { professionals } = useProfessional()
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingService, setEditingService] = useState<Service | null>(null)
    const [deletingService, setDeletingService] = useState<Service | null>(null)

    const filteredServices = services.filter(
        (service) =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.professional?.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleDelete = async () => {
        if (deletingService) {
            await deleteService(deletingService.id)
            setDeletingService(null)
        }
    }

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
            <Card>
                <CardHeader>
                    <CardTitle>Gerenciar Serviços</CardTitle>
                    <CardDescription>Adicione, edite e gerencie os serviços oferecidos pelo salão</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="list" className="space-y-4">
                        <div className="overflow-x-auto">
                            <TabsList className="grid w-max grid-cols-2 min-w-full md:w-full">
                                <TabsTrigger value="list" className="flex items-center whitespace-nowrap px-4 py-2">
                                    <Scissors className="mr-1 h-4 w-4 md:mr-2" />
                                    <span>Lista de Serviços</span>
                                </TabsTrigger>
                                <TabsTrigger value="stats" className="flex items-center whitespace-nowrap px-4 py-2">
                                    <BarChart3 className="mr-1 h-4 w-4 md:mr-2" />
                                    <span>Estatísticas</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="list" className="space-y-4">
                            {/* Header Actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                                <div className="flex items-center space-x-2">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Buscar serviços..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-8 w-full sm:w-[300px]"
                                        />
                                    </div>
                                </div>

                                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            <span className="hidden sm:inline">Adicionar Serviço</span>
                                            <span className="sm:hidden">Adicionar</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Adicionar Novo Serviço</DialogTitle>
                                            <DialogDescription>Preencha as informações do novo serviço</DialogDescription>
                                        </DialogHeader>
                                        <ServiceForm
                                            professionals={professionals}
                                            onSuccess={() => setIsAddDialogOpen(false)}
                                            onCancel={() => setIsAddDialogOpen(false)}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Services Grid for Mobile, Table for Desktop */}
                            <div className="block sm:hidden">
                                {/* Mobile Card View */}
                                <div className="space-y-3">
                                    {filteredServices.length === 0 ? (
                                        <Card>
                                            <CardContent className="flex flex-col items-center justify-center py-8">
                                                <div className="text-center space-y-2">
                                                    <h4 className="text-lg font-medium">
                                                        {searchTerm ? "Nenhum serviço encontrado" : "Nenhum serviço cadastrado"}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {searchTerm ? "Tente ajustar sua busca" : "Adicione serviços para começar"}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        filteredServices.map((service) => (
                                            <Card key={service.id} className="p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold truncate">{service.name}</h4>
                                                        {service.description && (
                                                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{service.description}</p>
                                                        )}
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => setEditingService(service)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => setDeletingService(service)}
                                                                className="text-destructive"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Excluir
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div className="flex items-center">
                                                        <DollarSign className="mr-1 h-3 w-3 text-muted-foreground" />
                                                        <span className="font-medium">{formatCurrency(service.price)}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                                                        <span>{formatDuration(service.duration)}</span>
                                                    </div>
                                                    {service.professional && (
                                                        <div className="flex items-center col-span-2">
                                                            <User className="mr-1 h-3 w-3 text-muted-foreground" />
                                                            <span className="text-muted-foreground truncate">{service.professional.name}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex justify-between items-center mt-3 pt-3 border-t">
                                                    <Badge variant="outline" className="text-xs">
                                                        {service.appointments?.length || 0} agendamentos
                                                    </Badge>
                                                </div>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden sm:block rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Profissional</TableHead>
                                            <TableHead>Preço</TableHead>
                                            <TableHead>Duração</TableHead>
                                            <TableHead>Agendamentos</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredServices.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                    {searchTerm ? "Nenhum serviço encontrado" : "Nenhum serviço cadastrado"}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredServices.map((service) => (
                                                <TableRow key={service.id} className="hover:bg-muted/50 transition-colors">
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{service.name}</div>
                                                            {service.description && (
                                                                <div className="text-sm text-muted-foreground line-clamp-1">{service.description}</div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {service.professional ? (
                                                            <Badge variant="secondary">{service.professional.name}</Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground">Não atribuído</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="font-semibold">
                                                            {formatCurrency(service.price)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center">
                                                            <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                                                            {formatDuration(service.duration)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{service.appointments?.length || 0}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Abrir menu</span>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => setEditingService(service)}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Editar
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => setDeletingService(service)}
                                                                    className="text-destructive"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Excluir
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div>
                                    Total: {services.length} serviços
                                    {searchTerm && ` • Filtrados: ${filteredServices.length}`}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="stats">
                            <ServiceStats services={services} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={!!editingService} onOpenChange={(open) => !open && setEditingService(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Editar Serviço</DialogTitle>
                        <DialogDescription>Atualize as informações do serviço</DialogDescription>
                    </DialogHeader>
                    {editingService && (
                        <ServiceForm
                            service={editingService as Service}
                            professionals={professionals}
                            onSuccess={() => setEditingService(null)}
                            onCancel={() => setEditingService(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deletingService} onOpenChange={(open) => !open && setDeletingService(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir o serviço <strong>{deletingService?.name}</strong>? Esta ação não pode ser
                            desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}