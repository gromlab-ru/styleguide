import { DomainError } from '../../shared/errors'
import { PET_ERROR_CODE } from './pet-error-code'

/**
 * Допустимые ошибки домена питомцев.
 */
export type PetErrorDetails =
  | Readonly<{
      code: typeof PET_ERROR_CODE.NOT_FOUND
      payload: Readonly<{
        petId: string
      }>
    }>
  | Readonly<{
      code: typeof PET_ERROR_CODE.UNAVAILABLE
      payload: Readonly<{
        retryable: boolean
      }>
    }>
  | Readonly<{
      code: typeof PET_ERROR_CODE.UNEXPECTED
      payload: Readonly<{
        error: unknown
      }>
    }>

/**
 * Ошибка домена питомцев.
 */
export class PetDomainError extends DomainError<PetErrorDetails> {
  constructor(details: PetErrorDetails) {
    super('pet', details)
    this.name = 'PetDomainError'
  }
}

/**
 * Проверяет, является ли значение ошибкой домена питомцев.
 */
export const isPetDomainError = (value: unknown): value is PetDomainError => {
  return value instanceof PetDomainError
}
