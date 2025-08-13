import { type MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/auth/"],
                disallow: [
                    "/account",
                    "/calendar",
                    "/customers",
                    "/finance",
                    "/professionals",
                    "/services",
                    "/api/",
                ],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}