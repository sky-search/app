import type {
  DestinationMetadataResponse,
  PlaceResponse,
  PlaceSearchResult,
} from "@/entities/place"
import { typeSafeRequest } from "@/shared/lib/http"
import type { ApiRequestPayload } from "@/shared/types/http"

export async function searchPlaces(payload: ApiRequestPayload<undefined, any>) {
  return await typeSafeRequest<undefined, any, PlaceSearchResult[]>({
    url: "api/v1/places/search",
    method: "get",
    payload,
  })
}

export async function getPlacesByCity(
  payload: ApiRequestPayload<
    undefined,
    { category?: string; verified_only?: boolean; limit?: number }
  > & { city: string },
) {
  return await typeSafeRequest<
    undefined,
    { category?: string; verified_only?: boolean; limit?: number },
    PlaceResponse[]
  >({
    url: `api/v1/places/city/${payload.city}`,
    method: "get",
    payload,
  })
}

export async function getDestinationMetadata(
  payload: ApiRequestPayload<undefined, undefined> & { city: string },
) {
  return await typeSafeRequest<
    undefined,
    undefined,
    DestinationMetadataResponse
  >({
    url: `api/v1/places/destinations/${payload.city}`,
    method: "get",
    payload,
  })
}
