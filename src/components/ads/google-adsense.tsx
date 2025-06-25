"use client"

import { useState } from "react"

import { useEffect, useRef } from "react"
import { useCookieConsent } from "@/hooks/use-cookie-consent"

interface GoogleAdSenseProps {
    adSlot: string
    adFormat?: "auto" | "rectangle" | "vertical" | "horizontal"
    fullWidthResponsive?: boolean
    className?: string
}

declare global {
    interface Window {
        adsbygoogle?: any
    }
}

export function GoogleAdSense({
    adSlot,
    adFormat = "auto",
    fullWidthResponsive = true,
    className = "",
}: GoogleAdSenseProps) {
    const { adConfig } = useCookieConsent()
    const adRef = useRef<HTMLDivElement>(null)
    const [adLoaded, setAdLoaded] = useState(false)

    useEffect(() => {
        if (!adConfig.networks.google || adLoaded) return

        try {
            if (typeof window !== "undefined" && window.adsbygoogle) {
                window.adsbygoogle.push({})
                setAdLoaded(true)
            }
        } catch (error) {
            console.error("AdSense error:", error)
        }
    }, [adConfig.networks.google, adLoaded])

    if (!adConfig.networks.google) {
        return (
            <div className={`border-2 border-dashed border-muted-foreground/20 p-4 text-center ${className}`}>
                <p className="text-sm text-muted-foreground">Google Ads disabled - Enable marketing cookies</p>
            </div>
        )
    }

    return (
        <div ref={adRef} className={className}>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive.toString()}
            />
        </div>
    )
}
