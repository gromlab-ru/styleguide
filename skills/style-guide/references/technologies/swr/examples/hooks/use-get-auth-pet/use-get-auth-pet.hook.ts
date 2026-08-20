import useSWR from 'swr'
import { useGetUser } from 'src/domains/user'
import { petStoreApi } from 'src/infra/pet-store-api'
import { getAuthPetKey } from './get-auth-pet-key'
import type {
  GetAuthPetData,
  GetAuthPetError,
  GetAuthPetKey,
  UseGetAuthPetResponse
} from './types/use-get-auth-pet.type'

/**
 * Возвращает питомца в cache scope авторизованного пользователя.
 */
export const useGetAuthPet = (petId: string | null): UseGetAuthPetResponse => {
  const user = useGetUser()
  const userId = user.data?.userId ?? null
  const key = getAuthPetKey(userId, petId)
  const fetcher = ([, , currentPetId]: GetAuthPetKey) => {
    return petStoreApi.pets.getPet(currentPetId)
  }

  return useSWR<GetAuthPetData, GetAuthPetError, GetAuthPetKey | null>(key, fetcher)
}
