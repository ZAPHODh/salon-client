import { useMemo } from "react";
import { CalendarX2 } from "lucide-react";
import { parseISO, format, endOfDay, startOfDay, isSameMonth } from "date-fns";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useCalendar } from "@/calendar/contexts/calendar";
import { ISchedule } from "@/calendar/interfaces";
import { AgendaDayGroup } from "./agenda-day-group";

interface IProps {
    singleDaySchedules: ISchedule[];
    multiDaySchedules: ISchedule[];
}

export function CalendarAgendaView({ singleDaySchedules, multiDaySchedules }: IProps) {
    const { selectedDate } = useCalendar();

    const schedulesByDay = useMemo(() => {
        const allDates = new Map<string, { date: Date; schedules: ISchedule[]; multiDaySchedules: ISchedule[] }>();

        singleDaySchedules.forEach(schedule => {
            const scheduleDate = parseISO(schedule.startDate);
            if (!isSameMonth(scheduleDate, selectedDate)) return;

            const dateKey = format(scheduleDate, "yyyy-MM-dd");

            if (!allDates.has(dateKey)) {
                allDates.set(dateKey, {
                    date: startOfDay(scheduleDate),
                    schedules: [],
                    multiDaySchedules: []
                });
            }

            allDates.get(dateKey)?.schedules.push(schedule);
        });

        multiDaySchedules.forEach(schedule => {
            const scheduleStart = parseISO(schedule.startDate);
            const scheduleEnd = parseISO(schedule.endDate);

            let currentDate = startOfDay(scheduleStart);
            const lastDate = endOfDay(scheduleEnd);

            while (currentDate <= lastDate) {
                if (isSameMonth(currentDate, selectedDate)) {
                    const dateKey = format(currentDate, "yyyy-MM-dd");

                    if (!allDates.has(dateKey)) {
                        allDates.set(dateKey, {
                            date: new Date(currentDate),
                            schedules: [],
                            multiDaySchedules: []
                        });
                    }

                    allDates.get(dateKey)?.multiDaySchedules.push(schedule);
                }
                currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
            }
        });

        return Array.from(allDates.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [singleDaySchedules, multiDaySchedules, selectedDate]);

    const hasAnySchedules = singleDaySchedules.length > 0 || multiDaySchedules.length > 0;

    return (
        <div className="h-[800px]">
            <ScrollArea className="h-full" type="always">
                <div className="space-y-6 p-4">
                    {schedulesByDay.map(dayGroup => (
                        <AgendaDayGroup
                            key={format(dayGroup.date, "yyyy-MM-dd")}
                            date={dayGroup.date}
                            schedules={dayGroup.schedules}
                            multiDaySchedules={dayGroup.multiDaySchedules}
                        />
                    ))}

                    {!hasAnySchedules && (
                        <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground">
                            <CalendarX2 className="size-10" />
                            <p className="text-sm md:text-base">No schedules planned for the selected month</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}