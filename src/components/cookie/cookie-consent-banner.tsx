"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Cookie, Settings, Shield } from "lucide-react"
import { useCookieConsent } from "@/hooks/use-cookie-consent"

export function CookieConsentBanner() {
    const { showBanner, acceptAll, rejectAll, openSettings } = useCookieConsent()

    if (!showBanner) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
            <Card className="mx-auto max-w-4xl">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <Cookie className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    We value your privacy
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and
                                    personalize content. Some cookies are essential for the site to function, while others help us improve
                                    our services and show you relevant advertisements.
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    By clicking "Accept All", you consent to our use of cookies. You can manage your preferences or learn
                                    more in our{" "}
                                    <a href="/privacy-policy" className="underline hover:no-underline text-primary">
                                        Privacy Policy
                                    </a>{" "}
                                    and{" "}
                                    <a href="/cookie-policy" className="underline hover:no-underline text-primary">
                                        Cookie Policy
                                    </a>
                                    . Your consent will be stored in cookies and can be withdrawn at any time.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button onClick={acceptAll} size="sm">
                                    Accept All
                                </Button>
                                <Button onClick={rejectAll} variant="outline" size="sm">
                                    Reject All
                                </Button>
                                <Button onClick={openSettings} variant="ghost" size="sm">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Customize
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
