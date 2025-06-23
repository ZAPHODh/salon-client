"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserNav } from "@/components/widgets/user-nav"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export function SiteHeader() {
    const t = useTranslations('finance.nav.header')

    return (
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 justify-between">
                <div className="flex items-center gap-1 lg:gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mx-2 data-[orientation=vertical]:h-4"
                    />
                    <Link href={'#'}>
                        <p className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                            {t('salon')}
                        </p>
                    </Link>
                    <Link href={'#'}>
                        <p className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                            {t('schedule')}
                        </p>
                    </Link>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    <UserNav />
                </div>
            </div>
        </header>
    )
}