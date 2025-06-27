'use client';

import { useSession } from "@/components/providers/session";
import { useCalendar } from "../contexts/calendar";
import { ISchedule } from "../interfaces";
import { toast } from "sonner";


export function useUpdateSchedule() {
    const { setSchedules } = useCalendar();
    const { session } = useSession()

    const updateSchedule = async (schedule: ISchedule) => {
        const { service, professional, customer, ...newSchedule } = schedule;
        const typedSchedule: Omit<ISchedule, 'service' | 'professional' | 'customer'> = newSchedule;
        typedSchedule.startDate = new Date(schedule.startDate).toISOString();
        typedSchedule.endDate = new Date(schedule.endDate).toISOString();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/appointments/${schedule.id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(typedSchedule)
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