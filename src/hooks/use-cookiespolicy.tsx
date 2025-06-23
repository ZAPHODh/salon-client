'use client'

import { setCookie } from 'cookies-next'
import { useState } from 'react'

const COOKIE_NAME = 'CONSENT'

export enum CookieState {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

const getClientCookie = (name: string): string | undefined => {
    if (typeof document === 'undefined') return undefined
    const cookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith(name + '='))
        ?.split('=')[1]
    return cookie ? decodeURIComponent(cookie) : undefined
}

export const useCookiesPolicy = () => {
    const [cookieState, setCookieState] = useState<string | undefined>(() => {
        return getClientCookie(COOKIE_NAME) ?? CookieState.PENDING
    })

    const updateConsent = (state: CookieState) => {
        const consent = state === CookieState.ACCEPTED ? 'granted' : 'denied'
        window?.gtag?.('consent', 'update', {
            analytics_storage: consent,
            ad_storage: consent,
            ad_personalization: consent,
            ad_user_data: consent,
            fb_pixel: consent,
        })
    }

    const acceptCookies = () => {
        setCookieState(CookieState.ACCEPTED)
        setCookie(COOKIE_NAME, CookieState.ACCEPTED, { maxAge: 60 * 60 * 24 * 365 })
        updateConsent(CookieState.ACCEPTED)
    }

    const rejectCookies = () => {
        setCookieState(CookieState.REJECTED)
        setCookie(COOKIE_NAME, CookieState.REJECTED, { maxAge: 60 * 60 * 24 * 365 })
        updateConsent(CookieState.REJECTED)
    }

    return {
        cookieState,
        onAcceptCookies: acceptCookies,
        onRejectCookies: rejectCookies,
    }
}
