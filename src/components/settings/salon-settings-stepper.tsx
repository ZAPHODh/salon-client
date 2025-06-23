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
    {
        id: "subscription",
        title: "Plano de Assinatura",
        description: "Escolha seu plano e forma de pagamento",
        icon: CreditCard,
    },
]

const weekDays = [
    { key: 0, label: "Domingo" },
    { key: 1, label: "Segunda-feira" },
    { key: 2, label: "Terça-feira" },
    { key: 3, label: "Quarta-feira" },
    { key: 4, label: "Quinta-feira" },
    { key: 5, label: "Sexta-feira" },
    { key: 6, label: "Sábado" },
]

const subscriptionPlans = [
    {
        id: "free",
        name: "Free",
        description: "Para começar",
        monthlyPrice: 0,
        annualPrice: 0,
        features: ["Até 50 agendamentos/mês", "1 usuário", "Suporte por email", "Funcionalidades básicas"],
    },
    {
        id: "pro",
        name: "Pro",
        description: "Para salões em crescimento",
        monthlyPrice: 49.9,
        annualPrice: 499.9,
        features: [
            "Agendamentos ilimitados",
            "Até 5 usuários",
            "Suporte prioritário",
            "Relatórios avançados",
            "Integração com WhatsApp",
        ],
        popular: true,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        description: "Para grandes salões",
        monthlyPrice: 99.9,
        annualPrice: 999.9,
        features: ["Tudo do Pro", "Usuários ilimitados", "Suporte 24/7", "API personalizada", "Treinamento dedicado"],
    },
]

export default function SalonSettingsStepper() {
    const [currentStep, setCurrentStep] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [animationDirection, setAnimationDirection] = useState<"forward" | "backward">("forward")
    const [isAnnual, setIsAnnual] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState("pro")
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
            const subscription = {
                plan: selectedPlan,
                billing: isAnnual ? "annual" : "monthly",
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

    const formatTime = (hour: number) => {
        return `${hour.toString().padStart(2, "0")}:00`
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

    const resetForm = () => {
        setIsCompleted(false)
        setCurrentStep(0)
        form.reset()
        setActiveDays({
            0: false,
            1: true,
            2: true,
            3: true,
            4: true,
            5: true,
            6: false,
        })
        setSelectedPlan("pro")
        setIsAnnual(false)
    }

    // Success screen
    if (isCompleted) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <Card className="text-center">
                    <CardContent className="pt-6">
                        <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-900 mb-2">Configuração Concluída!</h2>
                        <p className="text-muted-foreground mb-6">
                            Seu salão foi configurado com sucesso e está pronto para receber agendamentos.
                        </p>
                        <div className="space-y-2">
                            <Button onClick={resetForm} variant="outline" className="mr-2">
                                Configurar Outro Salão
                            </Button>
                            <Button onClick={() => (window.location.href = "/dashboard")}>Ir para Dashboard</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
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
                                                                onChange={(e) => {
                                                                    const formatted = formatPostalCode(e.target.value, form.watch("countryCode"))
                                                                    field.onChange(formatted)
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
                                                        <Input placeholder="Rua, número, bairro" {...field} />
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
                                                        <Input placeholder="Nome da cidade" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            )}
                            {currentStep === 1 && (
                                <Card className="transform transition-all duration-300">
                                    <CardHeader>
                                        <CardTitle>Horários de Funcionamento</CardTitle>
                                        <CardDescription>Configure os horários de trabalho do seu salão</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-medium mb-4">Horários Visíveis para Agendamento</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="visibleHours.from"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Início</FormLabel>
                                                            <Select
                                                                onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                                                defaultValue={field.value?.toString()}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
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
                                                            <FormLabel>Fim</FormLabel>
                                                            <Select
                                                                onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                                                defaultValue={field.value?.toString()}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
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

                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <h3 className="text-lg font-medium">Horários de Trabalho por Dia</h3>
                                                <TooltipProvider delayDuration={100}>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Info className="w-4 h-4 text-muted-foreground" />
                                                        </TooltipTrigger>
                                                        <TooltipContent className="max-w-80 text-center">
                                                            <p>Ative apenas os dias em que o salão estará aberto</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>

                                            <div className="space-y-4">
                                                {weekDays.map((day) => (
                                                    <div key={day.key} className="flex items-center gap-4">
                                                        <div className="flex w-40 items-center gap-2">
                                                            <Switch
                                                                checked={activeDays[day.key]}
                                                                onCheckedChange={(checked) => toggleDay(day.key, checked)}
                                                            />
                                                            <span className="text-sm font-medium">{day.label}</span>
                                                        </div>

                                                        {activeDays[day.key] ? (
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm">Das</span>
                                                                    <FormField
                                                                        control={form.control}
                                                                        name={`workingHours.${day.key}.from` as any}
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <Select
                                                                                    onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                                                                    value={field.value?.toString()}
                                                                                >
                                                                                    <FormControl>
                                                                                        <SelectTrigger className="w-20">
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

                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm">às</span>
                                                                    <FormField
                                                                        control={form.control}
                                                                        name={`workingHours.${day.key}.to` as any}
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <Select
                                                                                    onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                                                                    value={field.value?.toString()}
                                                                                >
                                                                                    <FormControl>
                                                                                        <SelectTrigger className="w-20">
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
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <Moon className="w-4 h-4" />
                                                                <span className="text-sm">Fechado</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            {currentStep === 2 && (
                                <Card className="transform transition-all duration-300">
                                    <CardHeader>
                                        <CardTitle>Escolha seu Plano</CardTitle>
                                        <CardDescription>Selecione o plano que melhor atende às suas necessidades</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Billing Toggle */}
                                        <div className="flex items-center justify-center gap-4">
                                            <span className={`text-sm ${!isAnnual ? "font-medium" : "text-muted-foreground"}`}>Mensal</span>
                                            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
                                            <span className={`text-sm ${isAnnual ? "font-medium" : "text-muted-foreground"}`}>Anual</span>
                                            {isAnnual && (
                                                <Badge variant="secondary" className="ml-2">
                                                    2 meses grátis
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {subscriptionPlans.map((plan) => (
                                                <Card
                                                    key={plan.id}
                                                    className={`relative cursor-pointer transition-all ${selectedPlan === plan.id ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
                                                        }`}
                                                    onClick={() => setSelectedPlan(plan.id)}
                                                >
                                                    {plan.popular && (
                                                        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">Mais Popular</Badge>
                                                    )}
                                                    <CardHeader className="text-center">
                                                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                                                        <CardDescription>{plan.description}</CardDescription>
                                                        <div className="mt-4">
                                                            <span className="text-3xl font-bold">
                                                                R$ {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                                                            </span>
                                                            <span className="text-muted-foreground">/{isAnnual ? "ano" : "mês"}</span>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <ul className="space-y-2">
                                                            {plan.features.map((feature, index) => (
                                                                <li key={index} className="flex items-center gap-2 text-sm">
                                                                    <Check className="w-4 h-4 text-primary" />
                                                                    {feature}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </CardContent>
                                                </Card>
                                            ))}
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
        </div>
    )
}
