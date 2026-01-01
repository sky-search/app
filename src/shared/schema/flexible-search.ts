import { z } from "zod"

export const FlexibleSearchSchema = z.object({
  origin: z.string().length(3),
  destination: z.string().length(3),
  trip_length_days: z.number().min(1).max(365),
  search_window_days: z.number().min(7).max(365).default(30),
  earliest_departure: z.string().nullable().optional(),
  latest_departure: z.string().nullable().optional(),
  specific_month: z.string().nullable().optional(),
  passengers: z
    .array(
      z.object({
        type: z.string().optional(),
        age: z.number().min(0).max(120).optional(),
      }),
    )
    .default([{ type: "adult" }]),
  cabin_class: z.string().default("economy"),
  max_connections: z.number().min(0).max(2).default(1),
  currency: z.string().default("USD"),
  date_combinations: z.number().min(5).max(20).default(15),
  sampling_strategy: z
    .enum(["uniform", "weekends", "weekdays", "biweekly", "smart"])
    .default("smart"),
  include_direct_only: z.boolean().default(false),
  max_price: z.number().nullable().optional(),
})
