import type {
  SuggestionsEventChunk,
  ThinkingEventChunk,
  TokenEventChunk,
} from "@/entities/chat-stream"
import type { ContentStreamChunk, ThinkingStreamChunk } from "@tanstack/ai"
import { CryptoIdGenerator } from "./id-generator"

export abstract class EventParser {
  abstract parse<T = unknown>(data: string): T
}

export class TokenParser implements EventParser {
  private readonly idGenerator = CryptoIdGenerator.new()

  parse<T = TokenEventChunk>(data: string): T {
    return JSON.parse(data) as T
  }

  self(): TokenParser {
    return this
  }

  static new(): TokenParser {
    return new TokenParser()
  }

  format(data: TokenEventChunk) {
    const id = this.idGenerator.generate()
    const timestamp = Date.now()

    return {
      id,
      timestamp,
      type: "content",
      delta: data.content || "",
      content: data.content || "",
      role: "assistant",
      model: "gpt-5.1",
    } satisfies ContentStreamChunk
  }
}

export class ThinkingParser implements EventParser {
  private readonly idGenerator = CryptoIdGenerator.new()

  parse<T = ThinkingEventChunk>(data: string): T {
    return JSON.parse(data) as T
  }

  self(): ThinkingParser {
    return this
  }

  static new(): ThinkingParser {
    return new ThinkingParser()
  }

  format(data: ThinkingEventChunk) {
    const id = this.idGenerator.generate()
    const timestamp = Date.now()

    return {
      id,
      timestamp,
      type: "thinking",
      delta: data.steps.join("\n") || "",
      content: data.steps.join("\n") || "",
      model: "gpt-5.1",
    } satisfies ThinkingStreamChunk
  }
}

export class SuggestionsParser implements EventParser {
  private readonly idGenerator = CryptoIdGenerator.new()

  parse<T = SuggestionsEventChunk>(data: string): T {
    return JSON.parse(data) as T
  }

  self(): SuggestionsParser {
    return this
  }

  static new(): SuggestionsParser {
    return new SuggestionsParser()
  }

  format(data: SuggestionsEventChunk) {
    const id = this.idGenerator.generate()
    const timestamp = Date.now()

    return {
      id,
      timestamp,
      type: "content",
      role: "assistant",
      model: "gpt-5.1",
      metadata: {
        type: "suggestions",
        value: data,
      },
      delta: "",
      content: "",
    } satisfies ContentStreamChunk & {
      metadata: {
        type: "suggestions"
        value: SuggestionsEventChunk
      }
    }
  }
}
