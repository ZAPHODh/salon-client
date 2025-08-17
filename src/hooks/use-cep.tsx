'use client';

import { useState } from "react"

type AddressData = {
    street: string
    neighborhood: string
    city: string
    state: string
}

export function useCep() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAddress = async (cep: string): Promise<AddressData | null> => {
        const cleanCep = cep.replace(/\D/g, "")
        if (cleanCep.length !== 8) {
            setError("CEP inválido")
            return null
        }

        try {
            setIsLoading(true)
            setError(null)

            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
            if (!response.ok) throw new Error("Erro na requisição")

            const data = await response.json()
            if ("erro" in data) {
                setError("CEP não encontrado")
                return null
            }

            return {
                street: data.logradouro || "",
                neighborhood: data.bairro || "",
                city: data.localidade || "",
                state: data.uf || "",
            }
        } catch (err) {
            setError("Erro ao consultar CEP")
            return null
        } finally {
            setIsLoading(false)
        }
    }

    return { fetchAddress, isLoading, error }
}
