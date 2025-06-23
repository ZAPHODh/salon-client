import { ReactNode } from "react";
import { useForm, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetDescription,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ZodSchema, z } from "zod";
import { useTranslations } from "next-intl";

type SheetFormProps<T extends ZodSchema<any>> = {
    title: string;
    schema: T;
    children: ReactNode;
    onSubmit: (values: z.infer<T>) => void;
    triggerLabel: ReactNode | string;
    defaultValues?: DefaultValues<z.infer<T>>;
};

export function SheetForm<T extends ZodSchema<any>>({
    title,
    schema,
    children,
    onSubmit,
    triggerLabel,
    defaultValues,
}: SheetFormProps<T>) {
    const t = useTranslations('table.sheetForm')
    const form = useForm<z.infer<T>>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="gap-2">{triggerLabel}</Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto flex flex-col h-full">
                <SheetTitle>{title}</SheetTitle>
                <SheetDescription>{t('description')}</SheetDescription>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 py-4"
                    >
                        {children}
                    </form>
                </Form>
                <SheetFooter >
                    <Button className="w-full" type="submit">
                        {t('create')}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}