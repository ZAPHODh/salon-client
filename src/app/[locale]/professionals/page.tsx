

import { GoogleAdSense } from "@/components/ads/google-adsense"
import { ProfessionalsDataTable } from "@/components/professionals/professional-table"
import { verifySession } from "@/lib/auth/dal"
import { getUserSubscriptionPlan } from "@/lib/payment"
import { redirect } from "next/navigation"


export default async function ProfessionalsPage() {
    const { session } = await verifySession()
    if (!session) {
        redirect('/auth/signin')
    }
    const { isPro } = await getUserSubscriptionPlan(session?.user?.id)
    return (
        <div className="container mx-auto py-6">
            {!isPro && <GoogleAdSense adSlot="4721006886" />}
            <ProfessionalsDataTable />
        </div>
    )
}