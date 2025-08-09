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
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string
            STRIPE_SECRET_KEY: string
            STRIPE_WEBHOOK_SECRET: string
            STRIPE_PRO_PLAN_ID: string
        }
    }
}
export { }