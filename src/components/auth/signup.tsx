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
import { LoaderCircle } from "lucide-react";

import { signupSchema } from "@/schemas/signup";
import { Link, useRouter } from "@/i18n/navigation";
import { useSession } from "../providers/session";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { PasswordInput } from "../ui/input/password";
import { useState } from "react";

function SignUp({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const t = useTranslations('auth.signup');
    const { setSession } = useSession()
    const { push } = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",

        },
    });
    const passwordRequirements = [
        { regex: /.{8,}/, text: t('password.requirements.length') },
        { regex: /[0-9]/, text: t('password.requirements.number') },
        { regex: /[a-z]/, text: t('password.requirements.lowercase') },
        { regex: /[A-Z]/, text: t('password.requirements.uppercase') },
    ];

    async function onSubmit(values: z.infer<typeof signupSchema>) {
        setIsLoading(true);
        const res = await fetch(`/api/auth/credentials-signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: values.name,
                email: values.email,
                password: values.password,
            }),
        });
        const session = await res.json();
        if (!res.ok) {
            toast(t('error.title'), { description: t('error.description') });
            setIsLoading(false);
            return;
        }
        setSession(session);
        setIsLoading(false);
        push('/settings')
    }

    return (
        <div className={cn("flex flex-col", className)} {...props}>
            <Card className="shadow-none border-none">
                <CardHeader>
                    <CardTitle className="text-2xl">{t('title')}</CardTitle>
                    <CardDescription>
                        {t('description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 w-full my-2"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('form.name.label')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('form.name.placeholder')} {...field} />
                                        </FormControl>
                                        <FormDescription>{t('form.name.description')}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                            <PasswordInput
                                                requirements={passwordRequirements}
                                                showStrength={true}
                                                placeholder={t('form.password.placeholder')}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* <Separator />
                            <div>
                                <Button variant="outline" className="w-full my-2 rounded gap-2">
                                    <svg
                                        className="w-4 h-4 text-gray-800 dark:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="4"
                                        height="4"
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
                                <Button variant="outline" className="w-full my-2 rounded gap-2">
                                    <Apple className="w-4 h-4" />
                                    {t('social', { provider: "Apple" })}
                                </Button>
                            </div> */}
                            <Separator />
                            <Button type="submit" className="w-full rounded" disabled={isLoading}>
                                {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {t('submit')}
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-xs p-0 m-0">
                        {t('hasAccount')}{" "}
                        <Link href="/signin" className="underline underline-offset-4">
                            {t('login')}
                        </Link>
                        <div className="mt-4 text-center text-xs p-0 m-0">
                            {t('terms')}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div >
    );
}
export { SignUp }