import {
    addDays,
    addMonths,
    addWeeks,
    subDays,
    subMonths,
    subWeeks,
    isSameWeek,
    isSameDay,
    isSameMonth,
    startOfWeek,
    startOfMonth,
    endOfMonth,
    endOfWeek,
    format,
    parseISO,
    differenceInMinutes,
    eachDayOfInterval,
    startOfDay,
    startOfYear,
    endOfYear,
    differenceInDays,
    Locale,
    addYears,
    subYears,
    isSameYear,
    isWithinInterval
} from "date-fns";

import type { ICalendarCell, ISchedule } from "@/calendar/interfaces";

// ================ Header helper functions ================ //

export function rangeText(view: TCalendarView, date: Date, locale?: Locale) {
    const formatString = "dd MMM yyyy";
    let start: Date;
    let end: Date;

    switch (view) {
        case "agenda":
            start = startOfMonth(date);
            end = endOfMonth(date);
            break;
        case "year":
            start = startOfYear(date);
            end = endOfYear(date);
            break;

        case "month":
            start = startOfMonth(date);
            end = endOfMonth(date);
            break;
        case "week":
            start = startOfWeek(date);
            end = endOfWeek(date);
            break;
        case "day":
            return format(date, formatString, { locale });
        default:
            return "Error while formatting ";
    }

    return `${format(start, formatString, { locale })} - ${format(end, formatString, { locale })}`;
}

export function navigateDate(date: Date, view: TCalendarView, direction: "previous" | "next"): Date {
    const operations = {
        agenda: direction === "next" ? addMonths : subMonths,
        year: direction === "next" ? addYears : subYears,
        month: direction === "next" ? addMonths : subMonths,
        week: direction === "next" ? addWeeks : subWeeks,
        day: direction === "next" ? addDays : subDays,
    };

    return operations[view](date, 1);
}

export function getSchedulesCount(schedules: ISchedule[], date: Date, view: TCalendarView): number {
    const compareFns = {
        agenda: isSameMonth,
        year: isSameYear,
        day: isSameDay,
        week: isSameWeek,
        month: isSameMonth,
    };

    return schedules.filter(schedule => compareFns[view](new Date(schedule.startDate), date)).length;
}

// ================ Week and day view helper functions ================ //
export function getCurrentSchedules(schedules: ISchedule[]) {
    const now = new Date();
    return schedules.filter(schedule => isWithinInterval(now, { start: parseISO(schedule.startDate), end: parseISO(schedule.endDate) })) || null;
}


export function groupSchedules(daySchedules: ISchedule[]) {
    const sortedSchedules = daySchedules.sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime());
    const groups: ISchedule[][] = [];

    for (const schedule of sortedSchedules) {
        const scheduleStart = parseISO(schedule.startDate);

        let placed = false;
        for (const group of groups) {
            const lastScheduleInGroup = group[group.length - 1];
            const lastScheduleEnd = parseISO(lastScheduleInGroup.endDate);

            if (scheduleStart >= lastScheduleEnd) {
                group.push(schedule);
                placed = true;
                break;
            }
        }

        if (!placed) groups.push([schedule]);
    }

    return groups;
}

export function getScheduleBlockStyle(schedule: ISchedule, day: Date, groupIndex: number, groupSize: number, visibleHoursRange?: { from: number; to: number }) {
    const startDate = parseISO(schedule.startDate);
    const dayStart = new Date(day.setHours(0, 0, 0, 0));
    const scheduleStart = startDate < dayStart ? dayStart : startDate;
    const startMinutes = differenceInMinutes(scheduleStart, dayStart);

    let top;

    if (visibleHoursRange) {
        const visibleStartMinutes = visibleHoursRange.from * 60;
        const visibleEndMinutes = visibleHoursRange.to * 60;
        const visibleRangeMinutes = visibleEndMinutes - visibleStartMinutes;
        top = ((startMinutes - visibleStartMinutes) / visibleRangeMinutes) * 100;
    } else {
        top = (startMinutes / 1440) * 100;
    }

    const width = 100 / groupSize;
    const left = groupIndex * width;

    return { top: `${top}%`, width: `${width}%`, left: `${left}%` };
}

