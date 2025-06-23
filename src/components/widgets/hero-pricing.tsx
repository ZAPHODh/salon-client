'use client';

import { useTranslations } from "next-intl";
import { PricingTable } from "../ui/pricing-table";


function HeroPricing() {
    const t = useTranslations('hero.pricing')
    const features = [
        { key: "clientRegistration", included: "free" },
        { key: "serviceHistory", included: "free" },
        { key: "basicReports", included: "free" },
        { key: "faqSupport", included: "free" },
        { key: "scheduling", included: "pro" },
        { key: "profileCustomization", included: "pro" },
        { key: "emailSupport", included: "pro" },
        { key: "cashManagement", included: "pro" },
        { key: "expenseTracking", included: "pro" },
        { key: "detailedReports", included: "enterprise" },
        { key: "commissionManagement", included: "enterprise" },
        { key: "autoFees", included: "enterprise" },
        { key: "prioritySupport", included: "enterprise" },
        { key: "paymentIntegration", included: "enterprise" },
        { key: "advancedFinancial", included: "enterprise" },
        { key: "multiUserAccess", included: "enterprise" },
        { key: "247Support", included: "enterprise" },
    ];
    const plans = [
        {
            name: t('plans.free.name'),
            price: { monthly: 0, yearly: 0 },
            level: "free",
        },
        {
            name: t('plans.pro.name'),
            price: { monthly: 49, yearly: 470 },
            level: "pro",
            popular: true,
        },
        {
            name: t('plans.enterprise.name'),
            price: { monthly: 99, yearly: 990 },
            level: "enterprise",
        },
    ];

    return (
        // <div className="flex flex-col items-center justify-center w-full">
        <PricingTable
            features={features.map(f => ({
                ...f,
                name: t(`featureItem.${f.key}`)
            }))}
            plans={plans}
            defaultPlan="free"
            defaultInterval="monthly"
            onPlanSelect={(plan) => console.log("Selected plan:", plan)}
            containerClassName="py-12"
            buttonClassName="bg-primary hover:bg-primary/90"
        />
        // </div>
    );
}

export { HeroPricing }