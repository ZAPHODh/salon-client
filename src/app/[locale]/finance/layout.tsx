import { FinancialProvider } from "@/components/providers/financial";
import { ProfessionalProvider } from "@/components/providers/professional";
import { ServiceProvider } from "@/components/providers/service";

import getFinancialData from "@/requests/get-financial-data";

import { redirect } from "next/navigation";

export default async function Layout(props: { children: React.ReactNode }) {
    redirect('/professionals')
    // const [financialData, professionalsData, servicesData] = await Promise.all([
    //     getFinancialData(),
    //     getProfessionalsData(),
    //     getServicesData(),
    // ])
    // return (
    //     <FinancialProvider initialData={financialData}>
    //         <ProfessionalProvider initialProfessionals={professionalsData}>
    //             <ServiceProvider initialServices={servicesData}>{props.children}</ServiceProvider>
    //         </ProfessionalProvider>
    //     </FinancialProvider>
    // )
}