import type { TripData } from "@/widgets/trip-planner/ui/trip-itinerary"
import { create } from "zustand"

export const useItineraryPreviewStore = create<{
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
  itinerary: TripData | null
  setItinerary: (value: TripData | null) => void
}>()((set) => ({
  isModalOpen: false,
  setIsModalOpen: (value: boolean) => {
    if (value === false) {
      return set({ itinerary: null, isModalOpen: value })
    }
    return set({ isModalOpen: value })
  },
  itinerary: null,
  setItinerary: (value: TripData | null) => set({ itinerary: value }),
}))
