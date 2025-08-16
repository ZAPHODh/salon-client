'use server';

import { SalonConfigForm } from "@/components/account/salon/salon-form"
import { Separator } from "@/components/ui/separator"

import { redirect } from "@/i18n/navigation";
import { verifySession } from "@/lib/auth/dal";

import { getLocale } from "next-intl/server";



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
        <div className="space-y-6" >
            <div>
                <h3 className="text-lg font-medium" >Configurações do salão</h3>
                < p className="text-sm text-muted-foreground" >
                    Configure as informações do seu salão, como nome, descrição, horário de funcionamento e outros detalhes importantes.
                </p>
            </div>
            < Separator />
            <SalonConfigForm initialData={res.ok && data} />
        </div>
    )
}