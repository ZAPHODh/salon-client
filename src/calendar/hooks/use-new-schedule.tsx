'use client';

import { useSession } from "@/components/providers/session";
import { useCalendar } from "../contexts/calendar";
import { ISchedule } from "../interfaces";
import { toast } from "sonner";
import { scheduleSchema } from "../schema";

export function useCreateSchedule() {
    const { setSchedules } = useCalendar();
    const { session } = useSession();

    const createSchedule = async (scheduleData: Partial<ISchedule>) => {

        const parsed = scheduleSchema.safeParse({
            ...scheduleData,
            startDate: new Date(scheduleData.startDate as string),
            endDate: new Date(scheduleData.endDate as string)
        })
        if (!parsed.success) {
            toast('Não foi possível criar o agendamento', {
                description: `${parsed.error}`
            });
            return
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/appointments`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parsed.data)
        });

        if (!res.ok) {
            toast('Não foi possível criar o agendamento', {
                description: 'Erro ao criar'
            });
            return;
        }

        const createdSchedule: ISchedule = await res.json();
        setSchedules(prev => [...prev, createdSchedule]);
    };

    return { createSchedule };
}