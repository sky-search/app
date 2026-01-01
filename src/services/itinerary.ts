import type { CityPreview, Itinerary } from "@/entities/itinerary"
import { typeSafeRequest } from "@/shared/lib/http"
import type { ApiRequestPayload } from "@/shared/types/http"

export async function generateItinerary(payload: ApiRequestPayload<any>) {
  return await typeSafeRequest<any, undefined, Itinerary>({
    url: "api/v1/itinerary/generate",
    method: "post",
    payload,
  })
}

export async function saveItinerary(payload: ApiRequestPayload<any>) {
  return await typeSafeRequest<
    any,
    undefined,
    { success: boolean; trip_id: number; message: string }
  >({
    url: "api/v1/itinerary/save",
    method: "post",
    payload,
  })
}

export async function getCityPreview(
  payload: ApiRequestPayload<undefined, { city: string }>,
) {
  return await typeSafeRequest<undefined, { city: string }, CityPreview>({
    url: "api/v1/itinerary/city-preview",
    method: "get",
    payload,
  })
}
