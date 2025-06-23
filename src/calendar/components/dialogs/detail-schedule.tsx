"use client";

import { parseISO } from "date-fns";
import { useLocale } from 'next-intl';
import { Calendar, Clock, Text, User } from "lucide-react";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";

import type { ISchedule } from "@/calendar/interfaces";
import { useTranslations } from "next-intl";
import { formatDate } from "@/lib/helper";
import { EditScheduleDialog } from "./edit-schedule";

interface IProps {
    schedule: ISchedule;
    children: React.ReactNode;
}

export function ScheduleDetailsDialog({ schedule, children }: IProps) {
    const locale = useLocale()

    const t = useTranslations('calendar.dialog.detail');
    const startDate = parseISO(schedule.startDate);
    const endDate = parseISO(schedule.endDate);
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent className="sm:max-w-xs">
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>{t('description')}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex items-start gap-2">
                        <User className="mt-1 size-4 shrink-0 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">{t('sections.professional.label')}</p>
                            <p className="text-sm text-muted-foreground">
                                {schedule.professional.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <Calendar className="mt-1 size-4 shrink-0 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">{t('sections.start.label')}</p>
                            <p className="text-sm text-muted-foreground">
                                {formatDate(startDate, locale, "PPp")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <Clock className="mt-1 size-4 shrink-0 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">{t('sections.end.label')}</p>
                            <p className="text-sm text-muted-foreground">
                                {formatDate(endDate, locale, "PPp")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <Text className="mt-1 size-4 shrink-0 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">{t('sections.description.label')}</p>
                            <p className="text-sm text-muted-foreground">
                                {schedule.notes}
                            </p>
                        </div>
                    </div>
                </div>

                <DialogClose asChild>
                    <EditScheduleDialog schedule={schedule}>
                        {t('buttons.edit')}
                    </EditScheduleDialog>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}