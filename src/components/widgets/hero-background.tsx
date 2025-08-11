import { Button } from "@/components/ui/button";
import { type FC } from "react";
import appointmentMonth from '@/../public/assets/agendamneto-mensal.png';
import config from '@/../public/assets/config.png';
import { useTranslations } from "next-intl";

const HeroBackground: FC = () => {
    const t = useTranslations('hero');

    const stats = [
        { key: "salons", value: "1" },
        { key: "transactions", value: "20" },
        { key: "satisfaction", value: "100%" },
        { key: "years", value: "0" },
    ];

    return (
        <section className="py-18 w-full flex flex-col items-center justify-center bg-background">
            <div className="container w-full p-4">
                <div className="mb-14 grid gap-5 text-center md:grid-cols-2 md:text-left">
                    <h2 className="text-5xl font-semibold">{t('title')}</h2>
                    <p className="text-muted-foreground">
                        {t('description')}
                    </p>
                </div>

                <div className="grid gap-7 lg:grid-cols-3">
                    <img
                        src={appointmentMonth.src}
                        alt={t('images.monthly')}
                        className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2"
                    />
                    <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
                        <div className="flex flex-col justify-between gap-6 rounded-xl bg-muted p-7 md:w-1/2 lg:w-auto">
                            <img
                                src={config.src}
                                alt={t('images.logo')}
                                className="mr-auto h-12"
                            />
                            <div>
                                <p className="mb-2 text-lg font-semibold">{t('features.title')}</p>
                                <p className="text-muted-foreground">
                                    {t('features.description')}
                                </p>
                            </div>
                            <Button variant="outline" className="mr-auto">
                                {t('features.button')}
                            </Button>
                        </div>
                        <img
                            src={appointmentMonth.src}
                            alt={t('images.financialControl')}
                            className="grow basis-0 rounded-xl object-cover md:w-1/2 lg:min-h-0 lg:w-auto"
                        />
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-xl bg-muted p-10 md:p-16 my-6">
                    <div className="flex flex-col gap-4 text-center md:text-left">
                        <h2 className="text-4xl font-semibold">{t('results.title')}</h2>
                        <p className="max-w-screen-sm text-muted-foreground">
                            {t('results.description')}
                        </p>
                    </div>
                    <div className="mt-10 flex flex-wrap justify-between gap-10 text-center">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex flex-col gap-4">
                                <p>{t(`stats.${stat.key}.label`)}</p>
                                <span className="text-4xl font-semibold md:text-5xl">
                                    {stat.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export { HeroBackground };