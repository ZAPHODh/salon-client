import { differenceInDays, format, parseISO, startOfDay } from "date-fns";



import type { ISchedule } from "@/calendar/interfaces";
import { AgendaScheduleCard } from "./agenda-schedule-card";

interface IProps {
    date: Date;
    schedules: ISchedule[];
    multiDaySchedules: ISchedule[];
}

export function AgendaDayGroup({ date, schedules, multiDaySchedules }: IProps) {
    const sortedSchedules = [...schedules].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    return (
        <div className="space-y-4">
            <div className="sticky top-0 flex items-center gap-4 bg-background py-2">
                <p className="text-sm font-semibold">{format(date, "EEEE, MMMM d, yyyy")}</p>
            </div>

            <div className="space-y-2">
                {multiDaySchedules.length > 0 &&
                    multiDaySchedules.map(schedule => {
                        const scheduleStart = startOfDay(parseISO(schedule.startDate));
                        const scheduleEnd = startOfDay(parseISO(schedule.endDate));
                        const currentDate = startOfDay(date);

                        const scheduleTotalDays = differenceInDays(scheduleEnd, scheduleStart) + 1;
                        const scheduleCurrentDay = differenceInDays(currentDate, scheduleStart) + 1;
                        return (
                            <AgendaScheduleCard
                                key={schedule.id}
                                schedule={schedule}
                                currentDay={scheduleCurrentDay}
                                totalDays={scheduleTotalDays}
                            />
                        );
                    })}

                {sortedSchedules.length > 0 && sortedSchedules.map(schedule => (
                    <AgendaScheduleCard key={schedule.id} schedule={schedule} />
                ))}
            </div>
        </div>
    );
}