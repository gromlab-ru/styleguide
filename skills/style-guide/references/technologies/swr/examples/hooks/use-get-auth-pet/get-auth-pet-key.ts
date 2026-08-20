import type { GetAuthPetKey } from './types/use-get-auth-pet.type'

/**
 * Создаёт cache key авторизованного запроса питомца.
 */
export const getAuthPetKey = (
  userId: string | null,
  petId: string | null
): GetAuthPetKey | null => {
  if (userId === null || petId === null) {
    return null
  }

  return ['pet-store-api/pets/get-pet', userId, petId]
}
