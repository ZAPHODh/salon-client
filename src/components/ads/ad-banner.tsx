"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCookieConsent } from "@/hooks/use-cookie-consent"
import { Eye, ExternalLink, Settings, Shield } from "lucide-react"

export type AdSize = "banner" | "leaderboard" | "rectangle" | "skyscraper" | "mobile-banner"
export type AdNetwork = "google" | "facebook" | "amazon" | "generic"

interface AdBannerProps {
    size?: AdSize
    network?: AdNetwork
    className?: string
    placeholder?: boolean
    adId?: string
}

const adSizes = {
    banner: { width: 728, height: 90, name: "Banner (728x90)" },
    leaderboard: { width: 970, height: 250, name: "Leaderboard (970x250)" },
    rectangle: { width: 300, height: 250, name: "Rectangle (300x250)" },
    skyscraper: { width: 160, height: 600, name: "Skyscraper (160x600)" },
    "mobile-banner": { width: 320, height: 50, name: "Mobile Banner (320x50)" },
}

const networkColors = {
    google: "bg-blue-500",
    facebook: "bg-blue-600",
    amazon: "bg-orange-500",
    generic: "bg-gray-500",
}

const sampleAds = [
    {
        title: "Premium Calendar Pro",
        description: "Upgrade your scheduling experience with advanced features",
        cta: "Try Free for 30 Days",
        image: "/placeholder.svg?height=250&width=300",
        url: "#",
    },
    {
        title: "Time Management Course",
        description: "Learn to manage your time effectively with expert guidance",
        cta: "Enroll Now",
        image: "/placeholder.svg?height=250&width=300",
        url: "#",
    },
    {
        title: "Business Productivity Suite",
        description: "All-in-one solution for modern businesses",
        cta: "Get Started",
        image: "/placeholder.svg?height=250&width=300",
        url: "#",
    },
]

export function AdBanner({
    size = "rectangle",
    network = "generic",
    className = "",
    placeholder = false,
    adId,
}: AdBannerProps) {
    const { adConfig, openSettings } = useCookieConsent()
    const [currentAd, setCurrentAd] = useState(sampleAds[0])
    const [isLoaded, setIsLoaded] = useState(false)

    const dimensions = adSizes[size]

    useEffect(() => {
        if (adConfig.enabled && !placeholder) {
            const timer = setTimeout(() => {
                const randomAd = sampleAds[Math.floor(Math.random() * sampleAds.length)]
                setCurrentAd(randomAd)
                setIsLoaded(true)
            }, 1000)

            return () => clearTimeout(timer)
        }
    }, [adConfig.enabled, placeholder])

    if (!adConfig.enabled && !placeholder) {
        return (
            <Card className={`w-full max-w-sm ${className}`} style={{ minHeight: dimensions.height }}>
                <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center space-y-3">
                    <Shield className="h-8 w-8 text-muted-foreground" />
                    <div>
                        <h4 className="font-medium text-sm">Ads Blocked</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                            Enable marketing cookies to see relevant advertisements
                        </p>
                    </div>
                    <Button onClick={openSettings} variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Cookie Settings
                    </Button>
                </CardContent>
            </Card>
        )
    }

    if (adConfig.enabled && !isLoaded && !placeholder) {
        return (
            <Card className={`w-full max-w-sm ${className}`} style={{ minHeight: dimensions.height }}>
                <CardContent className="p-4 flex items-center justify-center h-full">
                    <div className="animate-pulse space-y-3 w-full">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-20 bg-muted rounded"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={`w-full max-w-sm ${className} relative group`} style={{ minHeight: dimensions.height }}>
            <CardContent className="p-0 relative overflow-hidden">
                <div className="relative">
                    <img
                        src={currentAd.image || "/placeholder.svg"}
                        alt={currentAd.title}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                            e.currentTarget.src = `/placeholder.svg?height=${dimensions.height}&width=${dimensions.width}`
                        }}
                    />
                    <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-sm line-clamp-2">{currentAd.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{currentAd.description}</p>
                        <Button size="sm" className="w-full" asChild>
                            <a href={currentAd.url} target="_blank" rel="noopener noreferrer">
                                {currentAd.cta}
                                <ExternalLink className="h-3 w-3 ml-2" />
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="absolute top-2 left-2 flex gap-1">
                    <Badge variant="secondary" className="text-xs">
                        Ad
                    </Badge>
                    <Badge variant="outline" className={`text-xs text-white ${networkColors[network]}`}>
                        {network.charAt(0).toUpperCase() + network.slice(1)}
                    </Badge>
                </div>


                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Ad preferences" onClick={openSettings}>
                        <Eye className="h-3 w-3" />
                    </Button>
                </div>
                {adConfig.canShowPersonalized && (
                    <div className="absolute bottom-2 right-2">
                        <Badge variant="outline" className="text-xs">
                            Personalized
                        </Badge>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
