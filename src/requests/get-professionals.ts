'use server'
import { verifySession } from "@/lib/auth/dal"

async function getProfessionalsData(): Promise<Professional[]> {
    try {
        const { session } = await verifySession()

        if (!session) {
            return []
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/professionals`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
            cache: "no-store",
        })

        if (!response.ok) {
            return []
        }

        const data = await response.json()
        return data || []
    } catch (error) {
        console.error("Error fetching professionals data:", error)
        return []
    }
}
export { getProfessionalsData }