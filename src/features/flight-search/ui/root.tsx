import { ScrollArea } from "@/shared/ui/scroll-area"
import { useFlightPreviewStore } from "../model/store"
import { FlightOffersList } from "./flight-offers-list"

export function FlightPreview() {
  const store = useFlightPreviewStore()

  return (
    <ScrollArea className="flex-1 min-h-0 w-full">
      <div className="p-6 pb-24">
        {store.offers && <FlightOffersList offers={store.offers} />}
      </div>
    </ScrollArea>
  )
}
