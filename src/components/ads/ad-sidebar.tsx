"use client"

import { AdBanner } from "./ad-banner"
import { useCookieConsent } from "@/hooks/use-cookie-consent"

export function AdSidebar() {
    const { adConfig } = useCookieConsent()

    return (
        <aside className="w-64 space-y-6 p-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                {adConfig.enabled ? "Sponsored" : "Ads Disabled"}
            </h3>

            <div className="space-y-4">
                <AdBanner size="rectangle" network="google" />
                <AdBanner size="rectangle" network="facebook" />
                <AdBanner size="rectangle" network="amazon" />
            </div>
        </aside>
    )
}
