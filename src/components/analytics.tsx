'use client';

import Script from 'next/script'

import { CookieState, useCookiesPolicy } from '@/hooks/use-cookiespolicy'

export default function Analytics(props: { nonce: string | undefined }) {
  const { cookieState } = useCookiesPolicy()
  const consent = cookieState === CookieState.ACCEPTED ? 'granted' : 'denied'

  return (
    <>
      <Script
        nonce={props.nonce}
        id="gtm"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}

            const consent = '${consent}';

            gtag('consent', 'default', {
              'ad_storage': consent,
              'analytics_storage': consent,
              'ad_personalization': consent,
              'ad_user_data': consent,
              'fb_pixel': consent
            });

            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`,
        }}
      />
    </>
  )
}