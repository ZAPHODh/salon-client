"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    createProfessionalSchema,
    type createProfessionalSchemaType,
    defaultProfessionalValues,
} from "@/schemas/professional"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { useProfessional } from "../providers/professional"


interface ProfessionalFormProps {
    professional?: Professional
    onSuccess: () => void
    onCancel: () => void
}

export function ProfessionalForm({ professional, onSuccess, onCancel }: ProfessionalFormProps) {
    const { createProfessional, updateProfessional } = useProfessional()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<createProfessionalSchemaType>({
        resolver: zodResolver(createProfessionalSchema),
        defaultValues: professional
            ? {
                name: professional.name,
                category: professional.category,
                cpf: professional.cpf || "",
                phone: professional.phone || "",
                email: professional.email || "",
                commissionRate: professional.commissionRate.toString(),
            }
            : defaultProfessionalValues,
    })

    const onSubmit = async (data: createProfessionalSchemaType) => {
        setIsLoading(true)
        try {
            if (professional) {
                await updateProfessional({
                    id: professional.id,
                    ...data,
                })
            } else {
                await createProfessional(data)
            }
            onSuccess()
        } catch (error) {
            console.error("Error saving professional:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nome completo" {...field} />
                                </FormControl>
                                <FormDescription>Nome completo do profissional</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categoria *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione uma categoria" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="hair">Cabelo</SelectItem>
                                        <SelectItem value="nail">Unha</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>Área de especialização</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CPF</FormLabel>
                                <FormControl>
                                    <Input placeholder="00000000000" {...field} maxLength={11} />
                                </FormControl>
                                <FormDescription>Documento de identificação (opcional)</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="commissionRate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Taxa de Comissão (%) *</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="0" min="0" max="100" {...field} />
                                </FormControl>
                                <FormDescription>Percentual de comissão do profissional</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                    <Input placeholder="11999999999" {...field} />
                                </FormControl>
                                <FormDescription>Número de contato (opcional)</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="email@exemplo.com" {...field} />
                                </FormControl>
                                <FormDescription>Endereço de email (opcional)</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {professional ? "Atualizar" : "Criar"} Profissional
                    </Button>
                </div>
            </form>
        </Form>
    )
}
