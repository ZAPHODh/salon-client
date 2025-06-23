import { enUS, pt, ptBR, zhCN } from "date-fns/locale";
import { format, Locale } from "date-fns";
const locales: Record<string, Locale> = {
    zh: zhCN,
    en: enUS,
    pt,
    br: ptBR
};

export const getFnsLocale = (lang: string) => {
    const locale = locales[lang] || enUS;
    return locale
}
export const formatDate = (date: Date, lang: string, formatStr = "PPPP") => {
    const locale = locales[lang] || enUS;
    return format(date, formatStr, { locale });
};

export const defaultWorkingHours: TWorkingHours = {
    0: { from: 0, to: 0 },
    1: { from: 9, to: 17 },
    2: { from: 9, to: 17 },
    3: { from: 9, to: 17 },
    4: { from: 9, to: 17 },
    5: { from: 9, to: 17 },
    6: { from: 0, to: 0 },
}


export const defaultVisibleHours: TVisibleHours = { from: 8, to: 18 }


export const countries = [
    { code: "BR", name: "Brazil" },
    { code: "US", name: "United States" },
    { code: "UK", name: "United Kingdom" },
]
