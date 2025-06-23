'use server'
import { verifySession } from "@/lib/auth/dal";

const getSalon = async () => {
    const { session } = await verifySession()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/salons`, {
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    });
    if (!res.ok) {
        return null
    }
    const salon: Salon = await res.json();
    return salon
}

export { getSalon }