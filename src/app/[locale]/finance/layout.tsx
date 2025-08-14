import { FinancialProvider } from "@/components/providers/financial";
import { ProfessionalProvider } from "@/components/providers/professional";
import { ServiceProvider } from "@/components/providers/service";
import { redirect } from "@/i18n/navigation";
import { verifySession } from "@/lib/auth/dal";
import { getUserSubscriptionPlan } from "@/lib/payment";
import { getProfessionalsData } from "@/requests/professionals";
import { getServicesData } from "@/requests/services";
import { getLocale } from "next-intl/server";


export default async function Layout(props: { children: React.ReactNode }) {
    const locale = await getLocale()
    const { session } = await verifySession();
    if (!session || !session.user) {
        redirect({ href: "/auth/signin", locale })
        return null;
    }
    const { isPro } = await getUserSubscriptionPlan(session.user.id)
    if (!isPro) {
        redirect({ href: '/account/billing', locale })
        return null;
    }
    const [professionalsData, servicesData] = await Promise.all([
        getProfessionalsData(),
        getServicesData(),
    ])
    return (
        <FinancialProvider>
            <ProfessionalProvider initialProfessionals={professionalsData}>
                <ServiceProvider initialServices={servicesData}>{props.children}</ServiceProvider>
            </ProfessionalProvider>
        </FinancialProvider>
    )
}