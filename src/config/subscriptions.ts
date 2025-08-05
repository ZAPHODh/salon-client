
export const freePlan: SubscriptionPlan = {
    name: "Free",
    description:
        "Free plan for individuals and small teams to get started.",
    stripePriceId: "",
};

export const proPlan: SubscriptionPlan = {
    name: "PRO",
    description: "Unlock advanced features and priority support.",
    stripePriceId: process.env.STRIPE_PRO_PLAN_ID as string,
};

export const enterprisePlan: SubscriptionPlan = {
    name: "Enterprise",
    description:
        "For large teams and organizations. Contact us for custom pricing and features.",
    stripePriceId: process.env.STRIPE_ENTERPRISE_PLAN_ID as string,
};