import type { petStoreApi } from 'src/infra/pet-store-api'
import type { Pet } from '../types'

type PetDto = Awaited<ReturnType<typeof petStoreApi.pets.getPet>>

/**
 * Преобразует ответ источника в доменную модель питомца.
 */
export const mapPetDto = (petDto: PetDto): Pet => {
  return {
    id: petDto.id,
    name: petDto.name
  }
}
