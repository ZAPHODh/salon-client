
import CustomerPage from "@/components/customers/customer-page"
import { redirect } from "@/i18n/navigation"
import { verifySession } from "@/lib/auth/dal"
import { getLocale } from "next-intl/server"

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const locale = await getLocale()
    const { session } = await verifySession()
    if (!session) {
        redirect({ href: '/auth/signin', locale })
        return null
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customers/${slug}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    if (!res.ok) {
        redirect({ href: '/customers', locale })
    }
    const customer = await res.json()
    return <CustomerPage customer={customer} />
}