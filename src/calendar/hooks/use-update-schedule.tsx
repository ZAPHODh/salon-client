'use client';

import { useSession } from "@/components/providers/session";
import { useCalendar } from "../contexts/calendar";
import { ISchedule } from "../interfaces";
import { toast } from "sonner";
import { TScheduleFormData } from "../schema";


export function useUpdateSchedule() {
    const { setSchedules } = useCalendar();
    const { session } = useSession()

    const updateSchedule = async (schedule: ISchedule) => {
        const newSchedule: ISchedule = schedule;
        newSchedule.startDate = new Date(schedule.startDate).toISOString();
        newSchedule.endDate = new Date(schedule.endDate).toISOString();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/appointments`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
            body: JSON.stringify(newSchedule)
        })
        if (!res.ok) {
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