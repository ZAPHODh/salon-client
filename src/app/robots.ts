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
                    "/cash-flow",
                    "/customers",
                    "/dashboard",
                    "/finance",
                    "/playground",
                    "/professionals",
                    "/services",
                    "/api/",
                ],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}