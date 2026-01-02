import { z } from "zod"

export const CreateTripSchema = z.object({
  title: z.string().min(1),
  destination: z.string().min(1),
  destination_country: z.string().min(1),
  destination_country_code: z.string().length(2),
  start_date: z.string(),
  end_date: z.string(),
  status: z
    .enum(["planning", "active", "completed", "cancelled"])
    .default("planning"),
  total_cost: z.number().nonnegative().default(0.0),
  currency: z.string().default("USD"),
  pace: z.string().optional(),
  vibe_tags: z.array(z.string()).default([]),
  cover_image_url: z.string().url().optional(),
  session_id: z.string().optional(),
})

export type CreateTripPayload = z.infer<typeof CreateTripSchema>

export const UpdateTripSchema = CreateTripSchema.partial()

export type UpdateTripPayload = z.infer<typeof UpdateTripSchema>

export const AddTripDaySchema = z.object({
  day_number: z.number().int().positive(),
  date: z.string(),
  title: z.string().min(1),
})

export type AddTripDayPayload = z.infer<typeof AddTripDaySchema>

export const AddActivitySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  location_lat: z.number().optional(),
  location_lng: z.number().optional(),
  time: z.string().optional(),
  duration_minutes: z.number().int().positive().optional(),
  cost: z.number().nonnegative().default(0.0),
  currency: z.string().default("USD"),
  category: z.enum([
    "attraction",
    "restaurant",
    "hotel",
    "transportation",
    "activity",
    "shopping",
    "nightlife",
    "other",
  ]),
  order_index: z.number().int().nonnegative().default(0),
  booking_url: z.string().url().optional(),
  is_booked: z.boolean().default(false),
  confirmation_code: z.string().optional(),
})

export type AddActivityPayload = z.infer<typeof AddActivitySchema>
