"use client"

export interface CookieOptions {
    expires?: Date | number
    path?: string
    domain?: string
    secure?: boolean
    sameSite?: "strict" | "lax" | "none"
}

export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof document === "undefined") return

    const { expires, path = "/", domain, secure = true, sameSite = "lax" } = options

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

    if (expires) {
        const expiresDate = typeof expires === "number" ? new Date(Date.now() + expires) : expires
        cookieString += `; expires=${expiresDate.toUTCString()}`
    }

    cookieString += `; path=${path}`

    if (domain) {
        cookieString += `; domain=${domain}`
    }

    if (secure) {
        cookieString += "; secure"
    }

    cookieString += `; samesite=${sameSite}`

    document.cookie = cookieString
}

export function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null

    const nameEQ = `${encodeURIComponent(name)}=`
    const cookies = document.cookie.split(";")

    for (let cookie of cookies) {
        cookie = cookie.trim()
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length))
        }
    }

    return null
}

export function deleteCookie(name: string, options: Omit<CookieOptions, "expires"> = {}): void {
    setCookie(name, "", {
        ...options,
        expires: new Date(0),
    })
}

export function getAllCookies(): Record<string, string> {
    if (typeof document === "undefined") return {}

    const cookies: Record<string, string> = {}
    const cookieArray = document.cookie.split(";")

    for (let cookie of cookieArray) {
        cookie = cookie.trim()
        const [name, value] = cookie.split("=")
        if (name && value) {
            cookies[decodeURIComponent(name)] = decodeURIComponent(value)
        }
    }

    return cookies
}
