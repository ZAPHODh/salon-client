'use server';

import { verifySession } from "@/lib/auth/dal";

async function getServicesData(): Promise<Service[]> {
    try {
        const { session } = await verifySession()

        if (!session) {
            return []
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/services`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
            cache: "no-store",
        })

        if (!response.ok) {
            return []
        }

        const data = await response.json()
        return data || []
    } catch (error) {
        console.error("Error fetching services data:", error)
        return []
    }
}

async function updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
    const { session } = await verifySession()

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/services/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.accessToken}`,
            },
            body: JSON.stringify(updates),
        });

        if (!res.ok) return null;

        const updated = await res.json();
        return updated
    } catch (err) {
        return null
    }
};

async function deleteService(id: string) {
    const { session } = await verifySession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/services/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        });
        if (!res.ok) return false
        return true
    } catch (err) {
        return false
    }
};
async function createService(newService: Omit<Service, 'id'>): Promise<Service | null> {
    const { session } = await verifySession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/services`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.accessToken}`,
            },
            body: JSON.stringify(newService),
        });

        if (!res.ok) return null;

        const createdService = await res.json();
        return createdService
    } catch (err) {
        return null
    }
}
export { getServicesData, updateService, deleteService, createService }