export type Session = {
    email: string;
    user: {
        id: string,
        name: string,
        emailVerified: boolean,
        image: string | undefined | null
    },
    accessToken: string;
    role: string
};
