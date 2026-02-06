import { type AirportSearchPayload, searchAirports } from "@/services/airport"
import { createQuery } from "react-query-kit"

export const airportSearchQuery = createQuery({
  fetcher: async (payload: AirportSearchPayload) => {
    const result = await searchAirports(payload)
    if (result.isErr()) {
      throw result.error
    }
    return result.value
  },
  queryKey: ["airport-search"],
})
