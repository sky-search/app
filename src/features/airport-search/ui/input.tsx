"use client"

import { searchAirports } from "@/services/airport"
import { cn } from "@/shared/lib/utils"
import { buttonVariants } from "@/shared/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command"
import { useDebounce } from "@/shared/ui/multi-select"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { useQuery } from "@tanstack/react-query"
import { ChevronsUpDown, Loader2 } from "lucide-react"
import { useState } from "react"

type Props = {
  value: string
  onValueChange: (value: string) => void
}

export function AirportSearch(props: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const debouncedSearch = useDebounce<string>(search, 500)
  const result = useQuery({
    queryKey: ["airport-search", debouncedSearch],
    queryFn: async () => {
      const result = await searchAirports({
        params: { query: debouncedSearch },
      })
      if (result.isErr()) {
        throw result.error
      }
      return result.value
    },
    enabled: !!search,
  })

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger className={cn(buttonVariants({ variant: "outline" }))}>
        <span>{props.value || "Search dynamically..."}</span>
        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            onValueChange={setSearch}
            placeholder="Type to search..."
            value={search}
          />
          <CommandList>
            {result.isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="size-4 animate-spin" />
                <span className="ml-2 text-muted-foreground text-sm">
                  Searching...
                </span>
              </div>
            ) : (
              <>
                {!search && (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Start typing to search
                  </div>
                )}
                {search && result.data?.length === 0 && !result.isPending && (
                  <CommandEmpty>No results found.</CommandEmpty>
                )}
                {result.data && result.data.length > 0 && (
                  <CommandGroup>
                    {result.data.map((result) => (
                      <CommandItem
                        key={result.iata_code}
                        onSelect={(currentValue) => {
                          props.onValueChange(
                            currentValue === props.value ? "" : currentValue,
                          )
                          setOpen(false)
                        }}
                        value={result.iata_code}
                      >
                        {/* <Check
                          className={cn(
                            "mr-2 size-4",
                            props.value === result.iata_code
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        /> */}
                        {result.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
