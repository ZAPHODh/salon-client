"use client"

import { Button } from "@/components/ui/button"
import { Cookie } from "lucide-react"
import { useCookieConsent } from "@/hooks/use-cookie-consent"

interface CookieConsentButtonProps {
    variant?: "default" | "outline" | "ghost"
    size?: "sm" | "default" | "lg"
    className?: string
}

export function CookieConsentButton({ variant = "ghost", size = "sm", className }: CookieConsentButtonProps) {
    const { openSettings, hasConsented } = useCookieConsent()

    if (!hasConsented) return null

    return (
        <Button
            onClick={() => {
                console.log("Opening cookie settings...")
                openSettings()
            }}
            variant={variant}
            size={size}
            className={className}
        >
            <Cookie className="h-4 w-4 mr-2" />
            Cookie Settings
        </Button>
    )
}