'use client';

import { useCalendar } from "../contexts/calendar";
import { ISchedule } from "../interfaces";
import { toast } from "sonner";
import { updateSchedule as updateScheduleAction } from "@/requests/schedule";


export function useUpdateSchedule() {
    const { setSchedules } = useCalendar();

    const updateSchedule = async (schedule: ISchedule) => {
        const { service, professional, customer, ...newSchedule } = schedule;
        const typedSchedule: Omit<ISchedule, 'service' | 'professional' | 'customer'> = newSchedule;
        typedSchedule.startDate = new Date(schedule.startDate).toISOString();
        typedSchedule.endDate = new Date(schedule.endDate).toISOString();
        const isUpdated = await updateScheduleAction(schedule)
        if (!isUpdated) {
            toast('Não foi posssivel editar o agendamento', {
                description: 'Erro ao editar'
            })
            return
        }
        setSchedules(prev => {
            const index = prev.findIndex(s => s.id === schedule.id);
            if (index === -1) return prev;
            return [...prev.slice(0, index), schedule, ...prev.slice(index + 1)];
        });
    };

    return { updateSchedule };
}