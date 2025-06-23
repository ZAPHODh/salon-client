'use client';
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";


function AuthFooter() {
    const t = useTranslations('auth.footer');

    return (
        <div className="flex flex-col items-center justify-center mt-auto pb-[30px] md:px-0 lg:flex-row">
            <ul className="flex flex-row items-center justify-center ">
                {['terms', 'privacy', 'license', 'refund'].map((item) => (
                    <li key={item} className="mr-4 md:mr-[44px]">
                        <Link
                            href={`/${item}`}
                            className="text-[10px] font-medium text-zinc-950 dark:text-zinc-400 lg:text-sm"
                            target="_blank"
                        >
                            {t(item)}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export { AuthFooter };