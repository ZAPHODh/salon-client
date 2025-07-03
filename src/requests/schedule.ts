'use server';

import { ISchedule } from "@/calendar/interfaces";
import { verifySession } from "@/lib/auth/dal";

async function createSchedule(scheduleData: any): Promise<ISchedule | null> {
    const { session } = await verifySession()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/appointments`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData)
    });

    if (!res.ok) {
        return null;
    }

    const createdSchedule: ISchedule = await res.json();
    return createdSchedule
};

async function updateSchedule(schedule: Omit<ISchedule, 'service' | 'professional' | 'customer'>) {
    const { session } = await verifySession()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/appointments/${schedule.id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(schedule)
    })
    if (!res.ok) {
        return false
    }
    return true
};

export { createSchedule, updateSchedule }