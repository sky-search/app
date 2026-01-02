export interface AirportResponse {
  iata_code: string
  icao_code: string | null
  name: string
  city: string
  country: string
  country_code: string
  timezone: string
  latitude: number | null
  longitude: number | null
}
