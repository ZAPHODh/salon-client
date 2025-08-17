"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronLeft, ChevronRight, Clock, MapPin, CreditCard, Info, Moon, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatPostalCode, salonConfigSchema, type SalonFormValues } from "@/schemas/salon"
import { toast } from "sonner"
import { createSalon } from "@/requests/create-salon"
import { redirect } from "@/i18n/navigation"
import { useLocale } from "next-intl"
import { formatTime } from "@/lib/utils"
import { useCep } from "@/hooks/use-cep"

const steps = [
    {
        id: "salon",
        title: "Configuração do Salão",
        description: "Informações básicas do seu salão",
        icon: MapPin,
    },
    {
        id: "hours",
        title: "Horários de Funcionamento",
        description: "Configure os horários de trabalho",
        icon: Clock,
    },
]

export const weekDays = [
    { key: 0, label: "Domingo" },
    { key: 1, label: "Segunda-feira" },
    { key: 2, label: "Terça-feira" },
    { key: 3, label: "Quarta-feira" },
    { key: 4, label: "Quinta-feira" },
    { key: 5, label: "Sexta-feira" },
    { key: 6, label: "Sábado" },
]

export default function SalonSettingsStepper() {
    const locale = useLocale()

    const [currentStep, setCurrentStep] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [animationDirection, setAnimationDirection] = useState<"forward" | "backward">("forward")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)

    const [activeDays, setActiveDays] = useState<Record<number, boolean>>({
        0: false,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: false,
    })
    const { fetchAddress, error, isLoading } = useCep()
    const form = useForm<SalonFormValues>({
        resolver: zodResolver(salonConfigSchema),
        defaultValues: {
            name: "",
            address: "",
            city: "",
            countryCode: "BR",
            cep: "",
            workingHours: {
                0: { from: 0, to: 0 },
                1: { from: 9, to: 18 },
                2: { from: 9, to: 18 },
                3: { from: 9, to: 18 },
                4: { from: 9, to: 18 },
                5: { from: 9, to: 18 },
                6: { from: 0, to: 0 },
            },
            visibleHours: {
                from: 8,
                to: 20,
            },
        },
    })

    const nextStep = async () => {
        if (currentStep < steps.length - 1) {
            let fieldsToValidate: string[] = []

            if (currentStep === 0) {
                fieldsToValidate = ["name", "address", "countryCode", "cep"]
            } else if (currentStep === 1) {
                fieldsToValidate = ["visibleHours"]

                const workingHours = form.getValues("workingHours")
                const updatedWorkingHours = { ...workingHours }

                for (const dayKey in activeDays) {
                    const dayIndex = Number(dayKey)
                    if (!activeDays[dayIndex]) {
                        updatedWorkingHours[dayIndex] = { from: 0, to: 0 }
                    }
                }

                form.setValue("workingHours", updatedWorkingHours)
            }

            const result = await form.trigger(fieldsToValidate as any)

            let workingHoursValid = true
            if (currentStep === 1) {
                const workingHours = form.getValues("workingHours")

                for (const dayKey in activeDays) {
                    const dayIndex = Number(dayKey)
                    if (activeDays[dayIndex]) {
                        const day = workingHours[dayIndex]
                        if (day.to <= day.from && day.from > 0) {
                            workingHoursValid = false
                            form.setError(`workingHours.${dayIndex}.to` as any, {
                                type: "manual",
                                message: "Horário de término deve ser maior que o de início",
                            })
                        }
                    }
                }
            }

            if (result && (currentStep !== 1 || workingHoursValid)) {
                setIsTransitioning(true)
                setAnimationDirection("forward")

                setTimeout(() => {
                    setCurrentStep(currentStep + 1)
                    setTimeout(() => {
                        setIsTransitioning(false)
                    }, 50)
                }, 150)
            } else {
                toast.error("Erro de validação", {
                    description: "Por favor, corrija os erros no formulário antes de continuar.",
                })
            }
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setIsTransitioning(true)
            setAnimationDirection("backward")

            setTimeout(() => {
                setCurrentStep(currentStep - 1)
                setTimeout(() => {
                    setIsTransitioning(false)
                }, 50)
            }, 150)
        }
    }

    const onSubmit = async (data: SalonFormValues) => {
        setIsSubmitting(true)

        try {
            const cleanedWorkingHours = { ...data.workingHours }

            for (const dayKey in activeDays) {
                const dayIndex = Number(dayKey)
                if (!activeDays[dayIndex]) {
                    cleanedWorkingHours[dayIndex] = { from: 0, to: 0 }
                }
            }
            const finalData = {
                ...data,
                workingHours: cleanedWorkingHours,
            }

            const newSalon = await createSalon(finalData)
            if (!newSalon) {
                throw new Error("Failed to create salon")
            }
            toast.success("Configuração salva com sucesso!", {
                description: "Seu salão foi configurado e está pronto para uso.",
            })

            setIsCompleted(true)

        } catch (error) {
            console.error("Error submitting form:", error)
            toast.error("Erro ao salvar configuração", {
                description: "Ocorreu um erro ao salvar as configurações. Tente novamente.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }



    const toggleDay = (dayIndex: number, isActive: boolean) => {
        setActiveDays((prev) => ({
            ...prev,
            [dayIndex]: isActive,
        }))

        const workingHours = { ...form.getValues("workingHours") }
        if (isActive) {
            workingHours[dayIndex] = { from: 9, to: 18 }
        } else {
            workingHours[dayIndex] = { from: 0, to: 0 }
        }
        form.setValue("workingHours", workingHours)
    }

    if (isCompleted) {
        toast.success('Configuração Concluída!', {
            description: 'Seu salão foi configurado com sucesso e está pronto para receber agendamentos.'
        })
        redirect({ href: '/account/billing', locale })
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <div className="flex flex-col md:flex-row items-center md:justify-between">
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        const isActive = index === currentStep
                        const isCompleted = index < currentStep

                        return (
                            <div key={step.id} className="flex items-center mb-4 md:mb-0">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full border-2 ${isCompleted
                                            ? "bg-primary border-primary text-primary-foreground"
                                            : isActive
                                                ? "border-primary text-primary"
                                                : "border-muted-foreground text-muted-foreground"
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <Check className="w-5 h-5 md:w-6 md:h-6" />
                                        ) : (
                                            <Icon className="w-5 h-5 md:w-6 md:h-6" />
                                        )}
                                    </div>
                                    <div className="mt-2 text-center">
                                        <p className={`text-sm md:font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                                            {step.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{step.description}</p>
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`hidden md:block w-24 h-0.5 mx-4 ${isCompleted ? "bg-primary" : "bg-muted"}`} />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="relative overflow-hidden">
                        <div
                            className={`transition-all duration-300 ease-in-out ${isTransitioning
                                ? animationDirection === "forward"
                                    ? "-translate-x-full opacity-0"
                                    : "translate-x-full opacity-0"
                                : "translate-x-0 opacity-100"
                                }`}
                        >
                            {currentStep === 0 && (
                                <Card className="transform transition-all duration-300">
                                    <CardHeader>
                                        <CardTitle>Informações do Salão</CardTitle>
                                        <CardDescription>Preencha as informações básicas do seu salão</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nome do Salão</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ex: Salão Beleza & Estilo" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="countryCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>País</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Selecione o país" className="w-full" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="BR">Brasil</SelectItem>
                                                                <SelectItem value="US">Estados Unidos</SelectItem>
                                                                <SelectItem value="UK">Reino Unido</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="cep"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>CEP</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="00000-000"
                                                                {...field}
                                                                disabled={isLoading}
                                                                onChange={(e) => {
                                                                    const formatted = formatPostalCode(e.target.value, form.watch("countryCode"))
                                                                    field.onChange(formatted)
                                                                }}
                                                                onBlur={async () => {
                                                                    const cepValue = form.getValues("cep")
                                                                    const addressData = await fetchAddress(cepValue)

                                                                    if (addressData) {
                                                                        form.setValue("address", `${addressData.street} - ${addressData.neighborhood}`)
                                                                        form.setValue("city", `${addressData.city}/${addressData.state}`)
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
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
                                                        <Input disabled={!error} placeholder="Rua, número, bairro" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Cidade</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={!error} placeholder="Nome da cidade" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            )}
                            {currentStep === 1 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="hidden sm:block">Horários de Funcionamento</CardTitle>
                                        <CardDescription className="hidden sm:block">
                                            Configure os horários de trabalho do seu salão
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="p-4 rounded-lg space-y-4">
                                            <div>
                                                <h3 className="text-lg font-semibold mb-1">Horários Visíveis</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Intervalo que aparecerá no agendamento
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="visibleHours.from"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm font-medium">Horário inicial</FormLabel>
                                                            <Select
                                                                onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                                                defaultValue={field.value?.toString()}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger className="h-11">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {Array.from({ length: 24 }, (_, i) => (
                                                                        <SelectItem key={i} value={i.toString()}>
                                                                            {formatTime(i)}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="visibleHours.to"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm font-medium">Horário final</FormLabel>
                                                            <Select
                                                                onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                                                defaultValue={field.value?.toString()}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger className="h-11">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {Array.from({ length: 24 }, (_, i) => (
                                                                        <SelectItem key={i} value={i.toString()}>
                                                                            {formatTime(i)}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-4">
                                                <h3 className="text-lg font-semibold">Dias de Funcionamento</h3>
                                                <TooltipProvider delayDuration={100}>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Info className="w-4 h-4 text-muted-foreground" />
                                                        </TooltipTrigger>
                                                        <TooltipContent className="max-w-80 text-center">
                                                            <p>Ative os dias e configure os horários de funcionamento</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>

                                            <div className="space-y-3">
                                                {weekDays.map((day) => (
                                                    <div
                                                        key={day.key}
                                                        className={`border rounded-lg p-4 transition-all ${activeDays[day.key]
                                                            ? 'border-primary/20 bg-primary/5'
                                                            : 'border-border bg-background'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <Switch
                                                                    checked={activeDays[day.key]}
                                                                    onCheckedChange={(checked) => toggleDay(day.key, checked)}
                                                                />
                                                                <div>
                                                                    <span className="font-medium">
                                                                        <span className="sm:hidden">{day.label}</span>
                                                                        <span className="hidden sm:inline">{day.label}</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {!activeDays[day.key] && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    <Moon className="w-3 h-3 mr-1" />
                                                                    Fechado
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        {activeDays[day.key] && (
                                                            <div className="space-y-3 pl-0 sm:pl-8">
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                    <FormField
                                                                        control={form.control}
                                                                        name={`workingHours.${day.key}.from` as any}
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel className="text-xs text-muted-foreground uppercase tracking-wide">
                                                                                    Abertura
                                                                                </FormLabel>
                                                                                <Select
                                                                                    onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                                                                    value={field.value?.toString()}
                                                                                >
                                                                                    <FormControl>
                                                                                        <SelectTrigger className="h-10">
                                                                                            <SelectValue />
                                                                                        </SelectTrigger>
                                                                                    </FormControl>
                                                                                    <SelectContent>
                                                                                        {Array.from({ length: 24 }, (_, i) => (
                                                                                            <SelectItem key={i} value={i.toString()}>
                                                                                                {formatTime(i)}
                                                                                            </SelectItem>
                                                                                        ))}
                                                                                    </SelectContent>
                                                                                </Select>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                    <FormField
                                                                        control={form.control}
                                                                        name={`workingHours.${day.key}.to` as any}
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel className="text-xs text-muted-foreground uppercase tracking-wide">
                                                                                    Fechamento
                                                                                </FormLabel>
                                                                                <Select
                                                                                    onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                                                                    value={field.value?.toString()}
                                                                                >
                                                                                    <FormControl>
                                                                                        <SelectTrigger className="h-10">
                                                                                            <SelectValue />
                                                                                        </SelectTrigger>
                                                                                    </FormControl>
                                                                                    <SelectContent>
                                                                                        {Array.from({ length: 25 }, (_, i) => (
                                                                                            <SelectItem key={i} value={i.toString()}>
                                                                                                {i === 24 ? "00:00" : formatTime(i)}
                                                                                            </SelectItem>
                                                                                        ))}
                                                                                    </SelectContent>
                                                                                </Select>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                                <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded">
                                                                    Funcionamento: {formatTime(form.watch(`workingHours.${day.key}.from`) || 0)} às {' '}
                                                                    {form.watch(`workingHours.${day.key}.to`) === 24
                                                                        ? "00:00"
                                                                        : formatTime(form.watch(`workingHours.${day.key}.to`) || 0)
                                                                    }
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex flex-wrap gap-2 pt-4 border-t">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const weekdays = [1, 2, 3, 4, 5];
                                                        weekdays.forEach(day => toggleDay(day, true));
                                                    }}
                                                >
                                                    Seg-Sex (9h-18h)
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        weekDays.forEach(day => toggleDay(day.key, false));
                                                    }}
                                                >
                                                    Limpar Tudo
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        [1, 2, 3, 4, 5, 6].forEach(day => toggleDay(day, true));
                                                    }}
                                                >
                                                    Seg-Sáb
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between mt-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 0 || isTransitioning || isSubmitting}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Anterior
                        </Button>

                        {currentStep < steps.length - 1 ? (
                            <Button type="button" onClick={nextStep} disabled={isTransitioning || isSubmitting}>
                                {isTransitioning ? (
                                    <>
                                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Carregando...
                                    </>
                                ) : (
                                    <>
                                        Próximo
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isTransitioning || isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Salvando...
                                    </>
                                ) : (
                                    "Finalizar Configuração"
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div >
    )
}
