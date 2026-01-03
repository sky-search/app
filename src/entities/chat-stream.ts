export interface ThinkingEventChunk {
  steps: string[]
  action?: string
}

export interface TokenEventChunk {
  content: string
}

export type SuggestionsEventChunk = Array<{
  label: string
  value: string
  type: "magic_action" | "action" | "query"
}>

export interface DoneEventChunk {
  session_id: string
}

export type EventChunk =
  | ThinkingEventChunk
  | TokenEventChunk
  | SuggestionsEventChunk
  | DoneEventChunk
