'use client';

import { createContext, useContext, useState } from "react";
import { useSession } from "./session";

interface CustomerContextProps {
    customers: Customer[];
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
    error: string | null;
    createCustomer: (newCustomer: Omit<Customer, 'id' | 'salonId' | 'createdAt'>) => Promise<void>;
    updateCustomer: (updates: Partial<Customer>) => Promise<void>;
    deleteCustomer: (id: string) => Promise<void>;
}

interface CustomerProviderProps {
    children: React.ReactNode;
    initialCustomers?: Customer[];
}

const CustomerContext = createContext<CustomerContextProps | undefined>(undefined);

export const CustomerProvider: React.FC<CustomerProviderProps> = ({
    children,
    initialCustomers = []
}) => {
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
    const { session } = useSession()
    const [error, setError] = useState<string | null>(null);

    const handleApiError = (error: unknown, defaultMessage: string) => {
        const message = error instanceof Error ? error.message : defaultMessage;
        setError(message);
        console.error(message);
        return message;
    };

    const updateCustomer = async (updates: Partial<Customer>) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customers/${updates.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(updates),
            });

            if (!res.ok) throw new Error("Erro ao atualizar cliente");

            const { customer } = await res.json();
            setCustomers(prev => prev.map(c => (c.id === updates.id ? customer : c)));
        } catch (err) {
            handleApiError(err, "Falha na atualização do cliente");
        }
    };

    const deleteCustomer = async (id: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customers/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                }
            });

            if (!res.ok) throw new Error("Erro ao excluir cliente");

            setCustomers(prev => prev.filter(c => c.id !== id));
            setError(null);
        } catch (err) {
            handleApiError(err, "Falha na exclusão do cliente");
        }
    };
    const createCustomer = async (newCustomer: Omit<Customer, 'id' | 'salonId' | 'createdAt'>) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(newCustomer),
            });

            if (!res.ok) throw new Error("Erro ao criar cliente");

            const customer = await res.json();
            setCustomers(prev => [...prev, customer]);
            setError(null);
        } catch (err) {
            handleApiError(err, "Falha ao criar cliente");
        }
    };
    return (
        <CustomerContext.Provider
            value={{
                customers,
                setCustomers,
                error,
                createCustomer,
                updateCustomer,
                deleteCustomer,
            }}
        >
            {children}
        </CustomerContext.Provider>
    );
};

export const useCustomer = () => {
    const context = useContext(CustomerContext);
    if (!context) {
        throw new Error("useCustomer deve ser usado dentro de um CustomerProvider");
    }
    return context;
};