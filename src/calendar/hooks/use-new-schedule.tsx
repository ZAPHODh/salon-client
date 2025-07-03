'use client';

import { useCalendar } from "../contexts/calendar";
import { ISchedule } from "../interfaces";
import { toast } from "sonner";
import { scheduleSchema } from "../schema";
import { createSchedule as createScheduleAction } from "@/requests/schedule";

export function useCreateSchedule() {
    const { setSchedules } = useCalendar();

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

        const createdSchedule = await createScheduleAction(parsed.data)

        if (!createdSchedule) {
            toast('Não foi possível criar o agendamento', {
                description: 'Erro ao criar'
            });
            return;
        }
        setSchedules(prev => [...prev, createdSchedule]);
    };

    return { createSchedule };
}