

import { ChangeBadgeVariantInput } from "@/calendar/components/change-badge-variant-input";
import { ChangeVisibleHoursInput } from "@/calendar/components/change-visible-houts-input";
import { ChangeWorkingHoursInput } from "@/calendar/components/change-working-hours-input";
import { CalendarProvider } from "@/calendar/contexts/calendar";
import { getSchedules } from "@/calendar/requests";
import { CustomerProvider } from "@/components/providers/customer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { redirect } from "@/i18n/navigation";
import { getServerSession } from "@/lib/auth/server-session";
import { getCustomers } from "@/requests/customers";
import { getProfessionalsData } from "@/requests/professionals";
import { getServicesData } from "@/requests/services";
import { Settings } from "lucide-react";




export default async function Layout({ children, params }: { children: React.ReactNode, params: Promise<{ locale: string }>; }) {
    const session = await getServerSession()
    const locale = (await params).locale
    if (!session) redirect({ href: 'auth/signin', locale })
    const professionals = await getProfessionalsData()
    const services = await getServicesData()
    const schedules = await getSchedules()
    const customers = await getCustomers()
    return (
        <CustomerProvider initialCustomers={customers}>
            <CalendarProvider initialProfessionals={professionals} schedules={schedules} initialServices={services}>
                <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-8 py-4">
                    {children}
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" className="border-none">
                            <AccordionTrigger className="flex-none gap-2 py-0 hover:no-underline">
                                <div className="flex items-center gap-2">
                                    <Settings className="size-4" />
                                    <p className="text-base font-semibold">Calendar settings</p>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent>
                                <div className="mt-4 flex flex-col gap-6">
                                    <ChangeBadgeVariantInput />
                                    <ChangeVisibleHoursInput />
                                    <ChangeWorkingHoursInput />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </CalendarProvider>
        </CustomerProvider>
    );
}