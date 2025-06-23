"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Package, TrendingUp, ShoppingCart } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts"
import { useFinancial } from "../providers/financial"

interface ProductFinancialsProps {
    dateRange: { from: Date; to: Date }
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function ProductFinancials({ dateRange }: ProductFinancialsProps) {
    const { sales } = useFinancial()
    const productStats = new Map()
    const serviceStats = new Map()

    sales.forEach((sale) => {
        sale.items?.forEach((item) => {
            if (item.product) {
                const key = item.product.id
                if (!productStats.has(key)) {
                    productStats.set(key, {
                        id: key,
                        name: item.product.name,
                        revenue: 0,
                        quantity: 0,
                        salesCount: 0,
                    })
                }
                const stats = productStats.get(key)
                stats.revenue += item.total
                stats.quantity += item.quantity
                stats.salesCount += 1
            }

            if (item.service) {
                const key = item.service.id
                if (!serviceStats.has(key)) {
                    serviceStats.set(key, {
                        id: key,
                        name: item.service.name,
                        revenue: 0,
                        quantity: 0,
                        salesCount: 0,
                    })
                }
                const stats = serviceStats.get(key)
                stats.revenue += item.total
                stats.quantity += item.quantity
                stats.salesCount += 1
            }
        })
    })

    const products = Array.from(productStats.values()).sort((a, b) => b.revenue - a.revenue)
    const services = Array.from(serviceStats.values()).sort((a, b) => b.revenue - a.revenue)

    const totalProductRevenue = products.reduce((sum, product) => sum + product.revenue, 0)
    const totalServiceRevenue = services.reduce((sum, service) => sum + service.revenue, 0)
    const totalRevenue = totalProductRevenue + totalServiceRevenue

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    // Prepare chart data
    const revenueDistribution = [
        { name: "Produtos", value: totalProductRevenue },
        { name: "Serviços", value: totalServiceRevenue },
    ]

    const topProducts = products.slice(0, 8)
    const topServices = services.slice(0, 8)

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receita Produtos</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalProductRevenue)}</div>
                        <p className="text-xs text-muted-foreground">{products.length} produtos vendidos</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receita Serviços</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalServiceRevenue)}</div>
                        <p className="text-xs text-muted-foreground">{services.length} serviços prestados</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Produto Top</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold truncate">{products.length > 0 ? products[0].name : "N/A"}</div>
                        <p className="text-xs text-muted-foreground">
                            {products.length > 0 ? formatCurrency(products[0].revenue) : "R$ 0,00"}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Serviço Top</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold truncate">{services.length > 0 ? services[0].name : "N/A"}</div>
                        <p className="text-xs text-muted-foreground">
                            {services.length > 0 ? formatCurrency(services[0].revenue) : "R$ 0,00"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Distribuição de Receita</CardTitle>
                        <CardDescription>Produtos vs Serviços</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {totalRevenue > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={revenueDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {revenueDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                Nenhuma venda registrada
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Produtos</CardTitle>
                        <CardDescription>Produtos mais vendidos por receita</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {topProducts.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={topProducts} layout="horizontal">
                                    <XAxis type="number" tickFormatter={formatCurrency} />
                                    <YAxis dataKey="name" type="category" width={80} />
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    <Bar dataKey="revenue" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                Nenhum produto vendido
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Lists */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Ranking de Produtos</CardTitle>
                        <CardDescription>Produtos ordenados por faturamento</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topProducts.length === 0 ? (
                                <div className="text-center py-4 text-muted-foreground">Nenhum produto vendido</div>
                            ) : (
                                topProducts.map((product, index) => (
                                    <div key={product.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                                                {index + 1}
                                            </Badge>
                                            <div>
                                                <p className="text-sm font-medium">{product.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {product.quantity} unidades • {product.salesCount} vendas
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{formatCurrency(product.revenue)}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatCurrency(product.revenue / product.quantity)} por unidade
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ranking de Serviços</CardTitle>
                        <CardDescription>Serviços ordenados por faturamento</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topServices.length === 0 ? (
                                <div className="text-center py-4 text-muted-foreground">Nenhum serviço prestado</div>
                            ) : (
                                topServices.map((service, index) => (
                                    <div key={service.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                                                {index + 1}
                                            </Badge>
                                            <div>
                                                <p className="text-sm font-medium">{service.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {service.quantity} prestações • {service.salesCount} vendas
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{formatCurrency(service.revenue)}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatCurrency(service.revenue / service.quantity)} por prestação
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
