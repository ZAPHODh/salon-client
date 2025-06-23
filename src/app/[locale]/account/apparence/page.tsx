import { AppearanceForm } from "@/components/account/apparence-form";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

export default function Page() {
    const t = useTranslations('account.appearance');

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">{t('title')}</h3>
                <p className="text-sm text-muted-foreground">
                    {t('description')}
                </p>
            </div>
            <Separator />
            <AppearanceForm />
        </div>
    )
}