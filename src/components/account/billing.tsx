import { Package } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";



function Billing({ subscriptionPlan }: { subscriptionPlan: UserSubscriptionPlan }) {
    return (
        <div className="container mx-auto px-4 py-6 md:px-6 2xl:max-w-[1400px]">
            <div className="mx-auto max-w-4xl">
                <Card className="mb-8 p-0">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Package className="text-primary size-5" />
                                    <h2 className="text-lg font-semibold">{subscriptionPlan.isPro ? "Pro" : "Free"}</h2>
                                    <Badge>Assinatura atual</Badge>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {subscriptionPlan.isPro ? <Button variant="destructive" className="text-white">Cancelar assinatura</Button> :
                                    <Button variant="outline">Atualizar para Pro</Button>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* 
                <Card className="mb-8 p-0">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                            <div className="space-y-1">
                                <h2 className="text-lg font-semibold">Método de pagamento</h2>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="text-muted-foreground size-4" />
                                    <span className="text-muted-foreground text-sm">
                                        Visa ending in 4242
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="p-0">
                    <CardContent className="p-6">
                        <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row">
                            <h2 className="text-lg font-semibold">Billing History</h2>
                            <Button variant="outline" size="sm">
                                <Download className="mr-2 size-4" />
                                Download All
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {invoices.map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="flex flex-col items-start justify-between gap-3 border-b py-3 last:border-0 sm:flex-row sm:items-center"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-muted rounded-md p-2">
                                            <FileText className="text-muted-foreground size-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{invoice.id}</p>
                                            <p className="text-muted-foreground text-sm">
                                                {invoice.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant="outline">{invoice.status}</Badge>
                                        <span className="font-medium">{invoice.amount}</span>
                                        <Button variant="ghost" size="sm">
                                            <Download className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card> */}
            </div>
        </div>
    );
}
export { Billing }