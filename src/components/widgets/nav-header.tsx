'use client'

import { usePathname } from "next/navigation"
import { UserNav } from "./user-nav"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Button } from "../ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"

export default function NavHeader() {
    const pathname = usePathname()
    if (pathname.includes('sign')) return null

    return (
        <div className="border-b">
            <div className="flex h-16 items-center justify-between md:justify-none px-4">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 hover:cursor-pointer">
                        <Link href="/">PROJECT</Link>
                    </h1>

                    <div className="hidden md:flex">
                        <MainNav className="mx-6" />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="ml-auto flex items-center space-x-4">
                        <UserNav />
                    </div>
                    <div className="flex md:hidden ml-auto">
                        <MobileNav />
                    </div>
                </div>
            </div>
        </div>
    )
}


export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const t = useTranslations('header')
    const pathname = usePathname()

    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
            <Link
                href="/finance"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname.includes("/finance") ? "" : "text-muted-foreground"
                )}
            >
                {t('finance')}
            </Link>
            <Link

                href="/professionals"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname.includes("/professionals") ? "" : "text-muted-foreground"
                )}
            >
                {t('professionals')}
            </Link>
            <Link
                href="/customers"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname.includes("/customers") ? "" : "text-muted-foreground"
                )}
            >
                {t('customers')}
            </Link>
            <Link
                href="/services"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname.includes("/customers") ? "" : "text-muted-foreground"
                )}
            >
                {t('services')}
            </Link>
            <Link
                href="/calendar/week-view"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname.includes("/calendar") ? "" : "text-muted-foreground"
                )}
            >
                {t('schedule')}
            </Link>
        </nav>
    )
}

function MobileNav() {
    const t = useTranslations("header")
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64" >
                <SheetTitle className="hidden"></SheetTitle>
                <nav className="flex flex-col space-y-4 mt-6">
                    <Link
                        href="/finance"
                        onClick={() => setOpen(false)}
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            pathname.includes("/finance") ? "" : "text-muted-foreground"
                        )}
                    >
                        {t('finance')}
                    </Link>
                    <Link
                        href="/professionals"
                        onClick={() => setOpen(false)}
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            pathname.includes("/professionals") ? "" : "text-muted-foreground"
                        )}
                    >
                        {t('professionals')}
                    </Link>
                    <Link
                        href="/customers"
                        onClick={() => setOpen(false)}
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            pathname.includes("/customers") ? "" : "text-muted-foreground"
                        )}
                    >
                        {t('customers')}
                    </Link>
                    <Link
                        href="/calendar/week-view"
                        onClick={() => setOpen(false)}
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            pathname.includes("/calendar") ? "" : "text-muted-foreground"
                        )}
                    >
                        {t('schedule')}
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    )
}
