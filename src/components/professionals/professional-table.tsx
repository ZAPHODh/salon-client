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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Mail, Phone, AlertCircle } from "lucide-react"
import { ProfessionalForm } from "./professional-form"
import { useProfessional } from "../providers/professional"
import { useRouter } from "@/i18n/navigation"


export function ProfessionalsDataTable() {
    const { professionals, error, deleteProfessional } = useProfessional()
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null)
    const [deletingProfessional, setDeletingProfessional] = useState<Professional | null>(null)

    const filteredProfessionals = professionals.filter(
        (professional) =>
            professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            professional.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            professional.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            professional.phone?.includes(searchTerm),
    )

    const handleDelete = async () => {
        if (deletingProfessional) {
            await deleteProfessional(deletingProfessional.id)
            setDeletingProfessional(null)
        }
    }

    const getCategoryBadgeVariant = (category: string) => {
        switch (category) {
            case "hair":
                return "default"
            case "nail":
                return "secondary"
            default:
                return "outline"
        }
    }

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
    const handleRowClick = (professionalSlug: string) => {
        router.push(`/professionals/${professionalSlug}`)
    }
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Gerenciar Profissionais</CardTitle>
                    <CardDescription>Adicione, edite e gerencie os profissionais da sua equipe</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between mb-6">
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar profissionais..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 w-[300px]"
                                />
                            </div>
                        </div>

                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Adicionar Profissional
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Adicionar Novo Profissional</DialogTitle>
                                    <DialogDescription>Preencha as informações do novo profissional</DialogDescription>
                                </DialogHeader>
                                <ProfessionalForm
                                    onSuccess={() => setIsAddDialogOpen(false)}
                                    onCancel={() => setIsAddDialogOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Contato</TableHead>
                                    <TableHead>CPF</TableHead>
                                    <TableHead>Comissão</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProfessionals.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            {searchTerm ? "Nenhum profissional encontrado" : "Nenhum profissional cadastrado"}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredProfessionals.map((professional) => (
                                        <TableRow key={professional.id} onClick={() => handleRowClick(professional.slug)}>
                                            <TableCell className="font-medium">{professional.name}</TableCell>
                                            <TableCell>
                                                <Badge variant={getCategoryBadgeVariant(professional.category)}>
                                                    {getCategoryLabel(professional.category)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {professional.email && (
                                                        <div className="flex items-center text-sm text-muted-foreground">
                                                            <Mail className="mr-1 h-3 w-3" />
                                                            {professional.email}
                                                        </div>
                                                    )}
                                                    {professional.phone && (
                                                        <div className="flex items-center text-sm text-muted-foreground">
                                                            <Phone className="mr-1 h-3 w-3" />
                                                            {professional.phone}
                                                        </div>
                                                    )}
                                                    {!professional.email && !professional.phone && (
                                                        <span className="text-sm text-muted-foreground">-</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{professional.cpf || <span className="text-muted-foreground">-</span>}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{professional.commissionRate}%</Badge>
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
                                                        <DropdownMenuItem onClick={(e) => {
                                                            e.stopPropagation()
                                                            setEditingProfessional(professional)
                                                        }}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => setDeletingProfessional(professional)}
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
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                        <div>
                            Total: {professionals.length} profissionais
                            {searchTerm && ` • Filtrados: ${filteredProfessionals.length}`}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!editingProfessional} onOpenChange={(open) => !open && setEditingProfessional(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Editar Profissional</DialogTitle>
                        <DialogDescription>Atualize as informações do profissional</DialogDescription>
                    </DialogHeader>
                    {editingProfessional && (
                        <ProfessionalForm
                            professional={editingProfessional}
                            onSuccess={() => setEditingProfessional(null)}
                            onCancel={() => setEditingProfessional(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deletingProfessional} onOpenChange={(open) => !open && setDeletingProfessional(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir o profissional <strong>{deletingProfessional?.name}</strong>? Esta ação não
                            pode ser desfeita.
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
