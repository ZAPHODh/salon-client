import { ProfessionalProvider } from "@/components/providers/professional";
import { ServiceProvider } from "@/components/providers/service";
import { ServicesDataTable } from "@/components/services/service-table";
import { redirect } from "@/i18n/navigation";
import { verifySession } from "@/lib/auth/dal";
import { getProfessionalsData } from "@/requests/professionals";
import { getServicesData } from "@/requests/services";
import { getLocale } from "next-intl/server";


export default async function ServicesPage() {
    const { session } = await verifySession()
    const locale = await getLocale()
    if (!session) {
        redirect({ href: '/auth/signin', locale })
        return null;
    }
    const [professionals, services] = await Promise.all([
        getProfessionalsData(),
        getServicesData()
    ]);

    return (
        <ProfessionalProvider initialProfessionals={professionals}>
            <ServiceProvider initialServices={services}>
                <div className="container mx-auto py-4 px-4 sm:py-6">
                    <ServicesDataTable />
                </div>
            </ServiceProvider>
        </ProfessionalProvider>
    )
}
