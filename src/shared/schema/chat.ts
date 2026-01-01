import { z } from "zod"

export const SendMessageSchema = z.object({
  message: z.string().min(1),
  session_id: z.string().optional(),
  user_id: z.number().optional(),
  stream: z.boolean().default(false),
  save_trip: z.boolean().default(false),
})

export type SendMessagePayload = z.infer<typeof SendMessageSchema>
