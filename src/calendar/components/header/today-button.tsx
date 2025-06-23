import { useCalendar } from "@/calendar/contexts/calendar";
import { formatDate } from "@/lib/helper";
import { useLocale } from "next-intl";


export function TodayButton() {
    const locale = useLocale()
    const { setSelectedDate } = useCalendar();

    const today = new Date();
    const handleClick = () => setSelectedDate(today);

    return (
        <button className="flex size-14 flex-col items-start overflow-hidden rounded-lg border" onClick={handleClick}>
            <p className="flex h-6 w-full items-center justify-center bg-secondary text-center text-xs font-semibold ">
                {formatDate(today, locale, 'MMM').toUpperCase()}
            </p>
            <p className="flex w-full items-center justify-center text-lg font-bold">{today.getDate()}</p>
        </button>
    );
}