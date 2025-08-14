"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { VisibleHoursInput } from "./visible-hours-input"
import { useState } from "react"
import { PostalCodeInput, type AddressData } from "@/components/ui/postal-code-input"
import { useTranslations } from "next-intl"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { salonConfigSchema, SalonFormValues } from "@/schemas/salon"
import { WorkingHoursInput } from "./working-houts-input"
import { useOnborda } from "onborda"

import { useEffect } from "react"
import Cookies from "js-cookie"
import { countries, defaultVisibleHours, defaultWorkingHours } from "@/lib/helper"
import { updateSalon } from "@/requests/update-salon"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Moon } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { formatTime } from "@/lib/utils"
import { weekDays } from "@/components/settings/salon-settings-stepper"

interface SalonConfigProps {
    initialData?: {
        name?: string
        address?: string
        city?: string
        cep?: string
        workingHours?: TWorkingHours
        visibleHours?: TVisibleHours
        countryCode?: string
    }
}

export interface SalonConfigData {
    name: string
    address: string
    city?: string
    cep: string
    workingHours: TWorkingHours
    visibleHours: TVisibleHours
    countryCode: string
}



export function SalonConfigForm({ initialData }: SalonConfigProps) {
    const { startOnborda } = useOnborda();
    const { refresh } = useRouter()
    const t = useTranslations("salon.config")
    const tPostal = useTranslations("postalCode")
    const tAddress = useTranslations("address")

    const [isSubmitting, setIsSubmitting] = useState(false)

    const [activeDays, setActiveDays] = useState<Record<number, boolean>>({
        0: false,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: false,
    })
    const [countryCode, setCountryCode] = useState<string>(initialData?.countryCode || "BR")
    const form = useForm<SalonFormValues>({
        resolver: zodResolver(salonConfigSchema),
        defaultValues: {
            name: initialData?.name || "",
            address: initialData?.address || "",
            city: initialData?.city || "",
            countryCode: initialData?.countryCode || "BR",
            cep: initialData?.cep || "",
            workingHours: initialData?.workingHours || defaultWorkingHours,
            visibleHours: initialData?.visibleHours || defaultVisibleHours,
        },
    })


    const handleAddressFound = (addressData: AddressData) => {
        if (addressData.city) {
            form.setValue("city", addressData.city)
        }
        if (addressData.street) {
            form.setValue("address", addressData.street)
            if (addressData.neighborhood) {
                form.setValue("address", `${addressData.street}, ${addressData.neighborhood}`)
            }
        }
        toast.success(tPostal("lookupSuccess"), {
            description: addressData.street || addressData.city,
        })
    }


    const handleCountryChange = (value: string) => {
        setCountryCode(value)

        form.setValue("cep", "")
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
        form.setValue('workingHours', workingHours)
    }
    async function handleSubmit(data: SalonFormValues) {
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
            const updatedSalon = await updateSalon((initialData as any).id as string, finalData)
            if (!updatedSalon) {
                throw new Error(t("toast.error"))
            }
            toast.success(t("toast.success"),)
            refresh()
        } catch (error) {
            toast.error(t("toast.error"))
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        const hasSeenTour = Cookies.get("salonConfigTourShown")
        if (!hasSeenTour) {
            startOnborda('salonConfig')
            Cookies.set("salonConfigTourShown", "true", { expires: 365 })
        }
    }, [startOnborda])

    return (
        <div className="space-y-6" id="salonConfig">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 p-4 " id="salon-config-card">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">{t("sections.basicInfo")}</h3>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem id="salon-name-input">
                                    <FormLabel>{t("fields.name.label")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t("fields.name.placeholder")} {...field} />
                                    </FormControl>
                                    <FormDescription>{t("fields.name.description")}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-4">
                            <div id="country-select">
                                <label className="text-sm font-medium">{tAddress("country")}</label>
                                <Select value={countryCode} onValueChange={handleCountryChange}>
                                    <SelectTrigger className="mt-1 w-full">
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem key={country.code} value={country.code}>
                                                {country.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <FormField
                                control={form.control}
                                name="cep"
                                render={({ field }) => (
                                    <FormItem id="postal-code-input">
                                        <FormLabel>{tPostal("label")}</FormLabel>
                                        <FormControl>
                                            <PostalCodeInput
                                                countryCode={countryCode}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                                onAddressFound={handleAddressFound}
                                            />
                                        </FormControl>
                                        <FormDescription>{tPostal(`description.${countryCode.toLowerCase()}`)}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("fields.address.label")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t("fields.address.placeholder")} {...field} />
                                        </FormControl>
                                        <FormDescription>{t("fields.address.description")}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{tAddress("city")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={tAddress("city")} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-6" id="working-hours-section">
                        <h3 className="text-lg font-medium">{t("sections.hoursConfig")}</h3>
                        <div className="space-y-6">
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

                        </div>
                    </div>
                    <Button type="submit" disabled={isSubmitting} id="save-config-button" className="w-full md:w-[300px]">
                        {isSubmitting ? t("buttons.saving") : t("buttons.save")}
                    </Button>
                </form>
            </Form>
        </div>
    )
}