import { Button } from "@/shared/ui/button"
import { Sparkles } from "lucide-react"

interface Suggestion {
  label: string
  value: string
  type?: string
}

interface SuggestionListProps {
  suggestions: Suggestion[]
  onSelect: (value: string) => void
}

export function SuggestionList({ suggestions, onSelect }: SuggestionListProps) {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="mt-4 flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex w-full items-center gap-2 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold px-1">
        <Sparkles size={10} className="text-primary/60" />
        <span>Try asking</span>
      </div>
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSelect(suggestion.value)}
          className="h-8 rounded-full border-primary/10 bg-primary/5 px-4 text-xs font-medium transition-all hover:border-primary/30 hover:bg-primary/10 active:scale-95"
        >
          {suggestion.label}
        </Button>
      ))}
    </div>
  )
}
