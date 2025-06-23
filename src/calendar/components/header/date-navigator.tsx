import { useMemo } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


import type { ISchedule } from "@/calendar/interfaces";
import { useCalendar } from "@/calendar/contexts/calendar";
import { getSchedulesCount, navigateDate, rangeText } from "@/calendar/helper";
import { getFnsLocale, formatDate } from "@/lib/helper";
import { useLocale } from "next-intl";

interface IProps {
    view: TCalendarView;
    schedules: ISchedule[];
}

export function DateNavigator({ view, schedules }: IProps) {
    const locale = useLocale()
    const fnsLocale = getFnsLocale(locale)
    const { selectedDate, setSelectedDate } = useCalendar();
    const month = formatDate(selectedDate, locale, "MMMM",);
    const year = selectedDate.getFullYear();

    const scheduleCount = useMemo(
        () => getSchedulesCount(schedules, selectedDate, view),
        [schedules, selectedDate, view]
    );

    const handlePrevious = () => setSelectedDate(navigateDate(selectedDate, view, "previous"));
    const handleNext = () => setSelectedDate(navigateDate(selectedDate, view, "next"));

    return (
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <span className="text-lg font-semibold capitalize">
                    {month} {year}
                </span>
                <Badge variant="secondary">{scheduleCount} agendamentos</Badge>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handlePrevious}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <p className="text-sm text-muted-foreground">
                    {rangeText(view, selectedDate, fnsLocale)}
                </p>

                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleNext}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}