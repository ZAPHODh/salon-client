// app/[locale]/account/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function Loading() {
    return (
        <div className="space-y-6 p-4 lg:p-10 pb-16 md:block">
            <div className="space-y-0.5">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-72" />
            </div>

            <Separator className="my-6" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-3 lg:w-1/5 space-y-2">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-9 w-full" />
                    ))}
                </aside>
                <div className="flex-1 lg:max-w-2xl lg:px-6 space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
            </div>
        </div>
    )
}
