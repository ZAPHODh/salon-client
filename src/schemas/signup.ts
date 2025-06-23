
import { z } from "zod";

export const signupSchema = z.object({
    name: z
        .string()
        .min(1)
        .toLowerCase(),
    email: z
        .string()
        .email(),
    password: z
        .string()
        .min(8),
});