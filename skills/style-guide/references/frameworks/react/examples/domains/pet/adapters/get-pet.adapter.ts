import { ApiError, petStoreApi } from 'src/infra/pet-store-api'
import { toApplicationDefect } from 'src/shared/lib/application-defect'
import {
  createPetNotFoundError,
  createPetTemporarilyUnavailableError
} from '../errors/pet-domain.error'
import { mapPetDto } from '../mappers/get-pet.mapper'
import type { Pet } from '../types'

const TEMPORARY_SOURCE_STATUSES = new Set([502, 503, 504])

/**
 * Возвращает доменную модель питомца из внешнего источника.
 *
 * Не передаёт DTO и ошибки внешнего API за границу домена.
 */
export const getPetAdapter = async (petId: string): Promise<Pet> => {
  try {
    const petDto = await petStoreApi.pets.getPet(petId)

    return mapPetDto(petDto)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw createPetNotFoundError(petId)
    }

    if (
      error instanceof ApiError
      && typeof error.status === 'number'
      && TEMPORARY_SOURCE_STATUSES.has(error.status)
    ) {
      throw createPetTemporarilyUnavailableError()
    }

    throw toApplicationDefect('pets.getPetAdapter', error)
  }
}
