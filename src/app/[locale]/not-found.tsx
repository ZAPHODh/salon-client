'use client'

import { NotFound as NotFoundSection, Illustration } from "@/components/ui/not-found"
import { useTranslations } from "next-intl"

export default function NotFound() {
    const t = useTranslations('notfound')
    return (
        <div className="relative flex flex-col w-full justify-center min-h-svh bg-background p-6 md:p-10">
            <div className="relative max-w-5xl mx-auto w-full">
                <Illustration className="absolute inset-0 w-full h-[50vh] opacity-[0.04] dark:opacity-[0.03] text-foreground" />
                <NotFoundSection
                    title={t('title')}
                    description={t('description')}
                    back={t('back')}
                    takemehome={t('home')}
                />
            </div>
        </div>
    )
}


