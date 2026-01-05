import { FlightOffersList } from "@/features/flight-search/ui/flight-offers-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { TripItinerary } from "@/widgets/trip-planner/ui"
import { useParams } from "@tanstack/react-router"
import { useEffect } from "react"
import { useTripPreviewStore } from "../model/store"

export function TripPreview() {
  const store = useTripPreviewStore()

  return (
    <aside className="p-3 bg-background/70 border-l max-w-md min-w-md">
      <Tabs defaultValue="itineraryPlan" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="itineraryPlan">Itinerary plan</TabsTrigger>
          <TabsTrigger value="flightOffers">Flight offers</TabsTrigger>
        </TabsList>
        <TabsContent
          className="overflow-auto max-h-[85vh]"
          value="itineraryPlan"
        >
          {store.itinerary && <TripItinerary data={store.itinerary} />}
        </TabsContent>
        <TabsContent
          className="overflow-auto max-h-[85vh]"
          value="flightOffers"
        >
          {store.offers && <FlightOffersList offers={store.offers} />}
        </TabsContent>
      </Tabs>
      <RouteWatcher />
    </aside>
  )
}

function RouteWatcher() {
  const store = useTripPreviewStore()
  const params = useParams({
    from: "/_app/chat/$chatId/",
  })

  useEffect(() => {
    store.setOffers([])
    store.setItinerary(null)
    store.setSelectedOffer(null)
  }, [params.chatId])

  return null
}
