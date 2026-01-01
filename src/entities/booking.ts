export interface BookingResponse {
  internal_booking_id: string
  booking_reference: string | null
  duffel_order_id: string | null
  status: string
  created_at: string
  origin: string
  destination: string
  departure_date: string
  total_price: number
  currency: string
  ticket_numbers: Record<string, unknown>[] | null
}

export interface BookingSummaryResponse {
  booking_id: string
  booking_reference: string
  origin_code: string
  origin_city: string
  destination_code: string
  destination_city: string
  departure_date: string
  return_date: string | null
  airline: string | null
  total_paid: number
  currency: string
  passengers_count: number
  is_international: boolean
}
