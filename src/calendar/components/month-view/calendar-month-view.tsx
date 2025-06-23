import { useMemo } from "react";

import type { ISchedule } from "@/calendar/interfaces";
import { useCalendar } from "@/calendar/contexts/calendar";
import { calculateMonthSchedulePositions, getCalendarCells } from "@/calendar/helper";
import { DayCell } from "./day-cell";
import { useTranslations } from "next-intl";

interface IProps {
    singleDaySchedules: ISchedule[];
    multiDaySchedules: ISchedule[];
}


const WEEK_DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

export function CalendarMonthView({ singleDaySchedules, multiDaySchedules }: IProps) {
    const t = useTranslations('calendar.weekDays');

    const WEEK_DAYS = WEEK_DAY_KEYS.map(key => t(key));
    const { selectedDate } = useCalendar();

    const allSchedules = [...multiDaySchedules, ...singleDaySchedules];

    const cells = useMemo(() => getCalendarCells(selectedDate), [selectedDate]);
    const schedulePositions = useMemo(
        () => calculateMonthSchedulePositions(multiDaySchedules, singleDaySchedules, selectedDate),
        [multiDaySchedules, singleDaySchedules, selectedDate]
    );

    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-7 divide-x divide-y bg-muted/50">
                {WEEK_DAYS.map(day => (
                    <div key={day} className="flex items-center justify-center py-2">
                        <span className="text-xs font-medium text-muted-foreground">{day}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 grid-rows-6 divide-x divide-y">
                {cells.map(cell => (
                    <DayCell
                        key={cell.date.toISOString()}
                        cell={cell}
                        schedules={allSchedules}
                        schedulePositions={schedulePositions}
                    />
                ))}
            </div>
        </div>
    );
}