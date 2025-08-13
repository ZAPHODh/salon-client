import { type MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
const paths = [
    '',
    'account',
    'auth/signin',
    'auth/signup',
    'calendar',
    'customers',
    'finance',
    'professionals',
    'services',
];
export default function sitemap(): MetadataRoute.Sitemap {
    const locales = ['en', 'pt'];
    const now = new Date();

    return paths.flatMap((path) => {
        return locales.map((locale) => ({
            url: `${siteUrl}/${locale}/${path}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
            alternates: {
                languages: {
                    en: `${siteUrl}/en/${path}`,
                    pt: `${siteUrl}/pt/${path}`,
                },
            },
        }));
    });
}