"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "./session";

interface ServiceContextProps {
    services: Service[];
    createService: (newService: Omit<Service, 'id'>) => Promise<void>;
    updateService: (id: string, updates: Partial<Service>) => Promise<void>;
    deleteService: (id: string) => Promise<void>;
}

const ServiceContext = createContext<ServiceContextProps | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode, initialServices: Service[] }> = ({ children, initialServices }) => {
    const [services, setServices] = useState<Service[]>(initialServices);
    const { session } = useSession();
    const updateService = async (id: string, updates: Partial<Service>) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/services/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(updates),
            });

            if (!res.ok) throw new Error("Erro ao atualizar serviço.");

            const updated = await res.json();
            setServices(prev =>
                prev.map(s => (s.id === id ? updated.service : s))
            );
        } catch (err) {
            console.error(err);
        }
    };

    const deleteService = async (id: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/services/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            });

            if (!res.ok) throw new Error("Erro ao deletar serviço.");

            setServices(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error(err);
        }
    };
    const createService = async (newService: Omit<Service, 'id'>) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/services`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(newService),
            });

            if (!res.ok) throw new Error("Erro ao criar serviço.");

            const createdService = await res.json();
            setServices(prev => [...prev, createdService]);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <ServiceContext.Provider
            value={{
                services,
                createService,
                updateService,
                deleteService,
            }}
        >
            {children}
        </ServiceContext.Provider>
    );
};

export const useService = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error("useService deve ser usado dentro de um ServiceProvider");
    }
    return context;
};