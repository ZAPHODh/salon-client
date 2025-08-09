
import { BillingForm } from "@/components/billing-form";
import { Separator } from "@/components/ui/separator";
import { redirect } from "@/i18n/navigation";
import { verifySession } from "@/lib/auth/dal";
import { getUserSubscriptionPlan, stripe } from "@/lib/payment";
import { getLocale } from "next-intl/server";

export default async function Page() {
    const { session } = await verifySession();
    const locale = await getLocale()
    if (!session) redirect({ href: '/auth/signin', locale })
    const subscriptionPlan = await getUserSubscriptionPlan(session?.user.id as string);

    let isCanceled = false;
    if (subscriptionPlan.isPro && subscriptionPlan.stripeSubscriptionId) {
        const stripePlan = await stripe.subscriptions.retrieve(
            String(subscriptionPlan.stripeSubscriptionId)
        );
        isCanceled = stripePlan.cancel_at_period_end;
    }
    return (
        <div className="space-y-6">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row">
                <div>
                    <h1 className="text-2xl font-semibold">Assnaturas</h1>
                    <p className="text-muted-foreground text-sm">
                        Gerencie sua assinatura e informações de pagamento aqui.
                    </p>
                </div>
            </div>
            <Separator />
            <BillingForm
                subscriptionPlan={{
                    ...subscriptionPlan,
                    isCanceled,
                }}
            />
        </div>
    )
}