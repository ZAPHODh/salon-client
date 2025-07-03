"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "./session";
import { createService as createServiceAction, deleteService as deleteServiceAction, updateService as updateServiceAction } from "@/requests/services";

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
            const updated = await updateServiceAction(id, updates)
            if (!updated) throw new Error("Erro ao atualizar serviço.");
            setServices(prev =>
                prev.map(s => (s.id === id ? updated : s))
            );
        } catch (err) {
            console.error(err);
        }
    };
    const deleteService = async (id: string) => {
        try {
            const deleted = await deleteServiceAction(id)
            if (!deleted) throw new Error("Erro ao deletar serviço.");
            setServices(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error(err);
        }
    };
    const createService = async (newService: Omit<Service, 'id'>) => {
        try {
            const createdService = await createServiceAction(newService)

            if (!createdService) throw new Error("Erro ao criar serviço.");
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