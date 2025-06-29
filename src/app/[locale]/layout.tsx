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
import { getTranslations } from 'next-intl/server';
import { verifySession } from '@/lib/auth/dal';
import { CookieConsentProvider } from '@/components/providers/cookie-consent';
import { CookieConsentButton } from '@/components/cookie/cookie-consent-button';
import { CookieDebugPanel } from '@/components/cookie/cookies-debug-pannel';
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
    const t = await getTranslations('auth');

    return (
        <html lang={locale} className={`${inter.variable} ${roboto_mono.variable}`} suppressHydrationWarning>
            <head>
                <meta name="google-adsense-account" content={process.env.NEXT_PUBLIC_ADSENSE_PUB_ID} nonce='' />
                <Adsense />

            </head>
            <body>
                <SessionProvider initialSession={session}>
                    <CookieConsentProvider
                        googleAnalyticsId={process.env.NEXT_PUBLIC_GA_ID}
                        googleAdsId={process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}
                    >
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
                                        <div className="mt-6">
                                            <CookieConsentButton />
                                        </div>
                                        {/* <CookieDebugPanel /> */}
                                        <FooterSection />
                                    </ZodProvider>
                                </NextIntlClientProvider>
                                <Toaster />
                            </FontProvider>
                        </ThemeProvider>
                    </CookieConsentProvider>
                </SessionProvider>
            </body>
        </html >
    );
}