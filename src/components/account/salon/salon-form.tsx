"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { VisibleHoursInput } from "./visible-hours-input"
import { useState } from "react"
import { PostalCodeInput, type AddressData } from "@/components/ui/postal-code-input"
import { useTranslations } from "next-intl"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { salonConfigSchema, SalonFormValues } from "@/schemas/salon"
import { WorkingHoursInput } from "./working-houts-input"
import { useOnborda } from "onborda"

import { useEffect } from "react"
import Cookies from "js-cookie"
import { countries, defaultVisibleHours, defaultWorkingHours } from "@/lib/helper"
import { updateSalon } from "@/requests/update-salon"
import { useRouter } from "next/navigation"

interface SalonConfigProps {
    initialData?: {
        name?: string
        address?: string
        city?: string
        cep?: string
        workingHours?: TWorkingHours
        visibleHours?: TVisibleHours
        countryCode?: string
    }
}

export interface SalonConfigData {
    name: string
    address: string
    city?: string
    cep: string
    workingHours: TWorkingHours
    visibleHours: TVisibleHours
    countryCode: string
}



export function SalonConfigForm({ initialData }: SalonConfigProps) {
    const { startOnborda } = useOnborda();
    const { refresh } = useRouter()
    const t = useTranslations("salon.config")
    const tPostal = useTranslations("postalCode")
    const tAddress = useTranslations("address")

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [workingHours, setWorkingHours] = useState<TWorkingHours>(initialData?.workingHours || defaultWorkingHours)
    const [visibleHours, setVisibleHours] = useState<TVisibleHours>(initialData?.visibleHours || defaultVisibleHours)
    const [countryCode, setCountryCode] = useState<string>(initialData?.countryCode || "BR")
    const form = useForm<SalonFormValues>({
        resolver: zodResolver(salonConfigSchema),
        defaultValues: {
            name: initialData?.name || "",
            address: initialData?.address || "",
            city: initialData?.city || "",
            cep: initialData?.cep || "",
        },
    })


    const handleAddressFound = (addressData: AddressData) => {
        if (addressData.city) {
            form.setValue("city", addressData.city)
        }
        if (addressData.street) {
            form.setValue("address", addressData.street)
            if (addressData.neighborhood) {
                form.setValue("address", `${addressData.street}, ${addressData.neighborhood}`)
            }
        }
        toast.success(tPostal("lookupSuccess"), {
            description: addressData.street || addressData.city,
        })
    }


    const handleCountryChange = (value: string) => {
        setCountryCode(value)

        form.setValue("cep", "")
    }

    async function handleSubmit(data: SalonFormValues) {
        try {
            setIsSubmitting(true)

            const completeData: SalonFormValues = {
                ...data,
                workingHours,
                visibleHours,
            }
            console.log("Submitting salon data to backend:", completeData)
            const updatedSalon = await updateSalon(completeData)
            if (!updatedSalon) {
                throw new Error(t("toast.errorDescription"))
            }
            toast.success(t("toast.success"), {
                description: t("toast.successDescription"),
            })
            refresh()
        } catch (error) {
            toast.error(t("toast.error"), {
                description: error instanceof Error ? error.message : t("toast.errorDescription"),
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        const hasSeenTour = Cookies.get("salonConfigTourShown")
        if (!hasSeenTour) {
            startOnborda('salonConfig')
            Cookies.set("salonConfigTourShown", "true", { expires: 365 })
        }
    }, [startOnborda])

    return (
        <div className="space-y-6" id="salonConfig">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 p-4 " id="salon-config-card">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">{t("sections.basicInfo")}</h3>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem id="salon-name-input">
                                    <FormLabel>{t("fields.name.label")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t("fields.name.placeholder")} {...field} />
                                    </FormControl>
                                    <FormDescription>{t("fields.name.description")}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-4">
                            <div id="country-select">
                                <label className="text-sm font-medium">{tAddress("country")}</label>
                                <Select value={countryCode} onValueChange={handleCountryChange}>
                                    <SelectTrigger className="mt-1 w-full">
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem key={country.code} value={country.code}>
                                                {country.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <FormField
                                control={form.control}
                                name="cep"
                                render={({ field }) => (
                                    <FormItem id="postal-code-input">
                                        <FormLabel>{tPostal("label")}</FormLabel>
                                        <FormControl>
                                            <PostalCodeInput
                                                countryCode={countryCode}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                                onAddressFound={handleAddressFound}
                                            />
                                        </FormControl>
                                        <FormDescription>{tPostal(`description.${countryCode.toLowerCase()}`)}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("fields.address.label")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t("fields.address.placeholder")} {...field} />
                                        </FormControl>
                                        <FormDescription>{t("fields.address.description")}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{tAddress("city")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={tAddress("city")} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-6" id="working-hours-section">
                        <h3 className="text-lg font-medium">{t("sections.hoursConfig")}</h3>
                        <div className="space-y-6">
                            <WorkingHoursInput initialWorkingHours={workingHours} onChange={setWorkingHours} />
                            <Separator className="my-4" />
                            <VisibleHoursInput initialVisibleHours={visibleHours} onChange={setVisibleHours} />
                        </div>
                    </div>
                    <Button type="submit" disabled={isSubmitting} id="save-config-button" className="w-full md:w-[300px]">
                        {isSubmitting ? t("buttons.saving") : t("buttons.save")}
                    </Button>
                </form>
            </Form>
        </div>
    )
}