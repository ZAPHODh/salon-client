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
import { format } from "date-fns"
import { useFinancial } from "../providers/financial"
import { useProfessional } from "../providers/professional"

const dailyCashFlowSchema = z.object({
    type: z.enum(["income", "expense"]),
    amount: z.string().min(1, "Valor é obrigatório"),
    category: z.string().min(1, "Categoria é obrigatória"),
    description: z.string().min(1, "Descrição é obrigatória"),
    time: z.string().min(1, "Hora é obrigatória"),
    accountId: z.string().min(1, "Conta financeira é obrigatória"),
    referenceId: z.string().optional(),
})

type DailyCashFlowFormData = z.infer<typeof dailyCashFlowSchema>

interface DailyCashFlowFormProps {
    transaction?: Transaction
    selectedDate: Date
    onSuccess: () => void
    onCancel: () => void
}

const categories = {
    income: ["Serviços de Cabelo", "Serviços de Unha", "Venda de Produtos", "Comissões", "Gorjetas", "Outros Serviços"],
    expense: [
        "Material de Trabalho",
        "Produtos para Revenda",
        "Energia Elétrica",
        "Água",
        "Internet/Telefone",
        "Aluguel",
        "Salários",
        "Comissões Pagas",
        "Marketing",
        "Manutenção",
        "Limpeza",
        "Alimentação",
        "Transporte",
        "Impostos",
        "Outros",
    ],
}

const paymentMethods = [
    "Dinheiro",
    "Cartão de Débito",
    "Cartão de Crédito",
    "PIX",
    "Transferência",
    "Vale Alimentação",
    "Vale Refeição",
    "Outros",
]

export function DailyCashFlowForm({ transaction, selectedDate, onSuccess, onCancel }: DailyCashFlowFormProps) {
    const { createTransaction, updateTransaction } = useFinancial()
    const { professionals } = useProfessional()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<DailyCashFlowFormData>({
        resolver: zodResolver(dailyCashFlowSchema),
        defaultValues: transaction
            ? {
                type: transaction.type,
                amount: transaction.amount.toString(),
                category: transaction.category,
                description: transaction.description,
                time: format(new Date(transaction.date), "HH:mm"),
                accountId: "654321",
                referenceId: "none",
            }
            : {
                type: "income",
                amount: "",
                category: "",
                description: "",
                time: format(new Date(), "HH:mm"),
                accountId: "654321",
                referenceId: "none",
            },
    })

    const watchedType = form.watch("type")

    const onSubmit = async (data: DailyCashFlowFormData) => {
        setIsLoading(true)
        try {
            const [hours, minutes] = data.time.split(":").map(Number)
            const transactionDate = new Date(selectedDate)
            transactionDate.setHours(hours, minutes, 0, 0)

            const transactionData = {
                accountId: data.accountId,
                type: data.type as "income" | "expense",
                amount: Number.parseFloat(data.amount),
                category: data.category,
                description: data.description,
                date: transactionDate,
                referenceId: data.referenceId,
            }

            if (transaction) {
                await updateTransaction(transaction.id, transactionData)
            } else {
                await createTransaction(transactionData)
            }
            onSuccess()
        } catch (error) {
            console.error("Error saving daily cash flow:", error)
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
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="income">Entrada</SelectItem>
                                        <SelectItem value="expense">Saída</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>Tipo da movimentação</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Valor (R$) *</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" min="0" placeholder="0,00" {...field} />
                                </FormControl>
                                <FormDescription>Valor da movimentação</FormDescription>
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
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione uma categoria" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories[watchedType]?.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>Categoria da movimentação</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hora *</FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} />
                                </FormControl>
                                <FormDescription>Hora da movimentação</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="accountId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Conta Financeira *</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} />
                                </FormControl>
                                <FormDescription>Conta financeira da movimentação</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="referenceId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profissional Relacionado</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um profissional" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">Não relacionado</SelectItem>
                                        {professionals.map((professional) => (
                                            <SelectItem key={professional.id} value={professional.id}>
                                                {professional.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>Profissional relacionado à movimentação (opcional)</FormDescription>
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
                            <FormLabel>Descrição *</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Descreva a movimentação..." className="resize-none" rows={3} {...field} />
                            </FormControl>
                            <FormDescription>Descrição detalhada da movimentação</FormDescription>
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
                        {transaction ? "Atualizar" : "Registrar"} Movimentação
                    </Button>
                </div>
            </form>
        </Form>
    )
}
