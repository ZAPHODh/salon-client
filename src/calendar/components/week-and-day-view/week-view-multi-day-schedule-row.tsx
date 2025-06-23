import { useMemo } from "react";
import { parseISO, startOfDay, startOfWeek, endOfWeek, addDays, differenceInDays, isBefore, isAfter } from "date-fns";



import type { ISchedule } from "@/calendar/interfaces";
import { MonthScheduleBadge } from "../month-view/mont-schedule-badge";

interface IProps {
    selectedDate: Date;
    multiDaySchedules: ISchedule[];
}

export function WeekViewMultiDaySchedulesRow({ selectedDate, multiDaySchedules }: IProps) {
    const weekStart = startOfWeek(selectedDate);
    const weekEnd = endOfWeek(selectedDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    const processedSchedules = useMemo(() => {
        return multiDaySchedules
            .map(schedule => {
                const start = parseISO(schedule.startDate);
                const end = parseISO(schedule.endDate);
                const adjustedStart = isBefore(start, weekStart) ? weekStart : start;
                const adjustedEnd = isAfter(end, weekEnd) ? weekEnd : end;
                const startIndex = differenceInDays(adjustedStart, weekStart);
                const endIndex = differenceInDays(adjustedEnd, weekStart);

                return {
                    ...schedule,
                    adjustedStart,
                    adjustedEnd,
                    startIndex,
                    endIndex,
                };
            })
            .sort((a, b) => {
                const startDiff = a.adjustedStart.getTime() - b.adjustedStart.getTime();
                if (startDiff !== 0) return startDiff;
                return b.endIndex - b.startIndex - (a.endIndex - a.startIndex);
            });
    }, [multiDaySchedules, weekStart, weekEnd]);

    const scheduleRows = useMemo(() => {
        const rows: (typeof processedSchedules)[] = [];

        processedSchedules.forEach(schedule => {
            let rowIndex = rows.findIndex(row => row.every(s => s.endIndex < schedule.startIndex || s.startIndex > schedule.endIndex));

            if (rowIndex === -1) {
                rowIndex = rows.length;
                rows.push([]);
            }

            rows[rowIndex].push(schedule);
        });

        return rows;
    }, [processedSchedules]);

    const hasSchedulesInWeek = useMemo(() => {
        return multiDaySchedules.some(schedule => {
            const start = parseISO(schedule.startDate);
            const end = parseISO(schedule.endDate);

            return (
                (start >= weekStart && start <= weekEnd) ||
                (end >= weekStart && end <= weekEnd) ||
                (start <= weekStart && end >= weekEnd)
            );
        });
    }, [multiDaySchedules, weekStart, weekEnd]);

    if (!hasSchedulesInWeek) {
        return null;
    }

    return (
        <div className="hidden overflow-hidden sm:flex">
            <div className="w-18 border-b"></div>
            <div className="grid flex-1 grid-cols-7 divide-x border-b border-l">
                {weekDays.map((day, dayIndex) => (
                    <div key={day.toISOString()} className="flex h-full flex-col gap-1 py-1">
                        {scheduleRows.map((row, rowIndex) => {
                            const schedule = row.find(s => s.startIndex <= dayIndex && s.endIndex >= dayIndex);

                            if (!schedule) {
                                return <div key={`${rowIndex}-${dayIndex}`} className="h-6.5" />;
                            }

                            let position: "first" | "middle" | "last" | "none" = "none";

                            if (dayIndex === schedule.startIndex && dayIndex === schedule.endIndex) {
                                position = "none";
                            } else if (dayIndex === schedule.startIndex) {
                                position = "first";
                            } else if (dayIndex === schedule.endIndex) {
                                position = "last";
                            } else {
                                position = "middle";
                            }

                            return <MonthScheduleBadge key={`${schedule.id}-${dayIndex}`} schedule={schedule} cellDate={startOfDay(day)} position={position} />;
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}