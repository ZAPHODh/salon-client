import { Calendar as CalendarIcon, Clock, User } from "lucide-react";
import { parseISO, areIntervalsOverlapping, format } from "date-fns";



import { ScrollArea } from "@/components/ui/scroll-area";



import { ScheduleBlock } from "@/calendar/components/week-and-day-view/schedule-block";
import { DroppableTimeBlock } from "@/calendar/components/dnd/droppable-time-block";

import { DayViewMultiDaySchedulesRow } from "@/calendar/components/week-and-day-view/day-view-multi-day-schedules-row";

import { cn } from "@/lib/utils";


import type { ISchedule } from "@/calendar/interfaces";
import { useCalendar } from "@/calendar/contexts/calendar";
import { getCurrentSchedules, getScheduleBlockStyle, getVisibleHours, groupSchedules, isWorkingHour } from "@/calendar/helper";
import { AddScheduleDialog } from "../dialogs/add-schedule";
import { CalendarTimeline } from "./calendar-timeline";
import { Calendar } from "@/components/ui/calendar";
// import { SingleCalendar } from "@/components/ui/single-calendar";

interface IProps {
    singleDaySchedules: ISchedule[];
    multiDaySchedules: ISchedule[];
}

export function CalendarDayView({ singleDaySchedules, multiDaySchedules }: IProps) {
    const { selectedDate, setSelectedDate, professionals, visibleHours, workingHours } = useCalendar();

    const { hours, earliestScheduleHour, latestScheduleHour } = getVisibleHours(visibleHours, singleDaySchedules);

    const currentSchedules = getCurrentSchedules(singleDaySchedules);

    const daySchedules = singleDaySchedules.filter(schedule => {
        const scheduleDate = parseISO(schedule.startDate);
        return (
            scheduleDate.getDate() === selectedDate.getDate() &&
            scheduleDate.getMonth() === selectedDate.getMonth() &&
            scheduleDate.getFullYear() === selectedDate.getFullYear()
        );
    });

    const groupedSchedules = groupSchedules(daySchedules);

    return (
        <div className="flex">
            <div className="flex flex-1 flex-col">
                <div>
                    <DayViewMultiDaySchedulesRow selectedDate={selectedDate} multiDaySchedules={multiDaySchedules} />

                    {/* Day header */}
                    <div className="relative z-20 flex border-b">
                        <div className="w-18"></div>
                        <span className="flex-1 border-l py-2 text-center text-xs font-medium text-muted-foreground">
                            {format(selectedDate, "EE")} <span className="font-semibold text-foreground">{format(selectedDate, "d")}</span>
                        </span>
                    </div>
                </div>

                <ScrollArea className="h-[800px]" type="always">
                    <div className="flex">
                        {/* Hours column */}
                        <div className="relative w-18">
                            {hours.map((hour, index) => (
                                <div key={hour} className="relative" style={{ height: "96px" }}>
                                    <div className="absolute -top-3 right-2 flex h-6 items-center">
                                        {index !== 0 && <span className="text-xs text-muted-foreground">{format(new Date().setHours(hour), "hh a")}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Day grid */}
                        <div className="relative flex-1 border-l">
                            <div className="relative">
                                {hours.map((hour, index) => {
                                    const isDisabled = !isWorkingHour(selectedDate, hour, workingHours);

                                    return (
                                        <div key={hour} className={cn("relative", isDisabled && "bg-calendar-disabled-hour")} style={{ height: "96px" }}>
                                            {index !== 0 && <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>}

                                            <DroppableTimeBlock date={selectedDate} hour={hour} minute={0}>
                                                <AddScheduleDialog startDate={selectedDate} startTime={{ hour, minute: 0 }}>
                                                    <div className="absolute inset-x-0 top-0 h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                                                </AddScheduleDialog>
                                            </DroppableTimeBlock>

                                            <DroppableTimeBlock date={selectedDate} hour={hour} minute={15}>
                                                <AddScheduleDialog startDate={selectedDate} startTime={{ hour, minute: 15 }}>
                                                    <div className="absolute inset-x-0 top-[24px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                                                </AddScheduleDialog>
                                            </DroppableTimeBlock>

                                            <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed"></div>

                                            <DroppableTimeBlock date={selectedDate} hour={hour} minute={30}>
                                                <AddScheduleDialog startDate={selectedDate} startTime={{ hour, minute: 30 }}>
                                                    <div className="absolute inset-x-0 top-[48px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                                                </AddScheduleDialog>
                                            </DroppableTimeBlock>

                                            <DroppableTimeBlock date={selectedDate} hour={hour} minute={45}>
                                                <AddScheduleDialog startDate={selectedDate} startTime={{ hour, minute: 45 }}>
                                                    <div className="absolute inset-x-0 top-[72px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                                                </AddScheduleDialog>
                                            </DroppableTimeBlock>
                                        </div>
                                    );
                                })}

                                {groupedSchedules.map((group, groupIndex) =>
                                    group.map(schedule => {
                                        let style = getScheduleBlockStyle(schedule, selectedDate, groupIndex, groupedSchedules.length, { from: earliestScheduleHour, to: latestScheduleHour });
                                        const hasOverlap = groupedSchedules.some(
                                            (otherGroup, otherIndex) =>
                                                otherIndex !== groupIndex &&
                                                otherGroup.some(otherSchedule =>
                                                    areIntervalsOverlapping(
                                                        { start: parseISO(schedule.startDate), end: parseISO(schedule.endDate) },
                                                        { start: parseISO(otherSchedule.startDate), end: parseISO(otherSchedule.endDate) }
                                                    )
                                                )
                                        );

                                        if (!hasOverlap) style = { ...style, width: "100%", left: "0%" };

                                        return (
                                            <div key={schedule.id} className="absolute p-1" style={style}>
                                                <ScheduleBlock schedule={schedule} />
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <CalendarTimeline />
                        </div>
                    </div>
                </ScrollArea>
            </div>

            <div className="hidden w-64 divide-y border-l md:block">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />

                <div className="flex-1 space-y-3">
                    {currentSchedules.length > 0 ? (
                        <div className="flex items-start gap-2 px-4 pt-4">
                            <span className="relative mt-[5px] flex size-2.5">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex size-2.5 rounded-full bg-green-600"></span>
                            </span>

                            <p className="text-sm font-semibold text-foreground">Acontecendo agora</p>
                        </div>
                    ) : (
                        <p className="p-4 text-center text-sm italic text-muted-foreground">Sem agendamentos no momento</p>
                    )}

                    {currentSchedules.length > 0 && (
                        <ScrollArea className="h-[422px] px-4" type="always">
                            <div className="space-y-6 pb-4">
                                {currentSchedules.map(schedule => {
                                    const professional = professionals.find(professional => professional.id === schedule.professional.id);

                                    return (
                                        <div key={schedule.id} className="space-y-1.5">
                                            <p className="line-clamp-2 text-sm font-semibold">{schedule.title}</p>

                                            {professional && (
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <User className="size-3.5" />
                                                    <span className="text-sm">{professional.name}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <CalendarIcon className="size-3.5" />
                                                <span className="text-sm">{format(new Date(), "MMM d, yyyy")}</span>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <Clock className="size-3.5" />
                                                <span className="text-sm">
                                                    {format(parseISO(schedule.startDate), "h:mm a")} - {format(parseISO(schedule.endDate), "h:mm a")}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </div>
        </div>
    );
}