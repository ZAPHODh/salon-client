"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { TrendingUp, Users, DollarSign, CreditCard, Calendar, BarChart3 } from "lucide-react"
import { Link } from "@/i18n/navigation"

const navItems = [
    {
        title: "Visão Geral",
        href: "/finance",
        icon: TrendingUp,
    },
    {
        title: "Profissionais",
        href: "/finance/professionals",
        icon: Users,
    },
    {
        title: "Produtos",
        href: "/finance/products",
        icon: DollarSign,
    },
    {
        title: "Transações",
        href: "/finance/transactions",
        icon: CreditCard,
    },
    {
        title: "Diário",
        href: "/finance/daily",
        icon: Calendar,
    },
    {
        title: "Relatórios",
        href: "/finance/reports",
        icon: BarChart3,
    },
]

export function FinanceNavbar() {
    const pathname = usePathname()

    return (
        <nav className="flex space-x-2 lg:space-x-4 overflow-x-auto pb-2">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground whitespace-nowrap",
                        pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    )}
                >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                </Link>
            ))}
        </nav>
    )
}
