
import { Columns, Grid3x3, List, Plus, Grid2x2, CalendarRange } from "lucide-react";

import { Button } from "@/components/ui/button";


import { TodayButton } from "@/calendar/components/header/today-button";
import { DateNavigator } from "@/calendar/components/header/date-navigator";


import type { ISchedule } from "@/calendar/interfaces";
import { ProfessionalSelect } from "./professional-select";
import { AddScheduleDialog } from "../dialogs/add-schedule";
import { Link } from "@/i18n/navigation";

interface IProps {
    view: TCalendarView;
    schedules: ISchedule[];
}

export function CalendarHeader({ view, schedules }: IProps) {
    return (
        <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
                <TodayButton />
                <DateNavigator view={view} schedules={schedules} />
            </div>

            <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:justify-between">
                <div className="flex w-full items-center gap-1.5">
                    <div className="inline-flex first:rounded-r-none last:rounded-l-none [&:not(:first-child):not(:last-child)]:rounded-none">
                        <Button asChild aria-label="View by day" size="icon" variant={view === "day" ? "default" : "outline"} className="rounded-r-none [&_svg]:size-5">
                            <Link href="/calendar/day-view">
                                <List strokeWidth={1.8} />
                            </Link>
                        </Button>

                        <Button
                            asChild
                            aria-label="View by week"
                            size="icon"
                            variant={view === "week" ? "default" : "outline"}
                            className="-ml-px rounded-none [&_svg]:size-5"
                        >
                            <Link href="/calendar/week-view">
                                <Columns strokeWidth={1.8} />
                            </Link>
                        </Button>

                        <Button
                            asChild
                            aria-label="View by month"
                            size="icon"
                            variant={view === "month" ? "default" : "outline"}
                            className="-ml-px rounded-none [&_svg]:size-5"
                        >
                            <Link href="/calendar/month-view">
                                <Grid2x2 strokeWidth={1.8} />
                            </Link>
                        </Button>

                        <Button
                            asChild
                            aria-label="View by year"
                            size="icon"
                            variant={view === "year" ? "default" : "outline"}
                            className="-ml-px rounded-none [&_svg]:size-5"
                        >
                            <Link href="/calendar/year-view">
                                <Grid3x3 strokeWidth={1.8} />
                            </Link>
                        </Button>

                        <Button
                            asChild
                            aria-label="View by agenda"
                            size="icon"
                            variant={view === "agenda" ? "default" : "outline"}
                            className="-ml-px rounded-l-none [&_svg]:size-5"
                        >
                            <Link href="/calendar/agenda-view">
                                <CalendarRange strokeWidth={1.8} />
                            </Link>
                        </Button>
                    </div>

                    <ProfessionalSelect />
                </div>

                <AddScheduleDialog>
                    <Button className="w-full sm:w-auto">
                        <Plus />
                        Agendar
                    </Button>
                </AddScheduleDialog>
            </div>
        </div>
    );
}