export function isWorkingHour(day: Date, hour: number, workingHours: TWorkingHours) {
    const dayIndex = day.getDay() as keyof typeof workingHours;
    const dayHours = workingHours[dayIndex];
    return hour >= dayHours.from && hour < dayHours.to;
}
export function getVisibleHours(visibleHours: TVisibleHours, singleDaySchedules: ISchedule[]) {
    let earliestScheduleHour = visibleHours.from;
    let latestScheduleHour = visibleHours.to;

    singleDaySchedules.forEach(event => {
        const startHour = parseISO(event.startDate).getHours();
        const endTime = parseISO(event.endDate);
        const endHour = endTime.getHours() + (endTime.getMinutes() > 0 ? 1 : 0);
        if (startHour < earliestScheduleHour) earliestScheduleHour = startHour;
        if (endHour > latestScheduleHour) latestScheduleHour = endHour;
    });

    latestScheduleHour = Math.min(latestScheduleHour, 24);

    const hours = Array.from({ length: latestScheduleHour - earliestScheduleHour }, (_, i) => i + earliestScheduleHour);

    return { hours, earliestScheduleHour, latestScheduleHour };
}


// ================ Month view helper functions ================ //

export function getCalendarCells(selectedDate: Date): ICalendarCell[] {
    const currentYear = selectedDate.getFullYear();
    const currentMonth = selectedDate.getMonth();

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);
    const totalDays = firstDayOfMonth + daysInMonth;

    const prevMonthCells = Array.from({ length: firstDayOfMonth }, (_, i) => ({
        day: daysInPrevMonth - firstDayOfMonth + i + 1,
        currentMonth: false,
        date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - firstDayOfMonth + i + 1),
    }));

    const currentMonthCells = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        currentMonth: true,
        date: new Date(currentYear, currentMonth, i + 1),
    }));

    const nextMonthCells = Array.from({ length: (7 - (totalDays % 7)) % 7 }, (_, i) => ({
        day: i + 1,
        currentMonth: false,
        date: new Date(currentYear, currentMonth + 1, i + 1),
    }));

    return [...prevMonthCells, ...currentMonthCells, ...nextMonthCells];
}

export function calculateMonthSchedulePositions(
    multiDaySchedules: ISchedule[],
    singleDaySchedules: ISchedule[],
    selectedDate: Date
) {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);

    const schedulePositions: { [key: string]: number } = {};
    const occupiedPositions: { [key: string]: boolean[] } = {};

    eachDayOfInterval({ start: monthStart, end: monthEnd }).forEach(day => {
        occupiedPositions[day.toISOString()] = [false, false, false];
    });

    const sortedSchedules = [
        ...multiDaySchedules.sort((a, b) => {
            const aDuration = differenceInDays(parseISO(a.endDate), parseISO(a.startDate));
            const bDuration = differenceInDays(parseISO(b.endDate), parseISO(b.startDate));
            return bDuration - aDuration || parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime();
        }),
        ...singleDaySchedules.sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()),
    ];

    sortedSchedules.forEach(schedule => {
        const scheduleStart = parseISO(schedule.startDate);
        const scheduleEnd = parseISO(schedule.endDate);
        const scheduleDays = eachDayOfInterval({
            start: scheduleStart < monthStart ? monthStart : scheduleStart,
            end: scheduleEnd > monthEnd ? monthEnd : scheduleEnd,
        });

        let position = -1;

        for (let i = 0; i < 3; i++) {
            if (
                scheduleDays.every(day => {
                    const dayPositions = occupiedPositions[startOfDay(day).toISOString()];
                    return dayPositions && !dayPositions[i];
                })
            ) {
                position = i;
                break;
            }
        }

        if (position !== -1) {
            scheduleDays.forEach(day => {
                const dayKey = startOfDay(day).toISOString();
                occupiedPositions[dayKey][position] = true;
            });
            schedulePositions[schedule.id] = position;
        }
    });

    return schedulePositions;
}

export function getMonthCellSchedules(date: Date, schedules: ISchedule[], schedulePositions: Record<string, number>) {
    const schedulesForDate = schedules.filter(schedule => {
        const scheduleStart = parseISO(schedule.startDate);
        const scheduleEnd = parseISO(schedule.endDate);
        return (date >= scheduleStart && date <= scheduleEnd) || isSameDay(date, scheduleStart) || isSameDay(date, scheduleEnd);
    });

    return schedulesForDate
        .map(schedule => ({
            ...schedule,
            position: schedulePositions[schedule.id] ?? -1,
            isMultiDay: schedule.startDate !== schedule.endDate,
        }))
        .sort((a, b) => {
            if (a.isMultiDay && !b.isMultiDay) return -1;
            if (!a.isMultiDay && b.isMultiDay) return 1;
            return a.position - b.position;
        });
}