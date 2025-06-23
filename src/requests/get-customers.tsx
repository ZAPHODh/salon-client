import { verifySession } from "@/lib/auth/dal"

export async function getCustomerById(id: string): Promise<Customer | undefined> {
    const { session } = await verifySession()

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customers/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.accessToken}`
            },
            next: { revalidate: 60 },
        })

        if (!res.ok) {
            return
        }

        const data = await res.json()
        return data || []
    } catch (error) {
        console.error("Error fetching customer:", error)
        return
    }
}
export async function getCustomers(): Promise<Customer[]> {
    const { session } = await verifySession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customers`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                'Content-Type': 'application/json',
            },
        })

        if (!res.ok) {
            return []
        }

        const data = await res.json()
        return data || []
    } catch (error) {
        console.error("Error fetching customer:", error)
        return []
    }
}

