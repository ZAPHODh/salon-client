// app/[locale]/professionals/loading.tsx
"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function LoadingTable() {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-56" />
                    <Skeleton className="h-4 w-72" />
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between mb-6">
                        <Skeleton className="h-9 w-[300px]" />
                        <Skeleton className="h-9 w-48" />
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {[...Array(6)].map((_, i) => (
                                        <TableHead key={i}>
                                            <Skeleton className="h-4 w-20" />
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[...Array(5)].map((_, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <Skeleton className="h-4 w-40" />
                                                <Skeleton className="h-4 w-32" />
                                            </div>
                                        </TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-14 rounded-full" /></TableCell>
                                        <TableCell className="text-right">
                                            <Skeleton className="h-8 w-8 rounded-md" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="mt-4">
                        <Skeleton className="h-4 w-64" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
