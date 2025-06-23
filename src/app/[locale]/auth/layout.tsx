

import { ChevronLeft } from "lucide-react";

import React from "react";
import { AuthFooter } from "@/components/auth/auth-footer";
import { Link, redirect } from "@/i18n/navigation";
import { getServerSession } from "@/lib/auth/server-session";
import { getLocale } from "next-intl/server";


export default async function Page(props: { children: React.ReactNode }) {
    const session = await getServerSession()
    const locale = await getLocale()
    if (session) redirect({ href: '/account', locale })
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">

                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md">
                        <Link className="mt-10 w-fit text-zinc-950 dark:text-white" href="/">
                            <div className="flex w-fit items-center lg:pl-0 lg:pt-0 xl:pt-0">
                                <ChevronLeft className="mr-3 h-[13px] w-[8px] text-zinc-950 dark:text-white" />
                                <p className="ml-0 text-sm text-zinc-950 dark:text-white">
                                    Back to the website
                                </p>
                            </div>
                        </Link>
                        {props.children}
                    </div>
                </div>
                <AuthFooter />
            </div>
            <div className="relative hidden lg:block flex flex-col bg-black">
                <div className="relative z-10 h-full flex flex-col">
                    <div className="w-full flex flex-col items-center justify-center">
                        <h1 className="text-3xl font-extrabold text-white mb-4">
                            Welcome to PROJECT
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    )
}