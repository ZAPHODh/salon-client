import '@/app/globals.css'
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from "@/components/ui/sonner"
import { FontProvider } from '@/components/providers/font';
import { cookies, headers } from 'next/headers';
import { Inter, Roboto_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme';
import { FooterSection } from '@/components/ui/footer-section';
import NavHeader from '@/components/widgets/nav-header';
import SessionProvider from '@/components/providers/session';
import { ZodProvider } from '@/components/providers/zodI18n';
import Adsense from "@/components/adsense";

import { verifySession } from '@/lib/auth/dal';
import CookieConsent from '@/components/cookie-consent';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const roboto_mono = Roboto_Mono({
    subsets: ['latin'],
    variable: '--font-roboto-mono',
    display: 'swap',
})
export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { session } = await verifySession()
    const nonce = (await headers()).get('x-nonce')
    const cookieStore = await cookies()
    const font = cookieStore.get('font')?.value
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
    const onAcceptCookies = () => {
        cookieStore.set('analytics', 'enabled', { expires: 365 });
        cookieStore.set("preferences", "enabled", { expires: 365 });
        cookieStore.set("marketing", "enabled", { expires: 365 });
    };


    const onDeclineCookies = () => {
        cookieStore.set("preferences", "disabled", { expires: 365 });
        cookieStore.set("analytics", "disabled", { expires: 365 });
        cookieStore.set("marketing", "disabled", { expires: 365 });
    };
    return (
        <html lang={locale} className={`${inter.variable} ${roboto_mono.variable}`} suppressHydrationWarning>
            <head>
                <meta name="google-adsense-account" content={process.env.NEXT_PUBLIC_ADSENSE_PUB_ID} nonce='' />
                <Adsense />
            </head>
            <body>
                <SessionProvider initialSession={session}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                        nonce={nonce as string | undefined}
                    >
                        <FontProvider defaultFont={font || inter.variable}>
                            <NextIntlClientProvider>
                                <ZodProvider>
                                    <NavHeader />
                                    {children}
                                    <CookieConsent variant="default" onAcceptCallback={onAcceptCookies} onDeclineCallback={onDeclineCookies} />
                                    <FooterSection />
                                </ZodProvider>
                            </NextIntlClientProvider>
                            <Toaster />
                        </FontProvider>
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html >
    );
}