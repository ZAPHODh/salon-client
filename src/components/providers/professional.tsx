'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "./session";
import { createProfessionalSchemaType } from "@/schemas/professional";


interface ProfessionalContextProps {
    professionals: Professional[];
    setProfessionals: React.Dispatch<React.SetStateAction<Professional[]>>;
    error: string | null;
    createProfessional: (newProfessional: Omit<createProfessionalSchemaType, 'id'>) => Promise<void>;
    updateProfessional: (updates: Partial<Professional>) => Promise<void>;
    deleteProfessional: (id: string) => Promise<void>;
}

interface ProfessionalProviderProps {
    children: React.ReactNode;
    initialProfessionals?: Professional[];
}

const ProfessionalContext = createContext<ProfessionalContextProps | undefined>(undefined);

export const ProfessionalProvider: React.FC<ProfessionalProviderProps> = ({
    children,
    initialProfessionals = [],
}) => {
    const { session } = useSession()
    const [professionals, setProfessionals] = useState<Professional[]>(initialProfessionals);
    const [error, setError] = useState<string | null>(null);
    const handleApiError = (error: unknown, defaultMessage: string) => {
        const message = error instanceof Error ? error.message : defaultMessage;
        setError(message);
        console.error(message);
        return message;
    };
    const updateProfessional = async (updates: Partial<Professional>) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/professionals/${updates.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...updates, commissionRate: parseInt(updates.commissionRate as string) }),
            });

            if (!res.ok) throw new Error("Erro ao atualizar profissional");

            const professional = await res.json();
            setProfessionals(prev => prev.map(p => (p.id === updates.id ? professional : p)))
        } catch (err) {
            handleApiError(err, "Falha na atualização do profissional");
        }
    };

    const deleteProfessional = async (id: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/professionals/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error("Erro ao excluir profissional");

            setProfessionals(prev => prev.filter(p => p.id !== id));
            setError(null);
        } catch (err) {
            handleApiError(err, "Falha na exclusão do profissional");
        }
    };
    const createProfessional = async (newProfessional: Omit<createProfessionalSchemaType, 'id'>) => {
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
            setProfessionals(prev => [...prev, professional]);
            setError(null);
        } catch (err) {
            handleApiError(err, "Falha ao criar profissional");
        }
    };

    return (
        <ProfessionalContext.Provider
            value={{
                professionals,
                setProfessionals,
                error,
                createProfessional,
                updateProfessional,
                deleteProfessional,
            }}
        >
            {children}
        </ProfessionalContext.Provider>
    );
};

export const useProfessional = () => {
    const context = useContext(ProfessionalContext);
    if (!context) {
        throw new Error("useProfessional deve ser usado dentro de um ProfessionalProvider");
    }
    return context;
};