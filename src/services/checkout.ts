import type { CheckoutSession } from "@/entities/checkout"
import { typeSafeRequest } from "@/shared/lib/http"
import type { ApiRequestPayload } from "@/shared/types/http"

export async function initiateCheckout(payload: ApiRequestPayload<any>) {
  return await typeSafeRequest<any, undefined, CheckoutSession>({
    url: "api/v1/checkout/initiate",
    method: "post",
    payload,
  })
}

export async function submitPassengers(payload: ApiRequestPayload<any>) {
  return await typeSafeRequest<
    any,
    undefined,
    {
      checkout_session_id: string
      passengers_valid: boolean
      ready_for_payment: boolean
      validation_errors: any | null
    }
  >({
    url: "api/v1/checkout/passengers",
    method: "post",
    payload,
  })
}

export async function confirmPayment(payload: ApiRequestPayload<any>) {
  return await typeSafeRequest<any, undefined, any>({
    url: "api/v1/checkout/confirm",
    method: "post",
    payload,
  })
}

export async function getCheckoutSession(
  payload: ApiRequestPayload<undefined, undefined> & { session_id: string },
) {
  return await typeSafeRequest<undefined, undefined, any>({
    url: `api/v1/checkout/session/${payload.session_id}`,
    method: "get",
    payload,
  })
}

export async function createHoldOrder(payload: ApiRequestPayload<any>) {
  return await typeSafeRequest<any, undefined, any>({
    url: "api/v1/checkout/hold",
    method: "post",
    payload,
  })
}
