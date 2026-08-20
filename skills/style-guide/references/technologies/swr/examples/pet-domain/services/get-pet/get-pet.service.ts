import { ApiError, petStoreApi } from 'src/infra/pet-store-api'
import { PET_ERROR_CODE, PetDomainError } from '../../errors'
import { mapPetDto } from '../../mappers/get-pet.mapper'
import type { Pet } from '../../types'

/**
 * Возвращает доменную модель питомца.
 *
 * Не передаёт DTO и ошибки внешнего API за границу домена.
 */
export const getPet = async (petId: string): Promise<Pet> => {
  try {
    const petDto = await petStoreApi.pets.getPet(petId)

    return mapPetDto(petDto)
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new PetDomainError({
          code: PET_ERROR_CODE.NOT_FOUND,
          payload: {
            petId
          }
        })
      }

      throw new PetDomainError({
        code: PET_ERROR_CODE.UNAVAILABLE,
        payload: {
          retryable: error.status >= 500
        }
      })
    }

    throw new PetDomainError({
      code: PET_ERROR_CODE.UNEXPECTED,
      payload: {
        error
      }
    })
  }
}
