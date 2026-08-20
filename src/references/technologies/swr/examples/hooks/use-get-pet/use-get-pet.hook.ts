import useSWR from 'swr'
import { petStoreApi } from 'src/infra/pet-store-api'
import { getPetKey } from './get-pet-key'
import type { GetPetData, GetPetError, GetPetKey, UseGetPetResponse } from './types/use-get-pet.type'

/**
 * Возвращает питомца и состояние его загрузки.
 *
 * Не выполняет запрос, пока идентификатор неизвестен.
 */
export const useGetPet = (id: string | null): UseGetPetResponse => {
  const key = getPetKey(id)
  const fetcher = ([, petId]: GetPetKey) => petStoreApi.pets.getPet(petId)

  return useSWR<GetPetData, GetPetError, GetPetKey | null>(key, fetcher)
}
