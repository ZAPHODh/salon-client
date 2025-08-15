"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDisclosure } from "@/hooks/use-disclosure"
import { Check, ChevronsUpDown } from "lucide-react"

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { TimeInput } from "@/components/ui/time-input"
import { SingleDayPickerInput } from "@/components/ui/single-day-picker-input"
import { cn, truncateText } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { scheduleSchema } from "@/calendar/schema"
import type { TScheduleFormData } from "@/calendar/schema"
import type { TimeValue } from "react-aria-components"
import { useEffect } from "react"
import { useTranslations } from "next-intl"

import { useCalendar } from "@/calendar/contexts/calendar"
import { useCreateSchedule } from "@/calendar/hooks/use-new-schedule"
import { useCustomer } from "@/components/providers/customer"

interface IProps {
    children: React.ReactNode
    startDate?: Date
    startTime?: { hour: number; minute: number }

}

export function AddScheduleDialog({ children, startDate, startTime }: IProps) {
    const { createSchedule } = useCreateSchedule()
    const { selectedProfessionalId, professionals, services } = useCalendar()
    const { customers } = useCustomer()
    const t = useTranslations("calendar.dialog.add")
    const { isOpen, onClose, onToggle } = useDisclosure()

    const [customerOpen, setCustomerOpen] = useState(false)
    const [professionalOpen, setProfessionalOpen] = useState(false)
    const [serviceOpen, setServiceOpen] = useState(false)

    const form = useForm<TScheduleFormData>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            customerId: "",
            notes: "",
            startDate: startDate ?? new Date(),
            startTime: startTime ?? { hour: 9, minute: 0 },
            endDate: startDate ?? new Date(),
            endTime: startTime ?? { hour: 10, minute: 0 },
            professionalId: selectedProfessionalId || "",
            serviceId: "",
            status: "SCHEDULED",
        },
    })
    const serviceId = form.watch("serviceId")
    const startTimeValue = form.watch("startTime")
    useEffect(() => {
        if (startDate || startTime) {
            form.reset({
                ...form.getValues(),
                startDate: startDate ?? new Date(),
                startTime: startTime ?? { hour: 9, minute: 0 },
                endDate: startDate ?? new Date(),
                endTime: startTime ?? { hour: 10, minute: 0 },
            })
        }
    }, [startDate, startTime, form])
    useEffect(() => {
        if (!serviceId || !startTimeValue) return

        const selectedService = services?.find((s) => s.id === serviceId)
        if (!selectedService || !selectedService.duration) return

        const duration = selectedService.duration
        let newHour = startTimeValue.hour
        let newMinute = startTimeValue.minute + duration

        while (newMinute >= 60) {
            newMinute -= 60
            newHour += 1
        }
        newHour = newHour % 24

        form.setValue("endTime", { hour: newHour, minute: newMinute })
    }, [serviceId, startTimeValue, services, form])

    const onSubmit = async (values: TScheduleFormData) => {
        createSchedule({
            ...values,
            startDate: values.startDate.toISOString(),
            endDate: values.endDate.toISOString(),
        })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onToggle}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                    <DialogDescription>{t("description")}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="customerId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("fields.customer.label")}</FormLabel>
                                    <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={customerOpen}
                                                    className="w-full justify-between"
                                                >
                                                    {field.value
                                                        ? truncateText(customers?.find((customer) => customer.id === field.value)?.name ?? "", 20)
                                                        : t("fields.customer.placeholder")}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar cliente..." />
                                                <CommandList>
                                                    <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                                                    <CommandGroup>
                                                        {customers?.map((customer) => (
                                                            <CommandItem
                                                                key={customer.id}
                                                                value={customer.name}
                                                                onSelect={() => {
                                                                    field.onChange(customer.id)
                                                                    setCustomerOpen(false)
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        field.value === customer.id ? "opacity-100" : "opacity-0",
                                                                    )}
                                                                />
                                                                {customer.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex w-full flex-col md:flex-row gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>{t("fields.startDate.label")}</FormLabel>
                                        <FormControl>
                                            <SingleDayPickerInput
                                                lang="pt-BR"
                                                value={field.value}
                                                onSelect={(date) => field.onChange(date as Date)}
                                                placeholder={t("fields.startDate.placeholder")}
                                                data-invalid={fieldState.invalid}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>{t("fields.endDate.label")}</FormLabel>
                                        <FormControl>
                                            <SingleDayPickerInput
                                                value={field.value}
                                                onSelect={(date) => field.onChange(date as Date)}
                                                placeholder={t("fields.endDate.placeholder")}
                                                data-invalid={fieldState.invalid}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="fflex w-full flex-col md:flex-row gap-4">
                            <FormField

                                control={form.control}
                                name="startTime"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>{t("fields.startTime.label")}</FormLabel>
                                        <FormControl>
                                            <TimeInput value={field.value as TimeValue} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endTime"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>{t("fields.endTime.label")}</FormLabel>
                                        <FormControl>
                                            <TimeInput value={field.value as TimeValue} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex w-full flex-col md:flex-row gap-4">
                            <FormField
                                control={form.control}
                                name="professionalId"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>{t("fields.professional.label")}</FormLabel>
                                        <Popover open={professionalOpen} onOpenChange={setProfessionalOpen}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={professionalOpen}
                                                        className="w-full justify-between"
                                                    >
                                                        {field.value
                                                            ? truncateText(professionals?.find((professional) => professional.id === field.value)?.name ?? "", 20)
                                                            : t("fields.professional.placeholder")}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="Buscar profissional..." />
                                                    <CommandList>
                                                        <CommandEmpty>Nenhum profissional encontrado.</CommandEmpty>
                                                        <CommandGroup>
                                                            {professionals?.map((professional) => (
                                                                <CommandItem
                                                                    key={professional.id}
                                                                    value={professional.name}
                                                                    onSelect={() => {
                                                                        field.onChange(professional.id)
                                                                        setProfessionalOpen(false)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            field.value === professional.id ? "opacity-100" : "opacity-0",
                                                                        )}
                                                                    />
                                                                    {professional.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="serviceId"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>{t("fields.service.label")}</FormLabel>
                                        <Popover open={serviceOpen} onOpenChange={setServiceOpen}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={serviceOpen}
                                                        className="w-full justify-between"
                                                    >
                                                        {field.value
                                                            ? truncateText(services?.find((service) => service.id === field.value)?.name ?? "", 20)
                                                            : t("fields.service.placeholder")}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="Buscar serviço..." />
                                                    <CommandList>
                                                        <CommandEmpty>Nenhum serviço encontrado.</CommandEmpty>
                                                        <CommandGroup>
                                                            {services?.map((service) => (
                                                                <CommandItem
                                                                    key={service.id}
                                                                    value={service.name}
                                                                    onSelect={() => {
                                                                        field.onChange(service.id)
                                                                        setServiceOpen(false)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            field.value === service.id ? "opacity-100" : "opacity-0",
                                                                        )}
                                                                    />
                                                                    {service.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>{t("fields.status.label")}</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col md:flex-row space-y-1"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="SCHEDULED" id="scheduled" />
                                                <label htmlFor="scheduled" className="text-sm font-normal cursor-pointer">
                                                    {t("fields.status.options.scheduled")}
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="COMPLETED" id="completed" />
                                                <label htmlFor="completed" className="text-sm font-normal cursor-pointer">
                                                    {t("fields.status.options.completed")}
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="CANCELLED" id="cancelled" />
                                                <label htmlFor="cancelled" className="text-sm font-normal cursor-pointer">
                                                    {t("fields.status.options.cancelled")}
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="NO_SHOW" id="no-show" />
                                                <label htmlFor="no-show" className="text-sm font-normal cursor-pointer">
                                                    {t("fields.status.options.noShow")}
                                                </label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("fields.description.label")}</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={t("fields.description.placeholder")} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    {t("buttons.cancel")}
                                </Button>
                            </DialogClose>
                            <Button type="submit">{t("buttons.submit")}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
