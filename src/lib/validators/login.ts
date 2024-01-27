import { z } from "zod"

export const LoginValidator = z.object({
  email: z.string().refine((value) => !!value, { message: "Email is required." }),
  password: z.string().refine((value) => !!value, { message: "Password is required." }),
})

export type LoginRequest = z.infer<typeof LoginValidator>
