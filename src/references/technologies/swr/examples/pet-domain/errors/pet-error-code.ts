/**
 * Коды ошибок домена питомцев.
 */
export const PET_ERROR_CODE = {
  /** Питомец не найден. */
  NOT_FOUND: 'PET_NOT_FOUND',
  /** Источник данных питомца недоступен. */
  UNAVAILABLE: 'PET_UNAVAILABLE',
  /** В домене питомцев произошёл непредвиденный сбой. */
  UNEXPECTED: 'PET_UNEXPECTED'
} as const

export type PetErrorCode = (typeof PET_ERROR_CODE)[keyof typeof PET_ERROR_CODE]
