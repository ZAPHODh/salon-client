import { verifySession } from "@/lib/auth/dal";
import { encode, updateSession } from "@/lib/auth/server-session";

import { NextResponse } from "next/server";

export async function POST() {
    const { session } = await verifySession()

    if (!session) {

        return new Response(null, { status: 401 })
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/refresh-token`,
        {
            method: "POST",
            headers: { Authorization: `Bearer ${session.accessToken}` },
        }
    );
    const payload = await res.json()
    if (res.ok && payload) {
        const newSession = await encode(payload)
        await updateSession(newSession)
        return NextResponse.json(payload, { status: 200 });
    }
    return NextResponse.json({}, { status: 401 });
}