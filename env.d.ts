declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            NEXT_PUBLIC_ADSENSE_PUB_ID: string
            NEXT_PUBLIC_GTM_ID: string
            NEXT_PUBLIC_BASE_URL: string
            SESSION_JWT_SECRET: string
            NEXT_PUBLIC_API_BASE_URL: string
            NEXT_PUBLIC_BASE_URL: string

        }
    }
}
export { }