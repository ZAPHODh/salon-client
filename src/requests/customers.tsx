'use server';

import { verifySession } from "@/lib/auth/dal"

async function getCustomerById(id: string): Promise<Customer | undefined> {
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
async function getCustomers(): Promise<Customer[]> {
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

async function updateCustomer(updates: Partial<Customer>): Promise<Customer | null> {
    const { session } = await verifySession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customers/${updates.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.accessToken}`,
            },
            body: JSON.stringify(updates),
        });

        if (!res.ok) return null;

        const customer = await res.json();
        return customer
    } catch (err) {
        return null
    }
};

async function deleteCustomer(id: string) {
    const { session } = await verifySession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customers/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            }
        });

        if (!res.ok) return false;

        return true
    } catch (err) {
        return false
    }
};

async function createCustomer(newCustomer: Omit<Customer, 'id' | 'salonId' | 'createdAt' | 'slug'>): Promise<Customer | null> {
    const { session } = await verifySession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.accessToken}`,
            },
            body: JSON.stringify(newCustomer),
        });

        if (!res.ok) return null

        const customer = await res.json();
        return customer
    } catch (err) {
        return null
    }
};

export { createCustomer, deleteCustomer, getCustomerById, getCustomers, updateCustomer }