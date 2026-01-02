import { z } from "zod"

export const PlaceSearchSchema = z.object({
  query: z.string(),
  city: z.string().nullable().optional(),
  country_code: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  verified_only: z.boolean().default(true),
  max_price_level: z.number().min(1).max(4).nullable().optional(),
  limit: z.number().min(1).max(50).default(10),
})
