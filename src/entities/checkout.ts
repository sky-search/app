export interface Passenger {
  offer_passenger_id: string
  type: "adult" | "child" | "infant"
  title: string
  given_name: string
  family_name: string
  gender: "m" | "f"
  born_on: string
  email: string
  phone_number: string
  identity_documents: Array<{
    type: "passport" | "id_card"
    unique_identifier: string
    issuing_country_code: string
    expires_on: string
  }>
}

export interface CheckoutSession {
  checkout_session_id: string
  client_token: string
  offer_amount: number
  markup_amount: number
  service_fee: number
  total_amount: number
  currency: string
  offer_expires_at: string
  session_expires_at: string
  offer_summary: {
    airline: string
    route: string
    departure: string
    passengers: number
  }
  passenger_requirements: {
    identity_documents_required: boolean
    passport_required: boolean
  }
}
