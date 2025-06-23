"use client";

import { useDrop } from "react-dnd";
import { parseISO, differenceInMilliseconds } from "date-fns";



import { cn } from "@/lib/utils";
import { ItemTypes } from "@/calendar/components/dnd/draggable-schedule";

import type { ISchedule, ICalendarCell } from "@/calendar/interfaces";
import { useUpdateSchedule } from "@/calendar/hooks/use-update-schedule";

interface DroppableDayCellProps {
    cell: ICalendarCell;
    children: React.ReactNode;
}

export function DroppableDayCell({ cell, children }: DroppableDayCellProps) {
    const { updateSchedule } = useUpdateSchedule();

    const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
            accept: ItemTypes.SCHEDULE,
            drop: (item: { schedule: ISchedule }) => {
                const droppedSchedule = item.schedule;

                const scheduleStartDate = parseISO(droppedSchedule.startDate);
                const scheduleEndDate = parseISO(droppedSchedule.endDate);

                const scheduleDurationMs = differenceInMilliseconds(scheduleEndDate, scheduleStartDate);

                const newStartDate = new Date(cell.date);
                newStartDate.setHours(scheduleStartDate.getHours(), scheduleStartDate.getMinutes(), scheduleStartDate.getSeconds(), scheduleStartDate.getMilliseconds());
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
        [cell.date, updateSchedule]
    );

    return (
        <div ref={drop as unknown as React.RefObject<HTMLDivElement>} className={cn(isOver && canDrop && "bg-accent/50")}>
            {children}
        </div>
    );
}