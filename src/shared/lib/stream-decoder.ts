export abstract class Decoder {
  abstract decode(data: any): any
}

class StreamDecoder implements Decoder {
  private readonly decoder = new TextDecoder()

  decode(
    input?: AllowSharedBufferSource | undefined,
    options?: TextDecodeOptions,
  ): string {
    return this.decoder.decode(input, options)
  }
}

export const streamDecoder = new StreamDecoder()
