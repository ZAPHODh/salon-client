"use client";

import AppointmentImage from '@/../public/assets/appointment.png'
import FinanceImage from '@/../public/assets/finance.png'
import ProfessionalImage from '@/../public/assets/professional.png'
import ServiceImage from '@/../public/assets/service.png'
import ReportImage from '@/../public/assets/reports.png'
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    CalendarCheck,
    DollarSign,
    Users,
    Scissors,
    FileText,
    Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTranslations } from 'next-intl';

type AppFeature = {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    color: string;
    functionalities: string[];
    image?: string;
};


export default function SalonFeaturesSection() {
    const t = useTranslations("hero.featuresSection");
    const [activeFeature, setActiveFeature] = useState<string>("agendamentos");

    const getFeatureData = (featureId: string) => {
        return {
            name: t(`features.${featureId}.name`),
            description: t(`features.${featureId}.description`),
            functionalities: t.raw(`features.${featureId}.functionalities`) as string[]
        };
    };

    const appFeatures: AppFeature[] = [
        {
            id: "agendamentos",
            ...getFeatureData("agendamentos"),
            icon: CalendarCheck,
            color: "text-blue-500",
            image: AppointmentImage.src,
        },
        {
            id: "financeiro",
            ...getFeatureData("financeiro"),
            icon: DollarSign,
            color: "text-green-500",
            image: FinanceImage.src,
        },
        {
            id: "profissionais",
            ...getFeatureData("profissionais"),
            icon: Users,
            color: "text-purple-500",
            image: ProfessionalImage.src,
        },
        {
            id: "servicos",
            ...getFeatureData("servicos"),
            icon: Scissors,
            color: "text-pink-500",
            image: ServiceImage.src,
        },
        {
            id: "relatorios",
            ...getFeatureData("relatorios"),
            icon: FileText,
            color: "text-red-500",
            image: ReportImage.src,
        },
    ];

    const currentFeature = appFeatures.find(f => f.id === activeFeature) || appFeatures[0];

    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
                <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
                    <div className="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm">
                        {t('subtitle')}
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                        {t('title')}
                    </h2>
                    <p className="text-muted-foreground">
                        {t('description')}
                    </p>
                </div>

                <Tabs
                    value={activeFeature}
                    onValueChange={setActiveFeature}
                    className="space-y-8"
                >
                    <div className="mb-8 flex justify-center">
                        <div className="w-full md:hidden">
                            <Select value={activeFeature} onValueChange={setActiveFeature}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t('selectPlaceholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {appFeatures.map((feature) => (
                                        <SelectItem key={feature.id} value={feature.id}>
                                            <div className="flex items-center gap-2">
                                                <feature.icon className={cn("h-4 w-4", feature.color)} />
                                                <span>{feature.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <TabsList className="hidden h-auto bg-transparent p-1 md:flex flex-wrap justify-center">
                            {appFeatures.map((feature) => (
                                <TabsTrigger
                                    key={feature.id}
                                    value={feature.id}
                                    className={cn(
                                        "data-[state=active]:bg-muted gap-2 m-1",
                                        "data-[state=active]:border-border border border-transparent"
                                    )}
                                >
                                    <feature.icon className={cn("h-4 w-4", feature.color)} />
                                    <span>{feature.name}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <div className="grid items-center gap-8 md:grid-cols-12">
                        <div className="space-y-6 md:col-span-6">
                            <div className="mb-4 flex items-center gap-4">
                                <div className={cn("rounded-xl p-2.5", "bg-muted")}>
                                    <currentFeature.icon
                                        className={cn("h-7 w-7", currentFeature.color)}
                                    />
                                </div>
                                <h3 className="text-2xl font-bold">{currentFeature.name}</h3>
                            </div>

                            <p className="text-muted-foreground text-lg">
                                {currentFeature.description}
                            </p>

                            <div className="space-y-3 pt-2">
                                <h4 className="font-medium">{t('featureLabel')}</h4>
                                <ul className="space-y-2">
                                    {currentFeature.functionalities.map((func, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <Smartphone
                                                className={cn("mt-0.5 h-5 w-5", currentFeature.color)}
                                            />
                                            <span>{func}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="md:col-span-6">
                            {currentFeature.image ? (
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <Image
                                        src={currentFeature.image}
                                        alt={`${currentFeature.name} feature`}
                                        fill
                                        className="object-cover"
                                    />

                                    <div className="absolute right-0 bottom-0 left-0 p-6">
                                        <div
                                            className={cn(
                                                "inline-block rounded-lg px-3 py-1 text-sm text-white",
                                                "bg-black/30 backdrop-blur-sm"
                                            )}
                                        >
                                            {currentFeature.name}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-muted flex aspect-[4/3] items-center justify-center rounded-xl">
                                    <currentFeature.icon
                                        className={cn(
                                            "h-24 w-24",
                                            currentFeature.color,
                                            "opacity-25"
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </Tabs>
            </div>
        </section>
    );
}