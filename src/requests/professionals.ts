'use server'
import { verifySession } from "@/lib/auth/dal"
import { createProfessionalSchemaType } from "@/schemas/professional"

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

async function updateProfessional(updates: Partial<Professional>): Promise<Professional | null> {
    const { session } = await verifySession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/professionals/${updates.id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ ...updates, commissionRate: parseInt(updates.commissionRate as string) }),
        });

        if (!res.ok) return null

        const professional = await res.json();
        return professional
    } catch (err) {
        return null
    }
};
async function deleteProfessional(id: string): Promise<boolean> {
    const { session } = await verifySession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/professionals/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) return false;

        return true
    } catch (err) {
        return false
    }
};
async function createProfessional(newProfessional: Omit<createProfessionalSchemaType, 'id'>): Promise<Professional | null> {
    const { session } = await verifySession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/professionals`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...newProfessional, commissionRate: parseInt(newProfessional.commissionRate as string) }),
        });

        if (!res.ok) throw new Error("Erro ao criar profissional");

        const professional = await res.json();
        return professional
    } catch (err) {
        return null
    }
};
export { getProfessionalsData, updateProfessional, deleteProfessional, createProfessional }