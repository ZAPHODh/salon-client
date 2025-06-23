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
    Home,
    FileText,
    TrendingUp,
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

type AppFeature = {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    color: string;
    functionalities: string[];
    image?: string;
};

const appFeatures: AppFeature[] = [
    {
        id: "agendamentos",
        name: "Agendamentos",
        description:
            "Sistema completo de agendamento online com confirmação automática, lembretes por SMS/e-mail e integração com calendários.",
        icon: CalendarCheck,
        color: "text-blue-500",
        functionalities: [
            "Agendamento online 24 horas",
            "Lembretes automáticos para clientes",
            "Bloqueio de horários indisponíveis",
            "Integração com Google Calendar e Outlook",
        ],
        image: AppointmentImage.src,
    },
    {
        id: "financeiro",
        name: "Financeiro",
        description:
            "Controle financeiro completo com relatórios detalhados, gestão de despesas e acompanhamento de métricas-chave.",
        icon: DollarSign,
        color: "text-green-500",
        functionalities: [
            "Controle de fluxo de caixa em tempo real",
            "Geração automática de relatórios financeiros",
            "Integração com sistemas contábeis",
            "Gestão de comissões para profissionais",
        ],
        image: FinanceImage.src,
    },
    {
        id: "profissionais",
        name: "Profissionais",
        description:
            "Gestão completa da equipe com controle de agenda, especialidades e desempenho individual.",
        icon: Users,
        color: "text-purple-500",
        functionalities: [
            "Perfis personalizados para cada profissional",
            "Controle de disponibilidade e folgas",
            "Acompanhamento de produtividade",
            "Sistema de avaliação de clientes",
        ],
        image: ProfessionalImage.src,
    },
    {
        id: "servicos",
        name: "Serviços",
        description:
            "Catálogo digital de serviços com gestão de preços, duração e recursos necessários para cada procedimento.",
        icon: Scissors,
        color: "text-pink-500",
        functionalities: [
            "Cadastro ilimitado de serviços e pacotes",
            "Fotos antes/depois dos procedimentos",
            "Controle de estoque de produtos",
            "Sugestão de serviços personalizados",
        ],
        image: ServiceImage.src,
    },
    {
        id: "relatorios",
        name: "Relatórios",
        description:
            "Análises detalhadas e personalizáveis para acompanhar o desempenho do salão em tempo real.",
        icon: FileText,
        color: "text-red-500",
        functionalities: [
            "Relatórios de clientes frequentes",
            "Análise de horários mais populares",
            "Desempenho por serviço/profissional",
            "Exportação para Excel e PDF",
        ],
        image: ReportImage.src,
    },
];

export default function SalonFeaturesSection() {
    const [activeFeature, setActiveFeature] = useState<string>(appFeatures[0].id);
    const currentFeature = appFeatures.find(f => f.id === activeFeature) || appFeatures[0];

    return (
        <section className="py-24">
            <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
                <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
                    <div className="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm">
                        Funcionalidades
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Tudo que Você Precisa para Gerir Seu Salão
                    </h2>
                    <p className="text-muted-foreground">
                        Nossa plataforma oferece todas as ferramentas necessárias para
                        gerenciar seu salão com eficiência e proporcionar a melhor
                        experiência para seus clientes.
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
                                    <SelectValue placeholder="Selecione uma funcionalidade" />
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
                                <h4 className="font-medium">Principais Recursos:</h4>
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
                                        alt={`Imagem ilustrativa para ${currentFeature.name}`}
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

                <div className="mt-16 text-center">
                    <p className="text-muted-foreground mx-auto mb-6 max-w-2xl">
                        Pronto para revolucionar a gestão do seu salão de beleza?
                    </p>
                    <Button asChild size="lg">
                        <Link href="/agendamento">Experimente Grátis</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}