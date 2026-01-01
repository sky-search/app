import type { BookingResponse } from "@/entities/booking"
import { typeSafeRequest } from "@/shared/lib/http"
import type { ApiRequestPayload } from "@/shared/types/http"

export async function createBooking(payload: ApiRequestPayload<any>) {
  return await typeSafeRequest<any, undefined, BookingResponse>({
    url: "api/v1/bookings/",
    method: "post",
    payload,
  })
}

export async function listUserBookings(
  payload: ApiRequestPayload<undefined, undefined>,
) {
  return await typeSafeRequest<undefined, undefined, BookingResponse[]>({
    url: "api/v1/bookings/my-bookings",
    method: "get",
    payload,
  })
}

export async function getBookingById(
  payload: ApiRequestPayload<undefined, undefined> & { booking_id: string },
) {
  return await typeSafeRequest<undefined, undefined, BookingResponse>({
    url: `api/v1/bookings/${payload.booking_id}`,
    method: "get",
    payload,
  })
}

export async function cancelBooking(
  payload: ApiRequestPayload<undefined, undefined> & { booking_id: string },
) {
  return await typeSafeRequest<undefined, undefined, BookingResponse>({
    url: `api/v1/bookings/${payload.booking_id}/cancel`,
    method: "post",
    payload,
  })
}
