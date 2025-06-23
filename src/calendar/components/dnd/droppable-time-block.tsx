"use client";

import { useDrop } from "react-dnd";
import { parseISO, differenceInMilliseconds } from "date-fns";

import { useUpdateSchedule } from "@/calendar/hooks/use-update-schedule";

import { cn } from "@/lib/utils";
import { ItemTypes } from "@/calendar/components/dnd/draggable-schedule";

import type { ISchedule } from "@/calendar/interfaces";

interface DroppableTimeBlockProps {
    date: Date;
    hour: number;
    minute: number;
    children: React.ReactNode;
}

export function DroppableTimeBlock({ date, hour, minute, children }: DroppableTimeBlockProps) {
    const { updateSchedule } = useUpdateSchedule();

    const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
            accept: ItemTypes.SCHEDULE,
            drop: (item: { schedule: ISchedule }) => {
                const droppedSchedule = item.schedule;

                const scheduleStartDate = parseISO(droppedSchedule.startDate);
                const scheduleEndDate = parseISO(droppedSchedule.endDate);

                const scheduleDurationMs = differenceInMilliseconds(scheduleEndDate, scheduleStartDate);

                const newStartDate = new Date(date);
                newStartDate.setHours(hour, minute, 0, 0);
                const newEndDate = new Date(newStartDate.getTime() + scheduleDurationMs);

                updateSchedule({
                    ...droppedSchedule,
                    startDate: newStartDate.toISOString(),
                    endDate: newEndDate.toISOString(),
                });

                return { moved: true };
            },
            collect: monitor => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            }),
        }),
        [date, hour, minute, updateSchedule]
    );

    return (
        <div ref={drop as unknown as React.RefObject<HTMLDivElement>} className={cn("h-[24px]", isOver && canDrop && "bg-accent/50")}>
            {children}
        </div>
    );
}