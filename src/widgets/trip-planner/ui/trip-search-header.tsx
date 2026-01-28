import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Calendar, DollarSign, MapPin, Plus } from "lucide-react"
import { useState } from "react"

export function TripSearchHeader({
  setPrompt,
}: {
  setPrompt: (prompt: string) => void
}) {
  const [origin] = useState("London")
  const [destination, setDestination] = useState("")
  const [departureDate, setDepartureDate] = useState<string | undefined>(
    undefined,
  )
  const [arrivalDate, setArrivalDate] = useState<string | undefined>(undefined)
  const [budget, setBudget] = useState("")

  function handleCreatTrip() {
    // let's create a custom prompt from destination, dates, people and budget information
    // for now, create the prompt string and log it to the console
    let prompt = "Create me a trip plan for 5 days. "
    prompt += `Origin is ${origin}. `
    prompt += `Destination is ${destination}. `
    prompt += `Departure date is ${departureDate}. `
    prompt += `Arrival date is ${arrivalDate}. `
    prompt += `Budget is ${budget} USD. `
    setPrompt(prompt)
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center gap-3 px-6 py-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Where */}
          <div className="relative flex-1 max-w-xs">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Where"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="pl-10 bg-muted/50 border-0"
            />
          </div>

          {/* When */}
          <div className="relative flex-1 max-w-xs">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="date"
              placeholder="Departure date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="pl-10 bg-muted/50 border-0"
            />
          </div>

          {/* When */}
          <div className="relative flex-1 max-w-xs">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="date"
              placeholder="Arrival date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              className="pl-10 bg-muted/50 border-0"
            />
          </div>

          {/* Budget */}
          <div className="relative flex-1 max-w-xs">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="pl-10 bg-muted/50 border-0"
            />
          </div>
        </div>

        {/* Create a trip button */}
        <Button className="gap-2 shrink-0" onClick={handleCreatTrip}>
          <Plus className="size-4" />
          Create a trip
        </Button>
      </div>
    </header>
  )
}
