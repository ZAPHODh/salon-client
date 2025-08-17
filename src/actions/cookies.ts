"use server"

import { cookies } from "next/headers"

const ONE_YEAR = 60 * 60 * 24 * 365;

export async function acceptCookies() {
    const store = await cookies();


    store.set("cookies_consent", "true", { maxAge: ONE_YEAR });
    store.set("analytics", "true", { maxAge: ONE_YEAR });
    store.set("preferences", "true", { maxAge: ONE_YEAR });
    store.set("marketing", "true", { maxAge: ONE_YEAR });
}

export async function declineCookies() {
    const store = await cookies();
    store.set("cookies_consent", "false", { maxAge: ONE_YEAR });
    store.delete("analytics");
    store.delete("preferences");
    store.delete("marketing");

}
