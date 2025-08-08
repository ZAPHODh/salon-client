import Stripe from "stripe";
import { freePlan, proPlan } from "@/config/subscriptions";
import { verifySession } from "./auth/dal";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-04-30.basil",
    typescript: true,
});

export async function getUserSubscriptionPlan(
    userId: string
): Promise<UserSubscriptionPlan> {
    const { session } = await verifySession();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subscriptions/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.accessToken}`,
        }
    })
    if (!response.ok) {
        throw new Error("Failed to fetch user subscription plan");
    }
    const user = await response.json()
    if (!user) {
        throw new Error("User not found");
    }

    const isPro = Boolean(
        user.stripePriceId &&
        user.stripeCurrentPeriodEnd?.getTime()! + 86_400_000 > Date.now()
    );

    const plan = isPro ? proPlan : freePlan;

    return {
        ...plan,
        ...user,
        stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime()!,
        isPro,
        stripePriceId: user.stripePriceId || "",
    };
}