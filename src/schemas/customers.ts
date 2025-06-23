'use client';

import { z } from "zod";
import { FieldConfig } from "@/components/ui/input/generic";
import { createTranslator } from "next-intl";

export const createCustomerSchema = z.object({
    name: z.string().min(1),
    city: z.string().optional(),
    address: z.string().optional(),
    genre: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    birthDay: z.date()
});


export const defaultCustomerValues: z.infer<typeof createCustomerSchema> = {
    name: "",
    city: "",
    address: "",
    genre: "",
    phone: "",
    email: "",
    birthDay: new Date(),
};




export function GetCustomerConfig(locale: string, messages: Record<string, any>) {
    const t = createTranslator({
        locale,
        namespace: "customer.inputConfig",
        messages,
    });

    const config: Record<
        keyof z.infer<typeof createCustomerSchema>,
        FieldConfig<typeof createCustomerSchema>
    > = {
        name: {
            label: t("name.label"),
            placeholder: t("name.placeholder"),
            description: t("name.description"),
            inputType: "text",
        },
        city: {
            label: t("city.label"),
            placeholder: t("city.placeholder"),
            description: t("city.description"),
            inputType: "text",
        },
        address: {
            label: t("address.label"),
            placeholder: t("address.placeholder"),
            description: t("address.description"),
            inputType: "text",
        },
        genre: {
            label: t("genre.label"),
            placeholder: t("genre.placeholder"),
            description: t("genre.description"),
            inputType: "select",
            options: [
                { label: t("genre.options.male"), value: "male" },
                { label: t("genre.options.female"), value: "female" },
                { label: t("genre.options.other"), value: "other" },
            ],
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
        birthDay: {
            label: t("birthDay.label"),
            placeholder: t("birthDay.placeholder"),
            description: t("birthDay.description"),
            inputType: "date",
        },
    };

    return config;
}
