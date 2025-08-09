"use client"

import { useState, useEffect } from "react"
import { Info } from "lucide-react"
import { TimeInput } from "@/components/ui/time-input"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import type { TimeValue } from "react-aria-components"

interface VisibleHoursInputProps {
    initialVisibleHours: TVisibleHours
    onChange: (visibleHours: TVisibleHours) => void
}

export function VisibleHoursInput({ initialVisibleHours, onChange }: VisibleHoursInputProps) {
    const [from, setFrom] = useState<{ hour: number; minute: number }>({
        hour: initialVisibleHours.from,
        minute: 0,
    })

    const [to, setTo] = useState<{ hour: number; minute: number }>({
        hour: initialVisibleHours.to === 24 ? 0 : initialVisibleHours.to,
        minute: 0,
    })

    // Sincroniza com as props iniciais
    useEffect(() => {
        setFrom({ hour: initialVisibleHours.from, minute: 0 })
        setTo({ hour: initialVisibleHours.to === 24 ? 0 : initialVisibleHours.to, minute: 0 })
    }, [initialVisibleHours])

    const handleTimeChange = (type: "from" | "to", value: TimeValue | null) => {
        if (!value) return

        const newHour = value.hour
        const adjustedTo = type === "to" ? (newHour === 0 ? 24 : newHour) : to.hour === 0 ? 24 : to.hour

        if (type === "from") {
            setFrom(value)
            onChange({ from: newHour, to: adjustedTo })
        } else {
            setTo(value)
            onChange({ from: from.hour, to: adjustedTo })
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">Horas visíveis</p>

                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger>
                            <Info className="size-3" />
                        </TooltipTrigger>

                        <TooltipContent className="max-w-80 text-center">
                            <p>
                                Se um evento ocorrer fora do horário visível especificado, o horário visível
                                será ajustado automaticamente para incluir esse evento.

                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="flex items-center gap-4">
                <p>De</p>
                <TimeInput
                    id="start-time"
                    hourCycle={12}
                    granularity="hour"
                    value={from as TimeValue}
                    onChange={(value) => handleTimeChange("from", value)}
                />
                <p>Para</p>
                <TimeInput
                    id="end-time"
                    hourCycle={12}
                    granularity="hour"
                    value={to as TimeValue}
                    onChange={(value) => handleTimeChange("to", value)}
                />
            </div>
        </div>
    )
}