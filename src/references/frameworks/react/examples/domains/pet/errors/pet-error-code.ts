/**
 * Коды ожидаемых ошибок сценариев питомцев.
 */
export const PET_ERROR_CODE = {
  /** Питомец не найден. */
  NOT_FOUND: 'PET_NOT_FOUND',
  /** Источник временно недоступен, и сценарий допускает повтор. */
  TEMPORARILY_UNAVAILABLE: 'PET_TEMPORARILY_UNAVAILABLE'
} as const

export type PetErrorCode = (typeof PET_ERROR_CODE)[keyof typeof PET_ERROR_CODE]
