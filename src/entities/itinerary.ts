export interface ItineraryActivity {
  time: string
  name: string
  category:
    | "attraction"
    | "restaurant"
    | "hotel"
    | "cafe"
    | "museum"
    | "shopping"
    | "other"
  description: string
  duration_minutes: number
  location: string
  location_lat: number
  location_lng: number
  cost: number
  currency: string
  place_id: number | string
  insider_tip: string
  booking_required: boolean
}

export interface ItineraryDay {
  day_number: number
  title: string
  activities: ItineraryActivity[]
}

export interface Itinerary {
  city: string
  country: string
  total_days: number
  interests: string[]
  pace: string
  days: ItineraryDay[]
  grounding?: {
    total_places_used: number
    verified_places: number
    sources: string[]
  }
}

export interface CityPreview {
  city: string
  is_ready: boolean
  total_places: number
  verified_places: number
  categories: Record<string, number>
  sample_places: Array<{
    name: string
    category: string
    rating: number
    verified: boolean
    has_tip: boolean
  }>
  has_metadata: boolean
  metadata: {
    cultural_badges: string[]
    best_months: string[]
    description: string
  }
  recommendation: string
}
