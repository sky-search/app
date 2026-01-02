export type DateSamplingStrategy =
  | "uniform"
  | "weekends"
  | "weekdays"
  | "biweekly"
  | "smart"

export interface DateOption {
  outbound_date: string
  return_date: string
  outbound_day_of_week: string
  return_day_of_week: string
  cheapest_price: number
  currency: string
  cheapest_offer_id: string
  total_offers_found: number
  is_weekend_departure: boolean
  is_weekend_return: boolean
  flight_duration_minutes: number | null
  stops: number | null
  airline: string | null
  rank: number
  savings_vs_most_expensive: number | null
  price_category: string
}

export interface FlexibleSearchResponse {
  request_summary: Record<string, unknown>
  options: DateOption[]
  statistics: Record<string, unknown>
  output_format: string
  cached: boolean
  search_duration_seconds: number
}

export interface CalendarDay {
  date: string
  day_of_week: string
  price: number | null
  currency: string | null
  offer_id: string | null
  return_date: string | null
  is_weekend: boolean
  price_category: string | null
}

export interface CalendarResponse {
  request_summary: Record<string, unknown>
  calendar: CalendarDay[][]
  month: string
  year: number
  statistics: Record<string, unknown>
}
