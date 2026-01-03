export abstract class ChunkDecoder {
  abstract parse(data: string): any
  abstract decode(): any
}
