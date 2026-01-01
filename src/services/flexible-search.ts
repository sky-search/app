import type {
  CalendarResponse,
  FlexibleSearchResponse,
} from "@/entities/flexible-search"
import { typeSafeRequest } from "@/shared/lib/http"
import type { ApiRequestPayload } from "@/shared/types/http"

export async function searchFlexibleDates(payload: ApiRequestPayload<any>) {
  return await typeSafeRequest<any, undefined, FlexibleSearchResponse>({
    url: "api/v1/flights/search/flexible",
    method: "post",
    payload,
  })
}

export async function searchFlexibleCalendar(payload: ApiRequestPayload<any>) {
  return await typeSafeRequest<any, undefined, CalendarResponse>({
    url: "api/v1/flights/search/flexible/calendar",
    method: "post",
    payload,
  })
}
