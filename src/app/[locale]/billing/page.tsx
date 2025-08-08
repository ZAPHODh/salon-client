import { AlertTriangleIcon } from "lucide-react";
import { BillingForm } from "@/components/billing-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { verifySession } from "@/lib/auth/dal";
import { redirect } from "next/navigation";
import { getUserSubscriptionPlan, stripe } from "@/lib/payment";

export default async function Billing() {
    const { session } = await verifySession();
    if (!session) redirect('/auth/signin')
    const subscriptionPlan = await getUserSubscriptionPlan(session.user.id as string);

    let isCanceled = false;
    if (subscriptionPlan.isPro && subscriptionPlan.stripeSubscriptionId) {
        const stripePlan = await stripe.subscriptions.retrieve(
            String(subscriptionPlan.stripeSubscriptionId)
        );
        isCanceled = stripePlan.cancel_at_period_end;
    }
    return (
        <div className="space-y-8">
            <BillingForm
                subscriptionPlan={{
                    ...subscriptionPlan,
                    isCanceled,
                }}
            />
        </div>
    );
}