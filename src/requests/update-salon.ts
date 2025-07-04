'use server';
import { verifySession } from "@/lib/auth/dal";
import { SalonFormValues } from "@/schemas/salon";
async function updateSalon(data: SalonFormValues) {
    const { session } = await verifySession()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/salons`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        return null;
    }
    const updatedSalon = await res.json();
    return updatedSalon;
}

export { updateSalon }