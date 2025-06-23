export const salonConfigSteps: any = [
    {
        tour: "salonConfig",
        steps: [
            {
                icon: <>👋</>,
                title: "Welcome to Salon Configuration!",
                content: (
                    <>This guide will help you set up your salon's basic information and operating hours. Let's get started! </>
                ),
                selector: "#salon-config-card",
                side: "top",
                showControls: true,
                pointerPadding: 0,
                pointerRadius: 11,
            },
            {
                icon: <>✏️</>,
                title: "Salon Information",
                content: <>Start by entering your salon's name. This is how customers will identify your business.</>,
                selector: "#salon-name-input",
                side: "bottom",
                showControls: true,
                pointerPadding: 0,
                pointerRadius: 11,
            },
            {
                icon: <>🌎</>,
                title: "Country Selection",
                content: <>Select your country to ensure the correct postal code format and address lookup.</>,
                selector: "#country-select",
                side: "bottom",
                showControls: true,
                pointerPadding: 0,
                pointerRadius: 11,
            },
            {
                icon: <>📮</>,
                title: "Postal Code Magic",
                content: <>Enter your postal code and watch as we automatically fill in your address information! </>,
                selector: "#postal-code-input",
                side: "bottom",
                showControls: true,
                pointerPadding: 0,
                pointerRadius: 11,
            },
            {
                icon: <>📍</>,
                title: "Address Details",
                content: <>Confirm your address details or make any necessary adjustments.</>,
                selector: "#address-input",
                side: "bottom",
                showControls: true,
                pointerPadding: 0,
                pointerRadius: 11,
            },
            {
                icon: <>🕒</>,
                title: "Working Hours",
                content: (
                    <>Set your salon's working hours for each day of the week. Toggle days on/off and set specific hours.</>
                ),
                selector: "#working-hours-section",
                side: "top",
                showControls: true,
                pointerPadding: 0,
                pointerRadius: 11,
            },
            {
                icon: <>👁️</>,
                title: "Visible Hours",
                content: <>Define the visible hours for your calendar.This determines what time range is shown by default.</>,
                selector: "#visible-hours-section",
                side: "top",
                showControls: true,
                pointerPadding: 0,
                pointerRadius: 11,
            },
            {
                icon: <>💾</>,
                title: "Save Your Configuration",
                content: <>When you're done, click the Save Configuration button to apply all your settings.</>,
                selector: "#save-config-button",
                side: "top",
                showControls: true,
                pointerPadding: 0,
                pointerRadius: 11,
            },
            {
                icon: <>🎉</>,
                title: "All Set!",
                content: (
                    <>
                        Congratulations! Your salon is now configured and ready to go.You can always come back to update these
                        settings.
                    </>
                ),
                selector: "#salon-config-card",
                side: "top",
                showControls: true,
                pointerPadding: 0,
                pointerRadius: 11,
            },
        ],
    },
]