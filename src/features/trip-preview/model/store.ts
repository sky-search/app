import type { FlightOffer } from "@/features/flight-search"
import type { TripData } from "@/widgets/trip-planner/ui/trip-itinerary"
import { create } from "zustand"

interface TripPreviewStore {
  itinerary: TripData | null
  offers: FlightOffer[] | null
  selectedOffer: FlightOffer | null
  setSelectedOffer: (offer: FlightOffer | null) => void
  setItinerary: (itinerary: TripData | null) => void
  setOffers: (offers: FlightOffer[]) => void
  openModal: () => void
  closeModal: () => void
  isModalOpen: boolean
}

export const useTripPreviewStore = create<TripPreviewStore>((set) => ({
  itinerary: null,
  offers: null,
  selectedOffer: null,
  setSelectedOffer: (offer) => set({ selectedOffer: offer }),
  setItinerary: (itinerary) => set({ itinerary }),
  setOffers: (offers) => set({ offers }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () =>
    set({
      isModalOpen: false,
      selectedOffer: null,
      itinerary: null,
      offers: null,
    }),
  isModalOpen: false,
}))
