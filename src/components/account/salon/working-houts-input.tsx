"use client"

import { useState } from "react"
import { Info, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { TimeInput } from "@/components/ui/time-input"
import type { TimeValue } from "react-aria-components"
import { TooltipContent } from "@/components/ui/tooltip"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { TooltipProvider } from "@/components/ui/tooltip"

const DAYS_OF_WEEK = [
    { index: 0, name: "Sunday" },
    { index: 1, name: "Monday" },
    { index: 2, name: "Tuesday" },
    { index: 3, name: "Wednesday" },
    { index: 4, name: "Thursday" },
    { index: 5, name: "Friday" },
    { index: 6, name: "Saturday" },
]


interface WorkingHoursInputProps {
    initialWorkingHours: TWorkingHours
    onChange: (workingHours: TWorkingHours) => void
}

export function WorkingHoursInput({ initialWorkingHours, onChange }: WorkingHoursInputProps) {
    const [workingHours, setWorkingHours] = useState<TWorkingHours>(initialWorkingHours)


    const handleToggleDay = (dayId: number) => {
        const newHours = { ...workingHours }
        const isDayActive = workingHours[dayId].from > 0 || workingHours[dayId].to > 0

        newHours[dayId] = isDayActive
            ? { from: 0, to: 0 }
            : { from: 9, to: 17 }

        setWorkingHours(newHours)
        onChange(newHours)
    }

    const handleTimeChange = (dayId: number, timeType: "from" | "to", value: TimeValue | null) => {
        if (!value) return

        const newHours = { ...workingHours }
        const updatedDay = { ...newHours[dayId], [timeType]: value.hour }

        if (timeType === "to" && value.hour === 0 && updatedDay.from === 0) {
            updatedDay.to = 24
        }

        newHours[dayId] = updatedDay
        setWorkingHours(newHours)
        onChange(newHours)
    }



    return (
        <div className="flex flex-col gap-2 max-w-full">
            <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">Working hours</p>

                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger>
                            <Info className="size-3" />
                        </TooltipTrigger>

                        <TooltipContent className="max-w-80 text-center">
                            <p>
                                This will apply a dashed background to the hour cells that fall outside the working hours — only for
                                week and day views.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="space-y-4">
                {DAYS_OF_WEEK.map((day) => {
                    const isDayActive = workingHours[day.index].from > 0 || workingHours[day.index].to > 0

                    return (
                        <div key={day.index} className="flex items-center gap-4">
                            <div className="flex w-40 items-center gap-2">
                                <Switch checked={isDayActive} onCheckedChange={() => handleToggleDay(day.index)} />
                                <span className="text-sm font-medium">{day.name}</span>
                            </div>

                            {isDayActive ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span>From</span>
                                        <TimeInput
                                            id={`${day.name.toLowerCase()}-from`}
                                            hourCycle={12}
                                            granularity="hour"
                                            value={{ hour: workingHours[day.index].from, minute: 0 } as TimeValue}
                                            onChange={(value) => handleTimeChange(day.index, "from", value)}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span>To</span>
                                        <TimeInput
                                            id={`${day.name.toLowerCase()}-to`}
                                            hourCycle={12}
                                            granularity="hour"
                                            value={{ hour: workingHours[day.index].to, minute: 0 } as TimeValue}
                                            onChange={(value) => handleTimeChange(day.index, "to", value)}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Moon className="size-4" />
                                    <span>Closed</span>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
