"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCookieConsent } from "@/hooks/use-cookie-consent"
import { Play, Pause, Volume2, VolumeX, ExternalLink, X } from "lucide-react"

interface VideoAdProps {
    className?: string
    autoplay?: boolean
    skippable?: boolean
}

export function VideoAd({ className = "", autoplay = false, skippable = true }: VideoAdProps) {
    const { adConfig } = useCookieConsent()
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [canSkip, setCanSkip] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (adConfig.enabled) {
            setIsVisible(true)
            if (skippable) {
                const timer = setTimeout(() => setCanSkip(true), 5000) // Allow skip after 5 seconds
                return () => clearTimeout(timer)
            }
        } else {
            setIsVisible(false)
        }
    }, [adConfig.enabled, skippable])

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const updateTime = () => setCurrentTime(video.currentTime)
        const updateDuration = () => setDuration(video.duration)

        video.addEventListener("timeupdate", updateTime)
        video.addEventListener("loadedmetadata", updateDuration)

        return () => {
            video.removeEventListener("timeupdate", updateTime)
            video.removeEventListener("loadedmetadata", updateDuration)
        }
    }, [])

    const togglePlay = () => {
        const video = videoRef.current
        if (!video) return

        if (isPlaying) {
            video.pause()
        } else {
            video.play()
        }
        setIsPlaying(!isPlaying)
    }

    const toggleMute = () => {
        const video = videoRef.current
        if (!video) return

        video.muted = !isMuted
        setIsMuted(!isMuted)
    }

    const handleSkip = () => {
        setIsVisible(false)
    }

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0

    if (!isVisible) return null

    return (
        <Card className={`w-full max-w-2xl ${className} relative`}>
            <CardContent className="p-0 relative">
                {/* Skip button */}
                {canSkip && (
                    <Button onClick={handleSkip} variant="secondary" size="sm" className="absolute top-2 right-2 z-10">
                        <X className="h-4 w-4 mr-1" />
                        Skip Ad
                    </Button>
                )}

                {/* Ad badges */}
                <div className="absolute top-2 left-2 z-10 flex gap-1">
                    <Badge variant="destructive" className="text-xs">
                        Video Ad
                    </Badge>
                    {adConfig.canShowPersonalized && (
                        <Badge variant="secondary" className="text-xs">
                            Personalized
                        </Badge>
                    )}
                </div>

                {/* Video container */}
                <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                        ref={videoRef}
                        className="w-full h-64 object-cover"
                        muted={isMuted}
                        autoPlay={autoplay}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    >
                        <source src="/placeholder-video.mp4" type="video/mp4" />
                        {/* Fallback for browsers that don't support video */}
                        <div className="w-full h-64 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <div className="text-white text-center">
                                <Play className="h-16 w-16 mx-auto mb-4" />
                                <p className="text-lg font-semibold">Video Ad Content</p>
                                <p className="text-sm opacity-80">Upgrade Your Business Today</p>
                            </div>
                        </div>
                    </video>

                    {/* Video controls overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center gap-3">
                            <Button onClick={togglePlay} variant="ghost" size="sm" className="text-white hover:text-white">
                                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>

                            <Button onClick={toggleMute} variant="ghost" size="sm" className="text-white hover:text-white">
                                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                            </Button>

                            <div className="flex-1 bg-white/20 rounded-full h-1">
                                <div
                                    className="bg-white rounded-full h-1 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <span className="text-white text-xs">
                                {Math.floor(currentTime)}s / {Math.floor(duration)}s
                            </span>
                        </div>
                    </div>
                </div>

                {/* Ad content */}
                <div className="p-4 space-y-3">
                    <h3 className="font-semibold">Transform Your Business with AI</h3>
                    <p className="text-sm text-muted-foreground">
                        Discover how leading companies are using AI to boost productivity by 300%. Start your free trial today.
                    </p>
                    <Button className="w-full" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                            Start Free Trial
                            <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
