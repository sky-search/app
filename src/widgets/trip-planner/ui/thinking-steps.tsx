import { cn } from "@/shared/lib/utils"
import { Brain, ChevronDown } from "lucide-react"
import { useState } from "react"

interface ThinkingStepsProps {
  steps: string[]
}

export function ThinkingSteps({ steps }: ThinkingStepsProps) {
  const [isOpen, setIsOpen] = useState(true)

  if (!steps || steps.length === 0) return null

  return (
    <div className="w-full mb-4 overflow-hidden rounded-lg bg-muted/30">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm text-muted-foreground font-medium transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-2">
          <Brain
            className={cn("size-4 text-primary", isOpen && "animate-pulse")}
          />
          <span>AI Thought Process</span>
        </div>
        <ChevronDown
          className={cn(
            "size-4 transition-transform duration-200",
            !isOpen && "-rotate-90",
          )}
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
          <ul className="space-y-2 border-l-2 border-primary/20 ml-2 pl-4">
            {steps.map((step, index) => (
              <li
                key={index}
                className="text-sm text-muted-foreground leading-relaxed"
              >
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
