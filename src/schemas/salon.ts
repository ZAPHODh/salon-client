import { z } from "zod"

export const salonConfigSchema = z.object({
    name: z.string().min(1, "Nome do salão é obrigatório"),
    address: z.string().min(1, "Endereço é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    countryCode: z.string().min(1, "País é obrigatório"),
    cep: z.string().min(1, "CEP é obrigatório"),
    workingHours: z.record(
        z.object({
            from: z.number(),
            to: z.number(),
        }),
    ),
    visibleHours: z.object({
        from: z.number(),
        to: z.number(),
    }),
})

export type SalonFormValues = z.infer<typeof salonConfigSchema>

export function formatPostalCode(value: string, countryCode: string): string {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, "")

    if (countryCode === "BR") {
        // Brazilian CEP format: 00000-000
        if (numbers.length <= 5) {
            return numbers
        }
        return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
    }

    // Default format for other countries
    return numbers
}
