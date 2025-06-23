"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Button, buttonVariants } from "../ui/button"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { useTheme } from "next-themes"
import { useFont } from "../providers/font"
import { useTranslations } from "next-intl"

export function AppearanceForm() {
    const t = useTranslations('account.appearance.appearanceForm')
    const { setTheme } = useTheme()
    const { font, setFont } = useFont()
    const defaultValues: Partial<AppearanceFormValues> = {
        font,
        theme: "light",
    }
    const appearanceFormSchema = z.object({
        theme: z.enum(["light", "dark"], {
            required_error: t('errors.theme'),
        }),
        font: z.string({
            required_error: t('errors.font'),
        }),
    })
    type AppearanceFormValues = z.infer<typeof appearanceFormSchema>
    const form = useForm<AppearanceFormValues>({
        resolver: zodResolver(appearanceFormSchema),
        defaultValues,
    })

    function onSubmit(data: AppearanceFormValues) {
        setTheme(data.theme)
        setFont(data.font)

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="font"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('labels.font')}</FormLabel>
                            <div className="relative w-max">
                                <FormControl>
                                    <select
                                        className={cn(
                                            buttonVariants({ variant: "outline" }),
                                            "w-[200px] appearance-none font-normal"
                                        )}
                                        {...field}
                                    >
                                        <option value="geist">Geist</option>
                                        <option value="inter">Inter</option>
                                        <option value="manrope">Manrope</option>
                                    </select>
                                </FormControl>
                                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                            </div>
                            <FormDescription>
                                {t('descriptions.font')}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel>{t('labels.theme')}</FormLabel>
                            <FormDescription>
                                {t('descriptions.theme')}
                            </FormDescription>
                            <FormMessage />
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid max-w-md grid-cols-2 gap-8 pt-2"
                            >
                                <FormItem>
                                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary flex flex-col md:flex-row">
                                        <FormControl>
                                            <RadioGroupItem value="light" className="sr-only" />
                                        </FormControl>
                                        <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent ">
                                            <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                                                <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                                                    <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                                </div>
                                                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                                                    <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                                </div>
                                                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                                                    <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="block w-full p-2 text-center font-normal">
                                            {t('options.theme.light')}
                                        </span>
                                    </FormLabel>
                                </FormItem>
                                <FormItem>
                                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary flex flex-col md:flex-row">
                                        <FormControl>
                                            <RadioGroupItem value="dark" className="sr-only" />
                                        </FormControl>
                                        <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                                            <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                                                <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                                    <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                                </div>
                                                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                                    <div className="h-4 w-4 rounded-full bg-slate-400" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                                </div>
                                                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                                    <div className="h-4 w-4 rounded-full bg-slate-400" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="block w-full p-2 text-center font-normal">
                                            {t('options.theme.dark')}
                                        </span>
                                    </FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormItem>
                    )}
                />
                <Button type="submit">{t('buttons.update')}</Button>
            </form>
        </Form>
    )
}