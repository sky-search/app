import { useFlightPreviewStore } from "../../model/store"
import type { FlightOffer } from "../../ui/flight-offers-list"

export function useFlightPreview() {
  const store = useFlightPreviewStore()

  function execute(offers: FlightOffer[]) {
    store.setOffers(offers)
    store.setIsModalOpen(true)
  }

  return execute
}
