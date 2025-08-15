"use client"

import type React from "react"
import { useState } from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDisclosure } from "@/hooks/use-disclosure"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { parseISO } from "date-fns"
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
import { useCalendar } from "@/calendar/contexts/calendar"
import type { ISchedule } from "@/calendar/interfaces"
import { useUpdateSchedule } from "@/calendar/hooks/use-update-schedule"

interface IProps {
    children: React.ReactNode
    schedule: ISchedule
}

export function EditScheduleDialog({ children, schedule }: IProps) {
    const { updateSchedule } = useUpdateSchedule()
    const { professionals, services } = useCalendar()
    const t = useTranslations("calendar.dialog.edit")
    const { isOpen, onClose, onToggle } = useDisclosure()

    const [professionalOpen, setProfessionalOpen] = useState(false)
    const [serviceOpen, setServiceOpen] = useState(false)

    const form = useForm<TScheduleFormData>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            customerId: schedule.customer.id,
            notes: schedule.notes,
            startDate: parseISO(schedule.startDate),
            startTime: {
                hour: parseISO(schedule.startDate).getHours(),
                minute: parseISO(schedule.startDate).getMinutes(),
            },
            endDate: parseISO(schedule.endDate),
            endTime: {
                hour: parseISO(schedule.endDate).getHours(),
                minute: parseISO(schedule.endDate).getMinutes(),
            },
            professionalId: schedule.professional.id,
            serviceId: schedule.service.id,
            status: schedule.status || "SCHEDULED",
        },
    })

    useEffect(() => {
        if (schedule) {
            form.reset({
                customerId: schedule.customer.id,
                notes: schedule.notes,
                startDate: parseISO(schedule.startDate),
                startTime: {
                    hour: parseISO(schedule.startDate).getHours(),
                    minute: parseISO(schedule.startDate).getMinutes(),
                },
                endDate: parseISO(schedule.endDate),
                endTime: {
                    hour: parseISO(schedule.endDate).getHours(),
                    minute: parseISO(schedule.endDate).getMinutes(),
                },
                professionalId: schedule.professional.id,
                serviceId: schedule.service.id,
                status: schedule.status || "SCHEDULED",
            })
        }
    }, [schedule, form])

    const onSubmit = async (values: TScheduleFormData) => {
        try {
            updateSchedule({
                ...schedule,
                ...values,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
            })
            toast.success(t("success"))
            onClose()
        } catch (error) {
            toast.error(t("error"))
        }
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
                        <div className="flex flex-col md:flex-row gap-4">
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
                                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col md:flex-row space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="SCHEDULED" id="edit-scheduled" />
                                                <label htmlFor="edit-scheduled" className="text-sm font-normal cursor-pointer">
                                                    {t("fields.status.options.scheduled")}
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="COMPLETED" id="edit-completed" />
                                                <label htmlFor="edit-completed" className="text-sm font-normal cursor-pointer">
                                                    {t("fields.status.options.completed")}
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="CANCELLED" id="edit-cancelled" />
                                                <label htmlFor="edit-cancelled" className="text-sm font-normal cursor-pointer">
                                                    {t("fields.status.options.cancelled")}
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="NO_SHOW" id="edit-no-show" />
                                                <label htmlFor="edit-no-show" className="text-sm font-normal cursor-pointer">
                                                    {t("fields.status.options.noShow")}
                                                </label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-col md:flex-row gap-4">
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

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startTime"
                                render={({ field }) => (
                                    <FormItem>
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
                                    <FormItem>
                                        <FormLabel>{t("fields.endTime.label")}</FormLabel>
                                        <FormControl>
                                            <TimeInput value={field.value as TimeValue} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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
