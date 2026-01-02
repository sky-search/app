import { z } from "zod"

export const GenerateItinerarySchema = z.object({
  user_request: z.string().min(1),
  city: z.string().min(1),
  days: z.number().int().positive().default(3),
  start_date: z.string().optional(),
  pace: z.enum(["relaxed", "moderate", "fast"]).optional(),
  interests: z.array(z.string()).optional(),
  budget: z.enum(["budget", "moderate", "luxury"]).optional(),
  max_price_level: z.number().int().min(1).max(4).optional(),
})

export type GenerateItineraryPayload = z.infer<typeof GenerateItinerarySchema>

export const SaveItinerarySchema = z.object({
  itinerary: z.any(), // Full itinerary object from /generate
  session_id: z.string().optional(),
})

export type SaveItineraryPayload = z.infer<typeof SaveItinerarySchema>
