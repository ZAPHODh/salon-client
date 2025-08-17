export function updateGoogleConsent(accepted: boolean) {
    if (typeof window === "undefined") return;

    window.gtag?.("consent", "update", {
        ad_storage: accepted ? "granted" : "denied",
        analytics_storage: accepted ? "granted" : "denied",
        personalization_storage: accepted ? "granted" : "denied",
    });
}