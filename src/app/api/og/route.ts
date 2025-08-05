import { ImageResponse } from "next/og";
import { RenderIMGEl } from "@/components/OGImgEl";
import { siteUrl } from "@/config/site";
import Logo from "public/pj.png";
import homepageImage from "public/pjhomepage.png";
import { getLocale } from "next-intl/server";

export const runtime = "edge";

export async function GET() {
    const locale = await getLocale()
    try {
        return new ImageResponse(
            RenderIMGEl({
                logo: siteUrl + Logo.src,
                locale: locale as string,
                image: siteUrl + homepageImage.src,
            }),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e) {
        console.log(e);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}