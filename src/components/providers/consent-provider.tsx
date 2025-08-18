"use client"

import type React from "react"

import { CookieConsentProvider as CookieConsentContextProvider } from "@/hooks/use-cookie-consent"
import { GoogleConsentScript } from "../cookie/google-consent-script"
import { CookieConsentBanner } from "../cookie/cookie-consent-banner"
import { CookieSettingsModal } from "../cookie/cookie-consent-modal"

interface CookieConsentProviderProps {
    children: React.ReactNode
    googleAnalyticsId?: string
    googleAdsId?: string
}

export function CookieConsentProvider({ children, googleAnalyticsId, googleAdsId }: CookieConsentProviderProps) {
    return (
        <CookieConsentContextProvider>
            <GoogleConsentScript googleAnalyticsId={googleAnalyticsId} googleAdsId={googleAdsId} />
            {children}
            <CookieConsentBanner />
            <CookieSettingsModal />
        </CookieConsentContextProvider>
    )
}