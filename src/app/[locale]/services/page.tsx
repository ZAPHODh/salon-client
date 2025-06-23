import { ProfessionalProvider } from "@/components/providers/professional";
import { ServiceProvider } from "@/components/providers/service";
import { ServicesDataTable } from "@/components/services/service-table";
import { verifySession } from "@/lib/auth/dal";


export default async function ServicesPage() {
    const { session } = await verifySession()
    const [resProf, resService] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/professionals`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.accessToken}`,
            },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/services`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.accessToken}`,
            },
        }),
    ]);
    const [professionals, services] = await Promise.all([
        resProf.json(),
        resService.json(),
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
