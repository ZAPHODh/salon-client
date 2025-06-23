import { SESSION_COOKIE_MAX_AGE, SESSION_COOKIE_NAME } from "@/lib/auth/helper";
import { encode } from "@/lib/auth/server-session";
import { signupSchema } from "@/schemas/signup";


import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({
            error: "Dados inválidos",
            details: parsed.error.flatten()
        }, { status: 400 });
    }
    const { email, name, password } = parsed.data
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/signup`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        }
    );

    const user = await res.json();
    if (user && res.ok) {
        const session = await encode(user);
        (await cookies()).set(SESSION_COOKIE_NAME, session, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + SESSION_COOKIE_MAX_AGE),
            sameSite: "lax",
            path: "/",
        });

        return NextResponse.json(user, { status: 200 });
    }

    return NextResponse.json(user, { status: 400 });
}