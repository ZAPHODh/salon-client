'use client'

import { useSession } from "@/components/providers/session"

export default function Page() {
    const { session } = useSession()
    return <></>
}