export type DomainErrorDetails = Readonly<{
  code: string
  payload: unknown
}>

/**
 * Базовая ошибка для runtime-проверки ошибок любого домена.
 */
export class DomainError<TDetails extends DomainErrorDetails = DomainErrorDetails> extends Error {
  constructor(
    readonly domain: string,
    readonly details: TDetails,
    message = `${domain}:${details.code}`
  ) {
    super(message)
    this.name = 'DomainError'
  }
}

/**
 * Проверяет, является ли значение ошибкой какого-либо домена.
 */
export const isDomainError = (value: unknown): value is DomainError => {
  return value instanceof DomainError
}
