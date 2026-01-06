export interface ThinkingEventChunk {
  type: "thinking"
  steps: string[]
  action?: string
}

export interface TokenEventChunk {
  type: "token"
  content: string
}

export type SuggestionsEventChunk = Array<{
  type: "suggestion"
  label: string
  value: string
  suggestionType: "magic_action" | "action" | "query"
}>

export interface DoneEventChunk {
  type: "done"
  session_id: string
}

export type EventChunk =
  | ThinkingEventChunk
  | TokenEventChunk
  | SuggestionsEventChunk
  | DoneEventChunk
