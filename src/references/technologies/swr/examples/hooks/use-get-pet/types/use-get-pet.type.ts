import type { SWRResponse } from 'swr'

import type { ApiError, petStoreApi } from 'src/infra/pet-store-api'

/**
 * Данные, возвращаемые GET-operation питомца.
 */
export type GetPetData = Awaited<ReturnType<typeof petStoreApi.pets.getPet>>

/**
 * Ошибка GET-operation питомца.
 */
export type GetPetError = ApiError<unknown>

/**
 * Ключ cache для GET-operation питомца.
 */
export type GetPetKey = readonly ['pet-store-api/pets/get-pet', string]

/**
 * Результат hook загрузки питомца.
 */
export type UseGetPetResponse = SWRResponse<GetPetData, GetPetError>
