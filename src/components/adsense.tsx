
import { headers } from "next/headers";
import Script from "next/script";

export default async function Adsense() {
    const nonce = (await headers()).get('x-nonce')

    return (
        <Script
            nonce={nonce as string | undefined}
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process
                .env.NEXT_PUBLIC_ADSENSE_PUB_ID!}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"

        ></Script>
    );
}