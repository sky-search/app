import type { AirportResponse } from "@/entities/airport"
import { typeSafeRequest } from "@/shared/lib/http"
import type { ApiRequestPayload } from "@/shared/types/http"

export async function searchAirports(
  payload: ApiRequestPayload<undefined, { query: string; limit?: number }>,
) {
  return await typeSafeRequest<
    undefined,
    { query: string; limit?: number },
    AirportResponse[]
  >({
    url: "api/v1/airports/search",
    method: "get",
    payload,
  })
}

export async function getAirportByIata(
  payload: ApiRequestPayload<undefined, undefined> & { iata_code: string },
) {
  return await typeSafeRequest<undefined, undefined, AirportResponse>({
    url: `api/v1/airports/${payload.iata_code}`,
    method: "get",
    payload,
  })
}
