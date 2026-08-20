import type { SWRResponse } from 'swr'
import type { ApiError, petStoreApi } from 'src/infra/pet-store-api'

/**
 * Данные авторизованного запроса питомца.
 */
export type GetAuthPetData = Awaited<ReturnType<typeof petStoreApi.pets.getPet>>

/**
 * Ошибка авторизованного запроса питомца.
 */
export type GetAuthPetError = ApiError<unknown>

/**
 * Ключ cache авторизованного запроса питомца.
 */
export type GetAuthPetKey = readonly [
  'pet-store-api/pets/get-pet',
  string,
  string
]

/**
 * Результат hook авторизованного запроса питомца.
 */
export type UseGetAuthPetResponse = SWRResponse<
  GetAuthPetData,
  GetAuthPetError
>
