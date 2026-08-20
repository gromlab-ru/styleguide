import useSWR from 'swr'
import { toApplicationDefect } from 'src/shared/lib/application-defect'
import { getPetAdapter } from '../../adapters/get-pet.adapter'
import { isPetDomainError } from '../../errors'
import type { Pet } from '../../types'
import { getPetKey } from './get-pet-key'
import type { GetPetKey, UseGetPetResponse } from './types/use-get-pet.type'

/**
 * Возвращает доменный результат питомца и состояние его загрузки.
 */
export const useGetPet = (id: string | null): UseGetPetResponse => {
  const key = getPetKey(id)
  const fetcher = ([, petId]: GetPetKey) => getPetAdapter(petId)
  const query = useSWR<Pet, unknown, GetPetKey | null>(key, fetcher, {
    shouldRetryOnError: false
  })
  const error = query.error

  if (error !== undefined && !isPetDomainError(error)) {
    throw toApplicationDefect('pets.useGetPet', error)
  }

  return {
    pet: query.data,
    error,
    isLoading: query.isLoading,
    isValidating: query.isValidating,
    refresh: () => query.mutate(undefined, { throwOnError: false })
  }
}
