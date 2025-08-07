"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { Apple } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { signinSchema } from "@/schemas/signin";
import { useSession } from "../providers/session";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Session } from "@/lib/auth/types";


function SignIn({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const t = useTranslations('auth.signin');
    const { setSession } = useSession();
    const { refresh } = useRouter();

    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    async function onSubmit(values: z.infer<typeof signinSchema>) {
        const res = await fetch("/api/auth/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: values.email,
                password: values.password,
            }),
        });

        if (!res.ok) {
            toast(t('error.title'), { description: t('error.description') });
            return;
        }

        const session: Session = await res.json();
        setSession(session);
        refresh()
    }
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-2xl">{t('welcome')}</CardTitle>
                    <CardDescription>
                        {t('description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" className="w-full my-2 rounded">
                        <svg
                            className="w-4 h-4 text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="6"
                            height="6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {t('social', { provider: "Google" })}
                    </Button>
                    <Button variant="outline" className="w-full my-2 rounded">
                        <Apple width={4} height={4} />
                        {t('social', { provider: "Apple" })}
                    </Button>
                    <Separator />
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full my-2">
                            <div className="flex flex-col lg:flex-row gap-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('form.email.label')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('form.email.placeholder')} {...field} />
                                            </FormControl>
                                            <FormDescription>{t('form.email.description')}</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('form.password.label')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder={t('form.password.placeholder')}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>{t('form.password.description')}</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full rounded">
                                {t('submit')}
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        {t('noAccount')}{" "}
                        <Link href="/auth/signup" className="underline underline-offset-4">
                            {t('createAccount')}
                        </Link>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
export { SignIn }