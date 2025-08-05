export const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://salon-client-six.vercel.app/";

export const siteConfig = (locale: string = "en") => ({
    name: "PL",
    url: siteUrl + "/" + locale,
    ogImage: `${siteUrl}/${locale}/opengraph-image`,
    description: "Your all-in-one salon management software",
    links: {
    },
});

export type SiteConfig = typeof siteConfig;