import { z } from "zod"

export const RegisterValidator = z.object({
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Invalid username, choose a valid username",
    })
    .min(2, {
      message: "Username must be at least 2 characters.",
    })

    .refine((value) => !!value, { message: "Username is required." }),
  email: z.string().refine((value) => !!value, { message: "Email is required." }),
  password: z
    .string()
    .min(6, { message: "Password must be greater than 6" })
    .refine((value) => !!value, { message: "Password is required." }),
})

export type RegisterRequest = z.infer<typeof RegisterValidator>
