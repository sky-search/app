import { z } from "zod"

export const AirportSearchSchema = z.object({
  query: z.string().min(1).max(100),
  limit: z.number().min(1).max(50).default(10),
})
