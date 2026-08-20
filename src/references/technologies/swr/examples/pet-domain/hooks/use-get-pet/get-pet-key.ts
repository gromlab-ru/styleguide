import type { GetPetKey } from './types/use-get-pet.type'

/**
 * Создаёт cache key доменной модели питомца.
 *
 * Используется в client hook, SSR fallback и внешней revalidation.
 */
export const getPetKey = (id: string | null): GetPetKey | null => {
  if (id === null) {
    return null
  }

  return ['pet-domain/pets/get-pet', id]
}
