import { useMemo } from "react";
import { isToday, startOfDay } from "date-fns";

import { ScheduleBullet } from "@/calendar/components/month-view/schedule-bullet";


import type { ICalendarCell, ISchedule } from "@/calendar/interfaces";
import { getMonthCellSchedules } from "@/calendar/helper";
import { cn } from "@/lib/utils";
import { MonthScheduleBadge } from "./mont-schedule-badge";

interface IProps {
    cell: ICalendarCell;
    schedules: ISchedule[];
    schedulePositions: Record<string, number>;
}

const MAX_VISIBLE_SCHEDULES = 3;

export function DayCell({ cell, schedules, schedulePositions }: IProps) {
    const { day, currentMonth, date } = cell;

    const cellSchedules = useMemo(
        () => getMonthCellSchedules(date, schedules, schedulePositions),
        [date, schedules, schedulePositions]
    );

    const isSunday = date.getDay() === 0;

    return (
        <div className={cn("flex flex-col gap-1 border-l border-t py-1.5 lg:py-2", isSunday && "border-l-0")}>
            <span
                className={cn(
                    "h-6 px-1 text-xs font-semibold lg:px-2",
                    !currentMonth && "opacity-20",
                    isToday(date) && "flex w-6 translate-x-1 items-center justify-center rounded-full bg-primary px-0 font-bold text-primary-foreground"
                )}
            >
                {day}
            </span>

            <div className={cn("flex h-6 gap-1 px-2 lg:h-[94px] lg:flex-col lg:gap-2 lg:px-0", !currentMonth && "opacity-50")}>
                {[0, 1, 2].map(position => {
                    const schedule = cellSchedules.find(s => s.position === position);
                    const scheduleKey = schedule ? `schedule-${schedule.id}-${position}` : `empty-${position}`;

                    return (
                        <div key={scheduleKey} className="lg:flex-1">
                            {schedule && (
                                <>
                                    <ScheduleBullet className="lg:hidden" color={schedule.color} />
                                    <MonthScheduleBadge className="hidden lg:flex" schedule={schedule} cellDate={startOfDay(date)} />
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {cellSchedules.length > MAX_VISIBLE_SCHEDULES && (
                <p className={cn("h-4.5 px-1.5 text-xs font-semibold text-muted-foreground", !currentMonth && "opacity-50")}>
                    <span className="sm:hidden">+{cellSchedules.length - MAX_VISIBLE_SCHEDULES}</span>
                    <span className="hidden sm:inline"> {cellSchedules.length - MAX_VISIBLE_SCHEDULES} mais...</span>
                </p>
            )}
        </div>
    );
}