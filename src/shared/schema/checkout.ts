import { z } from "zod"

export const InitiateCheckoutSchema = z.object({
  offer_id: z.string().min(1),
  user_id: z.number().optional(),
  email: z.string().email().optional(),
  selected_services: z.array(z.string()).default([]),
  markup_amount: z.number().nonnegative().default(0.0),
  metadata: z.record(z.string(), z.any()).optional(),
})

export type InitiateCheckoutPayload = z.infer<typeof InitiateCheckoutSchema>

export const PassengerSchema = z.object({
  offer_passenger_id: z.string().min(1),
  type: z.enum(["adult", "child", "infant"]),
  title: z.string().min(1),
  given_name: z.string().min(1),
  family_name: z.string().min(1),
  gender: z.enum(["m", "f"]),
  born_on: z.string(),
  email: z.string().email(),
  phone_number: z.string(),
  identity_documents: z
    .array(
      z.object({
        type: z.enum(["passport", "id_card"]),
        unique_identifier: z.string().min(1),
        issuing_country_code: z.string().length(2),
        expires_on: z.string(),
      }),
    )
    .min(1),
})

export const SubmitPassengersSchema = z.object({
  checkout_session_id: z.string().min(1),
  passengers: z.array(PassengerSchema).min(1),
  contact_email: z.string().email(),
  contact_phone: z.string(),
})

export type SubmitPassengersPayload = z.infer<typeof SubmitPassengersSchema>
