import useSWR from 'swr'
import type { PetDomainError } from '../../errors'
import * as domainService from '../../services/get-pet/get-pet.service'
import type { Pet } from '../../types'
import { getPetKey } from './get-pet-key'
import type { GetPetKey, UseGetPetResponse } from './types/use-get-pet.type'

/**
 * Возвращает доменную модель питомца и состояние её загрузки.
 */
export const useGetPet = (id: string | null): UseGetPetResponse => {
  const key = getPetKey(id)
  const fetcher = ([, petId]: GetPetKey) => domainService.getPet(petId)

  return useSWR<Pet, PetDomainError, GetPetKey | null>(key, fetcher)
}
