'use client';

import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { zodI18nMap } from '@/lib/zod-i18n';

export function ZodProvider({ children }: { children: React.ReactNode }) {
    const t = useTranslations();
    z.setErrorMap(zodI18nMap(t));
    return <>{children}</>;
}