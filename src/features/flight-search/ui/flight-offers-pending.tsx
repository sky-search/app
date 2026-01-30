import { Loader2 } from "lucide-react"

export function FlightOffersPending() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
  )
}
