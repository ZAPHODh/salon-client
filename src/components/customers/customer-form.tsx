"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCustomer } from "../providers/customer"
import { useRouter } from "next/navigation"


const customerFormSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    genre: z.enum(["male", "female", "other", ""]).optional(),
    birthDay: z.string().optional(),
})

type CustomerFormValues = z.infer<typeof customerFormSchema>

interface CustomerFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    customer?: Customer
}

export function CustomerForm({ open, onOpenChange, customer }: CustomerFormProps) {
    const { createCustomer, updateCustomer } = useCustomer()
    const { refresh } = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<CustomerFormValues>({
        resolver: zodResolver(customerFormSchema),
        defaultValues: {
            name: customer?.name || "",
            email: customer?.email || "",
            phone: customer?.phone || "",
            address: customer?.address || "",
            city: customer?.city || "",
            genre: customer?.genre as "" | "male" | "female" | "other" | undefined || "",
            birthDay: customer?.birthDay ? new Date(customer.birthDay).toISOString().split("T")[0] : "",
        },
    })

    const onSubmit = async (data: CustomerFormValues) => {
        setIsLoading(true)

        try {
            const customerData: Omit<Customer, 'id' | 'salonId' | 'createdAt' | 'slug'> = {
                ...data,
                email: data.email || undefined,
                phone: data.phone || undefined,
                address: data.address || undefined,
                city: data.city || undefined,
                genre: data.genre || undefined,
                birthDay: data.birthDay ? new Date(data.birthDay) : undefined,
            }

            if (customer) {
                await updateCustomer({ ...customerData, id: customer.id })

            } else {
                await createCustomer(customerData)
            }

            form.reset()
        } catch (error) {
            console.error("Error saving customer:", error)
        } finally {
            setIsLoading(false)
            onOpenChange(false)
            refresh()
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{customer ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
                    <DialogDescription>
                        {customer ? "Edite as informações do cliente aqui." : "Adicione um novo cliente ao sistema."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome completo" {...field} />
                                    </FormControl>
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
                                        <Input placeholder="(11) 99999-9999" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cidade</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Cidade" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="genre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gênero</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="male">Masculino</SelectItem>
                                                <SelectItem value="female">Feminino</SelectItem>
                                                <SelectItem value="other">Outro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Endereço</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Endereço completo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="birthDay"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data de Nascimento</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Salvando..." : customer ? "Salvar Alterações" : "Criar Cliente"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
