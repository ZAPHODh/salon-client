"use client"

import { DailyCashFlow } from "@/components/finance/daily-cash-flow"
import { Skeleton } from "@/components/ui/skeleton"


export default function DailyCashFlowPage() {
    return (
        <Skeleton className="container mx-auto py-4 px-4 sm:py-6">
            <Skeleton className="space-y-4">
                <Skeleton>
                    <Skeleton className="text-2xl sm:text-3xl font-bold tracking-tight" />
                    <Skeleton className="text-muted-foreground" />
                </Skeleton>
            </Skeleton>
        </Skeleton>
    )
}
