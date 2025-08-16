"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Loading() {
    return (
        <div className="container mx-auto py-4 px-4 sm:py-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <div>
                    <Skeleton className="h-6 sm:h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <Skeleton className="h-9 w-56" />
                    <Skeleton className="h-9 w-24" />
                </div>
            </div>
            <div className="overflow-x-auto">
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList className="grid w-max grid-cols-4 min-w-full md:w-full">
                        {[...Array(5)].map((_, i) => (
                            <TabsTrigger
                                key={i}
                                value={`tab-${i}`}
                                disabled
                                className="flex items-center whitespace-nowrap px-3 py-2"
                            >
                                <Skeleton className="h-4 w-20" />
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                        <Skeleton className="h-40 w-full rounded-lg" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-28 w-full rounded-lg" />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
