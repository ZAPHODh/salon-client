'use client';

import { z } from "zod";

import { FieldConfig } from "@/components/ui/input/generic";
import { createTranslator } from "next-intl";

export const createProfessionalSchema = z.object({
    name: z.string().min(1),
    category: z.string().min(1),
    cpf: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    commissionRate: z.string().min(1),
});
export type createProfessionalSchemaType = z.infer<typeof createProfessionalSchema>;
export const defaultProfessionalValues: createProfessionalSchemaType = {
    name: "",
    category: "hair",
    cpf: "",
    phone: "",
    email: "",
    commissionRate: "",
};

export function GetProfessionalConfig(locale: string, messages: Record<string, any>) {
    const t = createTranslator({
        locale, messages,
        namespace: "professional.inputConfig"
    });

    const config: Record<
        keyof z.infer<typeof createProfessionalSchema>,
        FieldConfig<typeof createProfessionalSchema>
    > = {
        name: {
            label: t("name.label"),
            placeholder: t("name.placeholder"),
            description: t("name.description"),
            inputType: "text",
        },
        category: {
            label: t("category.label"),
            placeholder: t("category.placeholder"),
            description: t("category.description"),
            inputType: "select",
            options: [
                { label: t("category.options.hair"), value: "hair" },
                { label: t("category.options.nail"), value: "nail" },
            ],
        },
        cpf: {
            label: t("cpf.label"),
            placeholder: t("cpf.placeholder"),
            description: t("cpf.description"),
            inputType: "text",
        },
        phone: {
            label: t("phone.label"),
            placeholder: t("phone.placeholder"),
            description: t("phone.description"),
            inputType: "text",
        },
        email: {
            label: t("email.label"),
            placeholder: t("email.placeholder"),
            description: t("email.description"),
            inputType: "text",
        },
        commissionRate: {
            label: t("commissionRules.label"),
            placeholder: t("commissionRules.placeholder"),
            description: t("commissionRules.description"),
            inputType: "text",
        },
    };

    return config;
}