import * as z from "zod"
export const Signupvalidation = z.object({
    name: z.string().min(2,{message: 'Too short'}),
    username: z.string().min(2,{message: 'Too short'}),
    email: z.string().email(),
    password: z.string().min(8,{message: 'Too short'})
  })

export const Signinvalidation = z.object({
    email: z.string().email(),
    password: z.string().min(8,{message: 'Too short'})
  })

  export const PostValidation = z.object({
    caption: z.string().min(5).max(2200),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(100),
    tags: z.string(),
  })