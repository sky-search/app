export abstract class IdGenerator {
  abstract generate(): string
}

export class CryptoIdGenerator implements IdGenerator {
  generate(): string {
    return crypto.randomUUID()
  }

  static new(): CryptoIdGenerator {
    return new CryptoIdGenerator()
  }
}
