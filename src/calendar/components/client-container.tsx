"use client";

import { useMemo } from "react";
import { isSameDay, parseISO } from "date-fns";



import { DndProviderWrapper } from "@/calendar/components/dnd/dnd-provider";

import { CalendarHeader } from "@/calendar/components/header/calendar-header";
import { CalendarMonthView } from "@/calendar/components/month-view/calendar-month-view";
import { CalendarAgendaView } from "@/calendar/components/agenda-view/calendar-agenda-view";
import { CalendarDayView } from "@/calendar/components/week-and-day-view/calendar-day-view";
import { CalendarWeekView } from "@/calendar/components/week-and-day-view/calendar-week-view";


import { useCalendar } from "../contexts/calendar";
import { CalendarYearView } from "./year-view/calendar-year-view";

interface IProps {
    view: TCalendarView;
}

export function ClientContainer({ view }: IProps) {
    const { selectedDate, selectedProfessionalId, schedules } = useCalendar();

    const filteredSchedules = useMemo(() => {
        return schedules.filter(schedule => {
            const scheduleStartDate = parseISO(schedule.startDate);
            const scheduleEndDate = parseISO(schedule.endDate);

            if (view === "year") {
                const yearStart = new Date(selectedDate.getFullYear(), 0, 1);
                const yearEnd = new Date(selectedDate.getFullYear(), 11, 31, 23, 59, 59, 999);
                const isInSelectedYear = scheduleStartDate <= yearEnd && scheduleEndDate >= yearStart;
                const isUserMatch = selectedProfessionalId === "all" || schedule.professional.id === selectedProfessionalId;
                return isInSelectedYear && isUserMatch;
            }

            if (view === "month" || view === "agenda") {
                const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
                const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
                const isInSelectedMonth = scheduleStartDate <= monthEnd && scheduleEndDate >= monthStart;
                const isUserMatch = selectedProfessionalId === "all" || schedule.professional.id === selectedProfessionalId;
                return isInSelectedMonth && isUserMatch;
            }

            if (view === "week") {
                const dayOfWeek = selectedDate.getDay();

                const weekStart = new Date(selectedDate);
                weekStart.setDate(selectedDate.getDate() - dayOfWeek);
                weekStart.setHours(0, 0, 0, 0);

                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                weekEnd.setHours(23, 59, 59, 999);

                const isInSelectedWeek = scheduleStartDate <= weekEnd && scheduleEndDate >= weekStart;
                const isUserMatch = selectedProfessionalId === "all" || schedule.professional.id === selectedProfessionalId;
                return isInSelectedWeek && isUserMatch;
            }

            if (view === "day") {
                const dayStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0);
                const dayEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59);
                const isInSelectedDay = scheduleStartDate <= dayEnd && scheduleEndDate >= dayStart;
                const isUserMatch = selectedProfessionalId === "all" || schedule.professional.id === selectedProfessionalId;
                return isInSelectedDay && isUserMatch;
            }
        });
    }, [selectedDate, selectedProfessionalId, schedules, view]);

    const singleDaySchedules = filteredSchedules.filter(schedule => {
        const startDate = parseISO(schedule.startDate);
        const endDate = parseISO(schedule.endDate);
        return isSameDay(startDate, endDate);
    });

    const multiDaySchedules = filteredSchedules.filter(schedule => {
        const startDate = parseISO(schedule.startDate);
        const endDate = parseISO(schedule.endDate);
        return !isSameDay(startDate, endDate);
    });

    const scheduleStartDates = useMemo(() => {
        return filteredSchedules.map(schedule => ({ ...schedule, endDate: schedule.startDate }));
    }, [filteredSchedules]);

    return (
        <div className="overflow-hidden rounded-xl border">
            <CalendarHeader view={view} schedules={filteredSchedules} />

            <DndProviderWrapper>
                {view === "day" && <CalendarDayView singleDaySchedules={singleDaySchedules} multiDaySchedules={multiDaySchedules} />}
                {view === "month" && <CalendarMonthView singleDaySchedules={singleDaySchedules} multiDaySchedules={multiDaySchedules} />}
                {view === "week" && <CalendarWeekView singleDaySchedules={singleDaySchedules} multiDaySchedules={multiDaySchedules} />}
                {view === "year" && <CalendarYearView allSchedules={scheduleStartDates} />}
                {view === "agenda" && <CalendarAgendaView singleDaySchedules={singleDaySchedules} multiDaySchedules={multiDaySchedules} />}
            </DndProviderWrapper>
        </div>
    );
}