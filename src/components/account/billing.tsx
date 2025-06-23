import { CreditCard, Download, FileText, Package, RefreshCw, Settings, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
const invoices = [
    {
        id: "INV-001",
        date: "Mar 1, 2024",
        amount: "$29.00",
        status: "Paid",
    },
    {
        id: "INV-002",
        date: "Feb 1, 2024",
        amount: "$29.00",
        status: "Paid",
    },
    {
        id: "INV-003",
        date: "Jan 1, 2024",
        amount: "$29.00",
        status: "Paid",
    },
];


function Billing() {
    return (
        <div className="container mx-auto px-4 py-6 md:px-6 2xl:max-w-[1400px]">
            <div className="mx-auto max-w-4xl">
                {/* Header */}


                {/* Current Plan */}
                <Card className="mb-8 p-0">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Package className="text-primary size-5" />
                                    <h2 className="text-lg font-semibold">Pro Plan</h2>
                                    <Badge>Current Plan</Badge>
                                </div>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    $29/month • Renews on April 1, 2024
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline">Change Plan</Button>
                                <Button variant="destructive" className="text-white">Cancel Plan</Button>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Zap className="text-primary size-4" />
                                        <span className="text-sm font-medium">Professionals Number</span>
                                    </div>
                                    <span className="text-sm">8 / 10</span>
                                </div>
                                <Progress value={80} className="h-2" />
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <RefreshCw className="text-primary size-4" />
                                        <span className="text-sm font-medium">Services Number</span>
                                    </div>
                                    <span className="text-sm">23 / 50</span>
                                </div>
                                <Progress value={46} className="h-2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="mb-8 p-0">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                            <div className="space-y-1">
                                <h2 className="text-lg font-semibold">Payment Method</h2>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="text-muted-foreground size-4" />
                                    <span className="text-muted-foreground text-sm">
                                        Visa ending in 4242
                                    </span>
                                </div>
                            </div>
                            <Button variant="outline">Update Payment Method</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Billing History */}
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
                </Card>
            </div>
        </div>
    );
}
export { Billing }