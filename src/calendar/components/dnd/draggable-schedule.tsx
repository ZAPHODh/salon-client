"use client";

import { useRef } from "react";
import { useDrag } from "react-dnd";

import { cn } from "@/lib/utils";
import { ISchedule } from "@/calendar/interfaces";


export const ItemTypes = {
    SCHEDULE: "schedule",
};

interface DraggableScheduleProps {
    schedule: ISchedule;
    children: React.ReactNode;
}

export function DraggableSchedule({ schedule, children }: DraggableScheduleProps) {
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.SCHEDULE,
        item: { schedule },
        collect: monitor => ({ isDragging: monitor.isDragging() }),
    }));

    drag(ref);

    return (
        <div ref={ref} className={cn(isDragging && "opacity-40")}>
            {children}
        </div>
    );
}