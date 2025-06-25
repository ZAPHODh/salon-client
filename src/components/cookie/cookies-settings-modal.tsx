"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCookieConsent, type CookieConsent } from "@/hooks/use-cookie-consent"
import { Shield, BarChart3, Target, Settings, Play, Eye, Globe } from "lucide-react"

const cookieCategories = [
    {
        id: "necessary" as const,
        title: "Necessary Cookies",
        description: "Essential for the website to function properly. These cannot be disabled.",
        icon: Shield,
        required: true,
        details: [
            "Authentication and security",
            "Shopping cart functionality",
            "Form submissions",
            "Basic site functionality",
        ],
        adImpact: "Allows basic, non-personalized advertisements",
    },
    {
        id: "analytics" as const,
        title: "Analytics Cookies",
        description: "Help us understand how visitors interact with our website.",
        icon: BarChart3,
        required: false,
        details: ["Google Analytics", "Page view tracking", "User behavior analysis", "Performance monitoring"],
        adImpact: "Enables ad performance tracking and optimization",
    },
    {
        id: "marketing" as const,
        title: "Marketing Cookies",
        description: "Used to deliver personalized advertisements and track campaign effectiveness.",
        icon: Target,
        required: false,
        details: ["Google Ads", "Facebook Pixel", "Retargeting campaigns", "Conversion tracking"],
        adImpact: "Enables all advertisement types including personalized ads, video ads, and native ads",
    },
    {
        id: "preferences" as const,
        title: "Preference Cookies",
        description: "Remember your settings and preferences for a better experience.",
        icon: Settings,
        required: false,
        details: ["Language preferences", "Theme settings", "Layout customizations", "User interface preferences"],
        adImpact: "Enhances ad personalization based on your preferences",
    },
]

export function CookieSettingsModal() {
    const { showSettings, closeSettings, saveConsent, consent } = useCookieConsent()
    const [tempConsent, setTempConsent] = useState<CookieConsent>(() => consent)

    useEffect(() => {
        if (showSettings) {
            setTempConsent(consent)
        }
    }, [showSettings, consent])

    const handleToggle = (category: keyof CookieConsent) => {
        if (category === "necessary") return

        setTempConsent((prev) => ({
            ...prev,
            [category]: !prev[category],
        }))
    }

    const handleSave = () => {
        saveConsent(tempConsent)
    }

    const handleAcceptAll = () => {
        const allAccepted: CookieConsent = {
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true,
        }
        setTempConsent(allAccepted)
        saveConsent(allAccepted)
    }

    const handleRejectAll = () => {
        const onlyNecessary: CookieConsent = {
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false,
        }
        setTempConsent(onlyNecessary)
        saveConsent(onlyNecessary)
    }

    const getAdPreview = (consent: CookieConsent) => {
        const adTypes = []
        if (consent.necessary) adTypes.push("Basic ads")
        if (consent.marketing) {
            adTypes.push("Personalized ads", "Video ads", "Native ads")
        }
        if (consent.marketing && consent.preferences) {
            adTypes.push("Highly targeted ads")
        }
        return adTypes
    }

    const adPreview = getAdPreview(tempConsent)

    return (
        <Dialog open={showSettings} onOpenChange={closeSettings}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Cookie & Advertisement Preferences</DialogTitle>
                    <DialogDescription>
                        Manage your cookie preferences and control how advertisements are displayed to you. Changes will take effect
                        immediately.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="space-y-4">
                        {cookieCategories.map((category) => {
                            const Icon = category.icon
                            const isEnabled = tempConsent[category.id]

                            return (
                                <Card key={category.id} className={isEnabled ? "ring-2 ring-primary/20" : ""}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Icon className="h-5 w-5 text-primary" />
                                                <div>
                                                    <CardTitle className="text-base flex items-center gap-2">
                                                        {category.title}
                                                        {category.required && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                Required
                                                            </Badge>
                                                        )}
                                                    </CardTitle>
                                                    <CardDescription className="text-sm">{category.description}</CardDescription>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={isEnabled}
                                                onCheckedChange={() => handleToggle(category.id)}
                                                disabled={category.required}
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0 space-y-3">
                                        <div className="text-xs text-muted-foreground">
                                            <p className="font-medium mb-1">Used for:</p>
                                            <ul className="list-disc list-inside space-y-0.5">
                                                {category.details.map((detail, index) => (
                                                    <li key={index}>{detail}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="bg-muted/50 p-3 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Target className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-xs font-medium text-muted-foreground">Advertisement Impact:</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{category.adImpact}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    <Separator />

                    <Card className="bg-muted/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                Advertisement Preview
                            </CardTitle>
                            <CardDescription>Based on your current selections, you will see:</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {adPreview.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {adPreview.map((adType, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {adType}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No advertisements will be shown</p>
                            )}

                            <div className="mt-3 text-xs text-muted-foreground space-y-1">
                                <div className="flex items-center gap-2">
                                    <Globe className="h-3 w-3" />
                                    <span>Supported networks: Google, Facebook, Amazon</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Play className="h-3 w-3" />
                                    <span>Video ads: {tempConsent.marketing ? "Enabled" : "Disabled"}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="bg-muted/50 p-4 rounded-lg text-xs text-muted-foreground">
                        <p className="font-medium mb-2">Your Rights & Our Compliance:</p>
                        <ul className="space-y-1">
                            <li>• You can change these preferences at any time</li>
                            <li>• You have the right to withdraw consent</li>
                            <li>• Some features may not work properly if certain cookies are disabled</li>
                            <li>• We comply with GDPR, LGPD, and CCPA regulations</li>
                            <li>• Advertisement preferences are stored securely and expire after 1 year</li>
                        </ul>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button onClick={handleRejectAll} variant="outline" className="flex-1 sm:flex-none">
                            Reject All
                        </Button>
                        <Button onClick={handleAcceptAll} variant="outline" className="flex-1 sm:flex-none">
                            Accept All
                        </Button>
                    </div>
                    <Button onClick={handleSave} className="w-full sm:w-auto">
                        Save Preferences
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
