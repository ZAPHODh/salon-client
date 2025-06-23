'use server';


import { ProfessionalProvider } from "@/components/providers/professional";

import { getServerSession } from "@/lib/auth/server-session";

import { redirect } from "next/navigation";


export default async function Layout(props: { children: React.ReactNode }) {
    const session = await getServerSession()
    if (!session) redirect('/auth/signin')
    const professionalsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/professionals`, {
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json',
        },
    })
    const professionalsData = await professionalsResponse.json()
    return (
        <ProfessionalProvider initialProfessionals={professionalsData}>{props.children}</ProfessionalProvider>
    )
}