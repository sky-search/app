import { z } from "zod"

export const PassengerInputSchema = z.object({
  duffel_passenger_id: z.string().nullable().optional(),
  type: z.enum(["adult", "child", "infant_without_seat"]).default("adult"),
  title: z.enum(["mr", "ms", "mrs", "miss", "dr", "rev"]),
  given_name: z.string().min(1),
  family_name: z.string().min(1),
  gender: z.enum(["m", "f"]),
  born_on: z.string(), // ISO date
  email: z.string().email().nullable().optional(),
  phone_number: z.string().nullable().optional(),
  identity_documents: z
    .array(
      z.object({
        unique_identifier: z.string(),
        type: z.string().default("passport"),
        issuing_country_code: z.string().length(2),
        expires_on: z.string(), // ISO date
      }),
    )
    .nullable()
    .optional(),
})

export const CreateBookingSchema = z.object({
  offer_id: z.string(),
  passengers: z.array(PassengerInputSchema),
  payment_type: z.enum(["instant", "hold"]).default("hold"),
  service_ids: z.array(z.string()).nullable().optional(),
  contact_email: z.string().email().nullable().optional(),
  contact_phone: z.string().nullable().optional(),
})
