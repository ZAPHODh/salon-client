import { parseISO, isWithinInterval, differenceInDays, startOfDay, endOfDay } from "date-fns";



import type { ISchedule } from "@/calendar/interfaces";
import { MonthScheduleBadge } from "../month-view/mont-schedule-badge";

interface IProps {
    selectedDate: Date;
    multiDaySchedules: ISchedule[];
}

export function DayViewMultiDaySchedulesRow({ selectedDate, multiDaySchedules }: IProps) {
    const dayStart = startOfDay(selectedDate);
    const dayEnd = endOfDay(selectedDate);

    const multiDaySchedulesInDay = multiDaySchedules
        .filter(schedule => {
            const scheduleStart = parseISO(schedule.startDate);
            const scheduleEnd = parseISO(schedule.endDate);

            const isOverlapping =
                isWithinInterval(dayStart, { start: scheduleStart, end: scheduleEnd }) ||
                isWithinInterval(dayEnd, { start: scheduleStart, end: scheduleEnd }) ||
                (scheduleStart <= dayStart && scheduleEnd >= dayEnd);

            return isOverlapping;
        })
        .sort((a, b) => {
            const durationA = differenceInDays(parseISO(a.endDate), parseISO(a.startDate));
            const durationB = differenceInDays(parseISO(b.endDate), parseISO(b.startDate));
            return durationB - durationA;
        });

    if (multiDaySchedulesInDay.length === 0) return null;

    return (
        <div className="flex border-b">
            <div className="w-18"></div>
            <div className="flex flex-1 flex-col gap-1 border-l py-1">
                {multiDaySchedulesInDay.map(schedule => {
                    const scheduleStart = startOfDay(parseISO(schedule.startDate));
                    const scheduleEnd = startOfDay(parseISO(schedule.endDate));
                    const currentDate = startOfDay(selectedDate);

                    const totalDays = differenceInDays(scheduleEnd, scheduleStart) + 1;
                    const currentDay = differenceInDays(currentDate, scheduleStart) + 1;

                    return (
                        <MonthScheduleBadge
                            key={schedule.id}
                            schedule={schedule}
                            cellDate={selectedDate}
                            currentDay={currentDay}
                            totalDays={totalDays}
                        />
                    );
                })}
            </div>
        </div>
    );
}