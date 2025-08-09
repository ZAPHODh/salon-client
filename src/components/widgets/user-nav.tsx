'use client';


import { Link, useRouter } from "@/i18n/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useSession } from "../providers/session";
import { useEffect } from "react";
import { useTranslations } from "next-intl";


export function UserNav() {
    const { session, logout } = useSession()
    const t = useTranslations('header')
    const router = useRouter()

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                router.push('/account')
            }
            if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                router.push('/account/professionals')
            }
            if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                router.push('/account/billing')
            }
            if (e.key === "q" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                logout()
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    if (!session) return (
        <Button asChild >
            <Link href={"/auth/signin"} >
                {t('signin')}
            </Link>
        </Button>
    )
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                        <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {session.user.name || ''}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push('/account')}>
                        {t('profile')}
                        <DropdownMenuShortcut>⇧P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/account/professionals')}>
                        {t('professionals')}
                        <DropdownMenuShortcut>⇧B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/account/billing')}>
                        {t('plan')}
                        <DropdownMenuShortcut>⇧S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                    {t('logout')}
                    <DropdownMenuShortcut>⇧Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}