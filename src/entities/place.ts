export interface PlaceResponse {
  id: number
  name: string
  city: string
  country_code: string
  category: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  price_level: number | null
  rating: number | null
  review_count: number
  travo_verified: boolean
  insider_tip: string | null
  vibe_tags: string[] | null
  cover_image_url: string | null
  google_place_id: string | null
  qdrant_point_id: string | null
}

export interface PlaceSearchResult extends PlaceResponse {
  similarity_score: number
}

export interface DestinationMetadataResponse {
  id: number
  city: string
  country_code: string
  cultural_badges: string[] | null
  plov_index_price: number | null
  best_months_to_visit: string[] | null
  description_short: string | null
  cover_image_url: string | null
  timezone: string | null
  primary_language: string | null
  visa_required_for: string[] | null
}
