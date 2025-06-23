'use client';

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { CookieState, useCookiesPolicy } from '@/hooks/use-cookiespolicy';
import { Button } from '../ui/button';


export default function CookieBanner() {
    const t = useTranslations('cookies')
    const { cookieState, onAcceptCookies, onRejectCookies } = useCookiesPolicy()

    if (cookieState || cookieState !== CookieState.PENDING) return null

    return (
        <div
            id="cookies-banner"
            className="z-20 max-w-xs md:max-w-xl mx-auto fixed bottom-4 left-0 right-0 bg-muted rounded-lg border-2 shadow-lg z-58"
        >
            <div className="flex flex-col justify-between items-center px-3 md:flex-row">
                <div className="mt-3 md:mt-0">
                    {t('message')}&nbsp;
                    <Link
                        href="/cookies"
                        className="text-blue-500 whitespace-nowrap hover:underline"
                    >
                        {t('readMore')}
                    </Link>
                </div>
                <div className="flex space-x-4 items-center p-5">
                    <Button onClick={onRejectCookies} variant="link">
                        {t('reject')}
                    </Button>
                    <Button
                        onClick={onAcceptCookies}
                    >
                        {t('accept')}
                    </Button>
                </div>
            </div>
        </div>
    )
}