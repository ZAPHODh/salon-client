"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface CalendarDateRangePickerProps {
    className?: string
    date?: DateRange
    onDateChange?: (date: DateRange | undefined) => void
}

export function CalendarDateRangePicker({ className, date, onDateChange }: CalendarDateRangePickerProps) {
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
        date || {
            from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            to: new Date(),
        },
    )

    const handleDateChange = (newDate: DateRange | undefined) => {
        setDateRange(newDate)
        onDateChange?.(newDate)
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn("w-[300px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                    {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                                    {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                                </>
                            ) : (
                                format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                            )
                        ) : (
                            <span>Selecione o período</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={handleDateChange}
                        numberOfMonths={2}
                        locale={ptBR}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
