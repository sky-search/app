import { TripItinerary } from "@/widgets/trip-planner/ui"
import { useItineraryPreviewStore } from "../model/store"

export function ItineraryPreview() {
  const store = useItineraryPreviewStore()

  if (store.itinerary) {
    return <TripItinerary data={store.itinerary} />
  }

  return null
}
