import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth/helper';
import { routing } from './i18n/routing';
import { decode } from './lib/auth/server-session';

const intlMiddleware = createMiddleware(routing);

const protectedRoutes = ['/calendar', '/customer', '/professionals', '/finance', '/account'];
const publicRoutes = ['/auth', '/'];

export default async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    const pathSegments = pathname.split('/').filter(Boolean);
    const [maybeLocale] = pathSegments;
    const hasLocale = routing.locales.includes(maybeLocale as "en" | "pt" | "zh");

    const locale = hasLocale ? maybeLocale : routing.defaultLocale;
    const internalPath = hasLocale
        ? `/${pathSegments.slice(1).join('/')}`
        : pathname;

    const isProtectedRoute = protectedRoutes.some(route =>
        internalPath.startsWith(route)
    );
    const isPublicRoute = publicRoutes.includes(internalPath);

    const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await decode(cookie);
    if (isProtectedRoute && !session?.user.id) {
        const url = new URL(`/${locale}/auth/signin`, req.url);
        return NextResponse.redirect(url);
    }

    if (isPublicRoute && session?.user.id && !internalPath.startsWith('/calendar')) {
        const url = new URL(`/${locale}/calendar/week-view`, req.url);
        return NextResponse.redirect(url);
    }

    return intlMiddleware(req);
}

export const config = {
    matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)']
};
