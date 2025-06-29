"use client"

import { deleteCookie, getCookie, setCookie } from "@/lib/cookies"
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

declare global {
    interface Window {
        gtag?: (...args: any[]) => void
    }
}

export type CookieCategory = "necessary" | "analytics" | "marketing" | "preferences"

export interface CookieConsent {
    necessary: boolean
    analytics: boolean
    marketing: boolean
    preferences: boolean
}

export interface AdConfig {
    enabled: boolean
    canShowPersonalized: boolean
    canTrack: boolean
    allowVideoAds: boolean
    allowNativeAds: boolean
    networks: {
        google: boolean
        facebook: boolean
        amazon: boolean
    }
}

export interface CookieConsentState {
    hasConsented: boolean
    consent: CookieConsent
    adConfig: AdConfig
    timestamp: number
    version: string
}

const CONSENT_VERSION = "1.0"
const CONSENT_COOKIE_NAME = "cookie-consent"
const CONSENT_EXPIRY_DAYS = 365

const defaultConsent: CookieConsent = {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
}

const getAdConfig = (consent: CookieConsent): AdConfig => ({
    enabled: consent.marketing || consent.necessary,
    canShowPersonalized: consent.marketing && consent.preferences,
    canTrack: consent.marketing && consent.analytics,
    allowVideoAds: consent.marketing,
    allowNativeAds: consent.marketing,
    networks: {
        google: consent.marketing,
        facebook: consent.marketing,
        amazon: consent.marketing,
    },
})

interface CookieConsentContextType {
    consentState: CookieConsentState | null
    showBanner: boolean
    showSettings: boolean
    acceptAll: () => void
    rejectAll: () => void
    saveConsent: (consent: CookieConsent) => void
    openSettings: () => void
    closeSettings: () => void
    resetConsent: () => void
    hasConsented: boolean
    consent: CookieConsent
    adConfig: AdConfig
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined)

export function CookieConsentProvider({ children }: { children: ReactNode }) {
    const [consentState, setConsentState] = useState<CookieConsentState | null>(null)
    const [showBanner, setShowBanner] = useState(false)
    const [showSettings, setShowSettings] = useState(false)

    useEffect(() => {
        const stored = getCookie(CONSENT_COOKIE_NAME)
        if (stored) {
            try {
                const parsed: CookieConsentState = JSON.parse(stored)
                const oneYear = 365 * 24 * 60 * 60 * 1000
                const isExpired = Date.now() - parsed.timestamp > oneYear

                if (!isExpired && parsed.version === CONSENT_VERSION) {

                    const updatedState = {
                        ...parsed,
                        adConfig: getAdConfig(parsed.consent),
                    }
                    setConsentState(updatedState)
                    updateGoogleConsent(parsed.consent)
                } else {

                    deleteCookie(CONSENT_COOKIE_NAME)
                    setShowBanner(true)
                }
            } catch {
                deleteCookie(CONSENT_COOKIE_NAME)
                setShowBanner(true)
            }
        } else {
            setShowBanner(true)
        }
    }, [])

    const updateGoogleConsent = useCallback((consent: CookieConsent) => {
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("consent", "update", {
                analytics_storage: consent.analytics ? "granted" : "denied",
                ad_storage: consent.marketing ? "granted" : "denied",
                ad_user_data: consent.marketing ? "granted" : "denied",
                ad_personalization: consent.marketing ? "granted" : "denied",
                functionality_storage: consent.preferences ? "granted" : "denied",
                personalization_storage: consent.preferences ? "granted" : "denied",
                security_storage: "granted",
            })
        }
    }, [])

    const saveConsent = useCallback(
        (consent: CookieConsent) => {
            const adConfig = getAdConfig(consent)
            const newState: CookieConsentState = {
                hasConsented: true,
                consent,
                adConfig,
                timestamp: Date.now(),
                version: CONSENT_VERSION,
            }

            const expiryDate = new Date()
            expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS)

            setCookie(CONSENT_COOKIE_NAME, JSON.stringify(newState), {
                expires: expiryDate,
                secure: true,
                sameSite: "lax",
                path: "/",
            })

            setConsentState(newState)
            setShowBanner(false)
            setShowSettings(false)
            updateGoogleConsent(consent)

            setCookie("cookie-necessary", consent.necessary.toString(), {
                expires: expiryDate,
                secure: true,
                sameSite: "lax",
                path: "/",
            })
            setCookie("cookie-analytics", consent.analytics.toString(), {
                expires: expiryDate,
                secure: true,
                sameSite: "lax",
                path: "/",
            })
            setCookie("cookie-marketing", consent.marketing.toString(), {
                expires: expiryDate,
                secure: true,
                sameSite: "lax",
                path: "/",
            })
            setCookie("cookie-preferences", consent.preferences.toString(), {
                expires: expiryDate,
                secure: true,
                sameSite: "lax",
                path: "/",
            })

            // Trigger custom event for other parts of the app
            if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("cookieConsentUpdated", { detail: { consent, adConfig } }))
            }
        },
        [updateGoogleConsent],
    )

    const acceptAll = useCallback(() => {
        saveConsent({
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true,
        })
    }, [saveConsent])

    const rejectAll = useCallback(() => {
        saveConsent(defaultConsent)
    }, [saveConsent])

    const openSettings = useCallback(() => {
        setShowSettings(true)
    }, [])

    const closeSettings = useCallback(() => {
        setShowSettings(false)
    }, [])

    const resetConsent = useCallback(() => {
        // Delete all consent-related cookies
        deleteCookie(CONSENT_COOKIE_NAME)
        deleteCookie("cookie-necessary")
        deleteCookie("cookie-analytics")
        deleteCookie("cookie-marketing")
        deleteCookie("cookie-preferences")

        setConsentState(null)
        setShowBanner(true)
        updateGoogleConsent(defaultConsent)
    }, [updateGoogleConsent])

    const value: CookieConsentContextType = {
        consentState,
        showBanner,
        showSettings,
        acceptAll,
        rejectAll,
        saveConsent,
        openSettings,
        closeSettings,
        resetConsent,
        hasConsented: consentState?.hasConsented ?? false,
        consent: consentState?.consent ?? defaultConsent,
        adConfig: consentState?.adConfig ?? getAdConfig(defaultConsent),
    }

    return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
}

export function useCookieConsent() {
    const context = useContext(CookieConsentContext)
    if (context === undefined) {
        throw new Error("useCookieConsent must be used within a CookieConsentProvider")
    }
    return context
}


export function useAdConsent() {
    const { adConfig } = useCookieConsent()
    return adConfig
}
