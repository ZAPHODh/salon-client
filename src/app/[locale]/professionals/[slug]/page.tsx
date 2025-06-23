import ProfessionalDetailPage from "@/components/professionals/professional-page"
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
    const professional = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/professionals/${slug}`, {
        next: { revalidate: 60 },
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    if (!professional.ok) {
        redirect('/professionals')
    }
    const professionalData = await professional.json()
    return (
        <ProfessionalDetailPage professional={professionalData} />

    )
}