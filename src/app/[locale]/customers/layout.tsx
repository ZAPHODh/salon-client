'use server';

import { CustomerProvider } from "@/components/providers/customer";
import { redirect } from "@/i18n/navigation";
import { verifySession } from "@/lib/auth/dal";
import { getCustomers } from "@/requests/customers";
import { getLocale } from "next-intl/server";


export default async function Layout({ children }: {
    children: React.ReactNode;
}) {
    const { session } = await verifySession()
    const locale = await getLocale()
    if (!session) redirect({ href: '/auth/locale', locale })
    const customers = await getCustomers()
    return (
        <CustomerProvider initialCustomers={customers || []}>
            {children}
        </CustomerProvider>
    )
}