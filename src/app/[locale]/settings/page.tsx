import SalonSettingsStepper from "@/components/settings/salon-settings-stepper"
import { redirect } from "@/i18n/navigation"
import { verifySession } from "@/lib/auth/dal"
import { getSalon } from "@/requests/get-salon"
import { getLocale } from "next-intl/server"

export default async function Page() {
    const { session } = await verifySession()
    const locale = await getLocale()
    if (!session) {
        redirect({ href: '/auth/signin', locale })
    }
    const salon = await getSalon()
    if (salon) redirect({ href: 'account', locale })
    return (
        <>
            <SalonSettingsStepper />
        </>
    )
}   