import { PET_ERROR_CODE } from './pet-error-code'

/**
 * Ожидаемые неуспешные исходы сценариев питомцев.
 */
export type PetErrorDetails =
  | Readonly<{
      code: typeof PET_ERROR_CODE.NOT_FOUND
      payload: Readonly<{
        petId: string
      }>
    }>
  | Readonly<{
      code: typeof PET_ERROR_CODE.TEMPORARILY_UNAVAILABLE
    }>

/**
 * Ожидаемая ошибка домена питомцев.
 */
export type PetDomainError = Error & Readonly<{
  name: 'PetDomainError'
  details: PetErrorDetails
}>

class PetDomainErrorImpl extends Error implements PetDomainError {
  readonly name: 'PetDomainError' = 'PetDomainError'

  constructor(readonly details: PetErrorDetails) {
    super(`pet:${details.code}`)
  }
}

/**
 * Проверяет, является ли значение ожидаемой ошибкой домена питомцев.
 */
export const isPetDomainError = (value: unknown): value is PetDomainError => {
  return value instanceof PetDomainErrorImpl
}

/**
 * Создаёт ошибку отсутствующего питомца.
 */
export const createPetNotFoundError = (petId: string): PetDomainError => {
  return new PetDomainErrorImpl({
    code: PET_ERROR_CODE.NOT_FOUND,
    payload: {
      petId
    }
  })
}

/**
 * Создаёт ошибку временно недоступного источника питомцев.
 */
export const createPetTemporarilyUnavailableError = (): PetDomainError => {
  return new PetDomainErrorImpl({
    code: PET_ERROR_CODE.TEMPORARILY_UNAVAILABLE
  })
}
