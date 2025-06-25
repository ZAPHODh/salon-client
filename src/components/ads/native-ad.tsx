"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCookieConsent } from "@/hooks/use-cookie-consent"
import { ExternalLink, Star } from "lucide-react"

interface NativeAdProps {
    className?: string
}

const nativeAds = [
    {
        title: "Boost Your Productivity Today",
        description:
            "Discover the #1 rated productivity app trusted by millions of professionals worldwide. Start your free trial now.",
        image: "/placeholder.svg?height=200&width=300",
        rating: 4.8,
        reviews: "12.5k",
        cta: "Download Free",
        url: "#",
        sponsored: "Sponsored by ProductivityPro",
    },
    {
        title: "Master Time Management Skills",
        description: "Join over 50,000 students in this comprehensive online course. Learn from industry experts.",
        image: "/placeholder.svg?height=200&width=300",
        rating: 4.9,
        reviews: "8.2k",
        cta: "Enroll Now",
        url: "#",
        sponsored: "Sponsored by LearnHub",
    },
]

export function NativeAd({ className = "" }: NativeAdProps) {
    const { adConfig } = useCookieConsent()
    const [currentAd, setCurrentAd] = useState(nativeAds[0])
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (adConfig.enabled) {
            const randomAd = nativeAds[Math.floor(Math.random() * nativeAds.length)]
            setCurrentAd(randomAd)
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }, [adConfig.enabled])

    if (!isVisible) return null

    return (
        <Card className={`w-full ${className}`}>
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                        <img
                            src={currentAd.image || "/placeholder.svg"}
                            alt={currentAd.title}
                            className="w-full h-48 md:h-full object-cover rounded-l-lg"
                        />
                    </div>
                    <div className="md:w-2/3 p-6 space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                    Sponsored
                                </Badge>
                                {adConfig.canShowPersonalized && (
                                    <Badge variant="secondary" className="text-xs">
                                        Personalized
                                    </Badge>
                                )}
                            </div>
                            <h3 className="text-xl font-bold">{currentAd.title}</h3>
                            <p className="text-muted-foreground">{currentAd.description}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{currentAd.rating}</span>
                                <span className="text-sm text-muted-foreground">({currentAd.reviews} reviews)</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">{currentAd.sponsored}</p>
                            <Button asChild>
                                <a href={currentAd.url} target="_blank" rel="noopener noreferrer">
                                    {currentAd.cta}
                                    <ExternalLink className="h-4 w-4 ml-2" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
