import { FinancialProvider } from "@/components/providers/financial";
import { ProfessionalProvider } from "@/components/providers/professional";
import { ServiceProvider } from "@/components/providers/service";
import { getProfessionalsData } from "@/requests/professionals";
import { getServicesData } from "@/requests/services";


export default async function Layout(props: { children: React.ReactNode }) {
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