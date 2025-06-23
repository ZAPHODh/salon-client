'use server';

import { SalonConfigForm } from "@/components/account/salon/salon-form"
import { Separator } from "@/components/ui/separator"
import { TourCard } from "@/components/widgets/tour";
import { redirect } from "@/i18n/navigation";
import { verifySession } from "@/lib/auth/dal";
import { salonConfigSteps } from "@/lib/tour/steps/salon";
import { getLocale } from "next-intl/server";


import { Onborda, OnbordaProvider } from "onborda";

export default async function Page() {
    const { session } = await verifySession()
    const locale = await getLocale()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/salons`, {
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        }
    })
    if (!res.ok) redirect({ locale, href: '/settings' })
    const data = await res.json()
    return (
        <OnbordaProvider>
            <Onborda
                steps={salonConfigSteps}
                cardComponent={TourCard}
                shadowOpacity="0.8"
                cardTransition={{ type: "spring", stiffness: 100, damping: 10 }}
            >
                <div className="space-y-6" >
                    <div>
                        <h3 className="text-lg font-medium" >title </h3>
                        < p className="text-sm text-muted-foreground" >
                            desription
                        </p>
                    </div>
                    < Separator />
                    <SalonConfigForm initialData={res.ok && data} />
                </div>
            </Onborda>
        </OnbordaProvider>
    )
}