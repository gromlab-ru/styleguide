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
 * Ожидаемые неуспешные исходы операции получения питомца.
 */
export type GetPetErrorDetails = Extract<
  PetErrorDetails,
  Readonly<{
    code:
      | typeof PET_ERROR_CODE.NOT_FOUND
      | typeof PET_ERROR_CODE.TEMPORARILY_UNAVAILABLE
  }>
>

/**
 * Ожидаемая ошибка домена питомцев.
 */
export type PetDomainError = Error & Readonly<{
  name: 'PetDomainError'
  details: PetErrorDetails
}>

/**
 * Ожидаемая ошибка операции получения питомца.
 */
export type GetPetError = PetDomainError & Readonly<{
  details: GetPetErrorDetails
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
 * Проверяет ожидаемые ошибки операции получения питомца.
 */
export const isGetPetError = (value: unknown): value is GetPetError => {
  return (
    isPetDomainError(value) &&
    (value.details.code === PET_ERROR_CODE.NOT_FOUND ||
      value.details.code === PET_ERROR_CODE.TEMPORARILY_UNAVAILABLE)
  )
}

/**
 * Создаёт ошибку отсутствующего питомца.
 */
export const createPetNotFoundError = (petId: string): GetPetError => {
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
export const createPetTemporarilyUnavailableError = (): GetPetError => {
  return new PetDomainErrorImpl({
    code: PET_ERROR_CODE.TEMPORARILY_UNAVAILABLE
  })
}
