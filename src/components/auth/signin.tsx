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
import { LoaderCircle } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { signinSchema } from "@/schemas/signin";
import { useSession } from "../providers/session";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Session } from "@/lib/auth/types";
import { useState } from "react";


function SignIn({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const t = useTranslations('auth.signin');
    const [isLoading, setIsLoading] = useState(false);
    const { setSession } = useSession();
    const { push } = useRouter()

    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    async function onSubmit(values: z.infer<typeof signinSchema>) {
        setIsLoading(true);
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
            setIsLoading(false);
            return;
        }

        const session: Session = await res.json();
        setSession(session);
        setIsLoading(false);
        push('/account/salon')
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
                            <Button type="submit" className="w-full rounded" disabled={isLoading}>
                                {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
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