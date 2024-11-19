import { z } from "zod";

export const SignUpSchema = z.object({
    username: z.string().min(2,'username must be at least 2 characters').max(20,'username must be less than 20 characters'),
    email: z.string().email({message:'Invalid email address'}),
    password: z.string().min(6,'password must be at least 6 characters'),
});