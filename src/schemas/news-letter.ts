"use client"

import { z } from "zod"

export const newsLetterSchema = z.object({
    email: z.string().email().min(1,)
})