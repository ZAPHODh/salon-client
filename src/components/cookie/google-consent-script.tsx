"use client"

import Script from "next/script"

interface GoogleConsentScriptProps {
    googleAnalyticsId?: string
    googleAdsId?: string
}

export function GoogleConsentScript({ googleAnalyticsId, googleAdsId }: GoogleConsentScriptProps) {
    return (
        <>
            <Script
                id="google-consent-mode"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Set default consent state
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'functionality_storage': 'denied',
              'personalization_storage': 'denied',
              'security_storage': 'granted'
            });
            
            // Configure regions for different privacy laws
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'region': ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'IS', 'LI', 'NO', 'CH']
            });
            
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'region': ['BR']
            });
            
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'region': ['US-CA']
            });
          `,
                }}
            />
            {googleAnalyticsId && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
                        strategy="afterInteractive"
                    />
                    <Script
                        id="google-analytics"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                window.gtag = window.gtag || function(){dataLayer.push(arguments);};
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}', {
                  page_title: document.title,
                  page_location: window.location.href,
                });
              `,
                        }}
                    />
                </>
            )}

            {/* Google Ads */}
            {googleAdsId && (
                <Script
                    id="google-ads"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
              gtag('config', '${googleAdsId}');
            `,
                    }}
                />
            )}
        </>
    )
}
