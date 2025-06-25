"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCookieConsent } from "@/hooks/use-cookie-consent"
import { Eye, EyeOff, RefreshCw, Trash2 } from "lucide-react"
import { getAllCookies } from "@/lib/cookies"

export function CookieDebugPanel() {
    const [isVisible, setIsVisible] = useState(false)
    const [allCookies, setAllCookies] = useState<Record<string, string>>({})
    const { consentState, resetConsent, hasConsented, consent } = useCookieConsent()

    const refreshCookies = () => {
        setAllCookies(getAllCookies())
    }

    const toggleVisibility = () => {
        setIsVisible(!isVisible)
        if (!isVisible) {
            refreshCookies()
        }
    }

    if (!isVisible) {
        return (
            <div className="fixed top-4 right-4 z-50">
                <Button onClick={toggleVisibility} variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Debug Cookies
                </Button>
            </div>
        )
    }

    return (
        <div className="fixed top-4 right-4 z-50 w-96">
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Cookie Debug Panel</CardTitle>
                        <Button onClick={toggleVisibility} variant="ghost" size="sm">
                            <EyeOff className="h-4 w-4" />
                        </Button>
                    </div>
                    <CardDescription>Current cookie consent status and stored cookies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-2">Consent Status</h4>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span>Has Consented:</span>
                                <Badge variant={hasConsented ? "default" : "secondary"}>{hasConsented ? "Yes" : "No"}</Badge>
                            </div>
                            {hasConsented && (
                                <>
                                    <div className="flex justify-between">
                                        <span>Analytics:</span>
                                        <Badge variant={consent.analytics ? "default" : "secondary"}>
                                            {consent.analytics ? "Allowed" : "Denied"}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Marketing:</span>
                                        <Badge variant={consent.marketing ? "default" : "secondary"}>
                                            {consent.marketing ? "Allowed" : "Denied"}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Preferences:</span>
                                        <Badge variant={consent.preferences ? "default" : "secondary"}>
                                            {consent.preferences ? "Allowed" : "Denied"}
                                        </Badge>
                                    </div>
                                    {consentState && (
                                        <div className="flex justify-between">
                                            <span>Timestamp:</span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(consentState.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">All Cookies</h4>
                            <Button onClick={refreshCookies} variant="ghost" size="sm">
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="max-h-40 overflow-y-auto space-y-1 text-xs">
                            {Object.entries(allCookies).length === 0 ? (
                                <p className="text-muted-foreground">No cookies found</p>
                            ) : (
                                Object.entries(allCookies).map(([name, value]) => (
                                    <div key={name} className="flex justify-between items-start gap-2">
                                        <span className="font-mono text-xs break-all">{name}:</span>
                                        <span className="text-muted-foreground text-xs break-all max-w-32">
                                            {value.length > 20 ? `${value.substring(0, 20)}...` : value}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={resetConsent} variant="destructive" size="sm" className="flex-1">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Reset Consent
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
