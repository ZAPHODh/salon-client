"use client"

import * as React from "react"
import {
    ArrowUpCircleIcon,
    BarChartIcon,
    LayoutDashboardIcon,
    ListIcon,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const t = useTranslations('finance.nav')
    const data = {
        navMain: [
            {
                title: t('dashboard'),
                url: "/finance",
                icon: LayoutDashboardIcon,
            },
            {
                title: t('dailyEntries'),
                url: "/finance/daily",
                icon: ListIcon,
            },
            {
                title: t('profitability'),
                url: "/finance/profit",
                icon: BarChartIcon,
            },
        ],
    }

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <Link href="/">
                                <ArrowUpCircleIcon className="h-5 w-5" />
                                <span className="text-base font-semibold">Project</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
        </Sidebar>
    )
}
