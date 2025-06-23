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
import { useFinancial } from "../providers/financial"

const transactionSchema = z.object({
    type: z.enum(["income", "expense"]),
    amount: z.string().min(1, "Valor é obrigatório"),
    category: z.string().min(1, "Categoria é obrigatória"),
    description: z.string().min(1, "Descrição é obrigatória"),
    date: z.string().min(1, "Data é obrigatória"),
    accountId: z.string().min(1, "Conta financeira é obrigatória"),
    referenceId: z.string().optional(),
})

type TransactionFormData = z.infer<typeof transactionSchema>

interface TransactionFormProps {
    transaction?: Transaction
    onSuccess: () => void
    onCancel: () => void
}

const categories = {
    income: ["Serviços", "Produtos", "Comissões", "Outros"],
    expense: ["Aluguel", "Energia", "Água", "Internet", "Material", "Salários", "Marketing", "Manutenção", "Outros"],
}

export function TransactionForm({ transaction, onSuccess, onCancel }: TransactionFormProps) {
    const { createTransaction, updateTransaction } = useFinancial()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: transaction
            ? {
                type: transaction.type,
                amount: transaction.amount.toString(),
                category: transaction.category,
                description: transaction.description,
                date: new Date(transaction.date).toISOString().split("T")[0],
                accountId: "your_account_id",
                referenceId: "your_reference_id",
            }
            : {
                type: "income",
                amount: "",
                category: "",
                description: "",
                date: new Date().toISOString().split("T")[0],
                accountId: "",
                referenceId: "",
            },
    })

    const watchedType = form.watch("type")

    const onSubmit = async (data: TransactionFormData) => {
        setIsLoading(true)
        try {
            const transactionData = {
                accountId: data.accountId,
                type: data.type as "income" | "expense",
                amount: Number.parseFloat(data.amount),
                category: data.category,
                description: data.description,
                date: new Date(data.date),
                referenceId: data.referenceId,
            }

            if (transaction) {
                await updateTransaction(transaction.id, transactionData)
            } else {
                await createTransaction(transactionData)
            }
            onSuccess()
        } catch (error) {
            console.error("Error saving transaction:", error)
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
                                        <SelectItem value="income">Receita</SelectItem>
                                        <SelectItem value="expense">Despesa</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>Tipo da transação</FormDescription>
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
                                <FormDescription>Valor da transação</FormDescription>
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
                                <FormDescription>Categoria da transação</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data *</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormDescription>Data da transação</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="accountId"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Conta Financeira *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Selecione a conta financeira" {...field} />
                                </FormControl>
                                <FormDescription>Conta financeira da transação</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="referenceId"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Referência (Opcional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Referência da transação" {...field} />
                                </FormControl>
                                <FormDescription>Referência da transação (opcional)</FormDescription>
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
                                <Textarea placeholder="Descreva a transação..." className="resize-none" rows={3} {...field} />
                            </FormControl>
                            <FormDescription>Descrição detalhada da transação</FormDescription>
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
                        {transaction ? "Atualizar" : "Criar"} Transação
                    </Button>
                </div>
            </form>
        </Form>
    )
}
