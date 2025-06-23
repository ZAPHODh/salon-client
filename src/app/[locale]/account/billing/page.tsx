import { AppearanceForm } from "@/components/account/apparence-form";
import { Billing } from "@/components/account/billing";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

export default function Page() {
    const t = useTranslations('account.appearance');

    return (
        <div className="space-y-6">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row">
                <div>
                    <h1 className="text-2xl font-semibold">Billing & Subscription</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage your subscription and billing details
                    </p>
                </div>
            </div>
            <Separator />
            <Billing />
        </div>
    )
}