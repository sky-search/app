import type { ItineraryActivity } from "./itinerary"

export interface TripActivity extends ItineraryActivity {
  id: number
  order_index: number
  is_booked: boolean
  confirmation_code: string | null
}

export interface TripDay {
  id: number
  day_number: number
  date: string
  title: string
  activities: TripActivity[]
}

export interface Trip {
  id: number
  title: string
  destination: string
  destination_country: string
  destination_country_code: string
  start_date: string
  end_date: string
  status: "planning" | "active" | "completed" | "cancelled"
  total_cost: number
  currency: string
  pace: string
  vibe_tags: string[]
  cover_image_url: string
  session_id: string | null
  created_at: string
  updated_at: string
  days: TripDay[]
}
