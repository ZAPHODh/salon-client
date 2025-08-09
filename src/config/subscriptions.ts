
export const freePlan: SubscriptionPlan = {
    name: "Free",
    description:
        "Assinatura básica com recursos limitados. Ideal para testar o software.",
    stripePriceId: "",
};

export const proPlan: SubscriptionPlan = {
    name: "PRO",
    description: "Habilite todos os recursos para seu salão.",
    stripePriceId: process.env.STRIPE_PRO_PLAN_ID as string,
};

export const enterprisePlan: SubscriptionPlan = {
    name: "Enterprise",
    description:
        "For large teams and organizations. Contact us for custom pricing and features.",
    stripePriceId: process.env.STRIPE_ENTERPRISE_PLAN_ID as string,
};