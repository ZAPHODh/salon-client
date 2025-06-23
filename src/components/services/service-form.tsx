"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { useService } from "../providers/service"

const serviceSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().optional(),
    price: z.string().min(1, "Preço é obrigatório"),
    duration: z.string().min(1, "Duração é obrigatória"),
})

type ServiceFormData = z.infer<typeof serviceSchema>


interface ServiceFormProps {
    service?: Service
    professionals: Professional[]
    onSuccess: () => void
    onCancel: () => void
}

export function ServiceForm({ service, professionals, onSuccess, onCancel }: ServiceFormProps) {
    const { createService, updateService } = useService()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: service
            ? {
                name: service.name,
                description: service.description || "",
                price: service.price.toString(),
                duration: service.duration.toString(),
            }
            : {
                name: "",
                description: "",
                price: "",
                duration: "",
            },
    })

    const onSubmit = async (data: ServiceFormData) => {
        setIsLoading(true)
        try {
            const serviceData = {
                name: data.name,
                description: data.description || undefined,
                price: Number.parseFloat(data.price),
                duration: Number.parseInt(data.duration),
            }
            if (service) {
                await updateService(service.id, serviceData)
            } else {
                await createService(serviceData as Omit<Service, 'id'>)
            }
            onSuccess()
        } catch (error) {
            console.error("Error saving service:", error)
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
                                <FormLabel>Nome do Serviço *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Corte de cabelo" {...field} />
                                </FormControl>
                                <FormDescription>Nome que identifica o serviço</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Preço (R$) *</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" min="0" placeholder="0,00" {...field} />
                                </FormControl>
                                <FormDescription>Valor cobrado pelo serviço</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duração (minutos) *</FormLabel>
                                <FormControl>
                                    <Input type="number" min="1" placeholder="60" {...field} />
                                </FormControl>
                                <FormDescription>Tempo necessário para realizar o serviço</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Descreva os detalhes do serviço..."
                                    className="resize-none"
                                    rows={3}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>Informações adicionais sobre o serviço (opcional)</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {service ? "Atualizar" : "Criar"} Serviço
                    </Button>
                </div>
            </form>
        </Form>
    )
}
