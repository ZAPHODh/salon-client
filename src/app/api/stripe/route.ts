import { revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { proPlan } from "@/config/subscriptions";
import { verifySession } from "@/lib/auth/dal";
import { getLocale } from "next-intl/server";
import { getUserSubscriptionPlan, stripe } from "@/lib/payment";

export async function GET(req: NextRequest) {
    const locale = await getLocale()
    const currency = locale === 'pt' ? 'brl' : 'usd'
    const billingUrl = siteConfig(locale).url + "/account/billing/";
    try {
        const { session } = await verifySession();
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        const subscriptionPlan = await getUserSubscriptionPlan(session.user.id);
        // The user is on the pro plan.
        // Create a portal session to manage subscription.
        if (subscriptionPlan.isPro && subscriptionPlan.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: subscriptionPlan.stripeCustomerId as string,
                return_url: billingUrl,
            });

            return Response.json({ url: stripeSession.url });
        }

        // The user is on the free plan.
        // Create a checkout session to upgrade.
        const stripeSession = await stripe.checkout.sessions.create({
            success_url: billingUrl,
            cancel_url: billingUrl,
            currency: currency,
            payment_method_types: ["card"],
            mode: "subscription",
            phone_number_collection: { enabled: true },
            customer_email: session.email!,
            line_items: [
                {
                    price: proPlan.stripePriceId,
                    quantity: 1,
                },
            ],
            metadata: {
                userId: session.user.id,
            },
        });
        revalidatePath(`account/billing`);
        return new Response(JSON.stringify({ url: stripeSession.url }));
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 });
        }

        return new Response(null, { status: 500 });
    }
}