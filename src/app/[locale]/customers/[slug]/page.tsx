
import CustomerPage from "@/components/customers/customer-page"
import { verifySession } from "@/lib/auth/dal"
import { redirect } from "next/navigation"

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const { session } = await verifySession()
    if (!session) redirect('/auth/signin')
    const customer = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customers/${slug}`, {
        next: { revalidate: 60 },
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    if (!customer.ok) {
        redirect('/customers')
    }
    const customerData = await customer.json()
    return (

        <CustomerPage customer={customerData} />
    )
}