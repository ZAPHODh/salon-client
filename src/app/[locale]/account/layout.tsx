import { Metadata } from "next"
import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/account/side-nav"
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getTranslations } from "next-intl/server";
import { verifySession } from "@/lib/auth/dal";
import { getSalon } from "@/requests/get-salon";
import { redirect } from "@/i18n/navigation";




export const metadata: Metadata = {
    title: "Account",
    description: "",
}

interface SettingsLayoutProps {
    children: React.ReactNode
    params: Promise<{ locale: string }>;
}



export default async function SettingsLayout({ children, params }: SettingsLayoutProps) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
    const { session } = await verifySession()
    if (!session) {
        redirect({ href: '/auth/signin', locale })
    }
    const salon = await getSalon()
    if (!salon) {
        redirect({ href: '/settings', locale })
    }
    const t = await getTranslations({ locale, namespace: 'account.sidenav' });
    const sidebarNavItems = [
        {
            title: t('profile'),
            href: "/account",
        },
        {
            title: t('salon'),
            href: "/account/salon",
        },
        {
            title: t('apparence'),
            href: "/account/apparence",
        },
        {
            title: t('billing'),
            href: "/account/billing",
        },

    ]

    return (
        <div className="space-y-6 p-4 lg:p-10 pb-16 md:block">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">{t('layout.heading')}</h2>
                <p className="text-muted-foreground">
                    {t('layout.description')}
                </p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-3 lg:w-1/5">
                    <SidebarNav items={sidebarNavItems} />
                </aside>
                <div className="flex-1 lg:max-w-2xl lg:px-6">{children}</div>
            </div>
        </div>
    )
}