import type { GetPetError } from '../../../errors'
import type { Pet } from '../../../types'

/**
 * Ключ cache для получения доменного результата питомца.
 */
export type GetPetKey = readonly ['pet-domain/pets/get-pet', string]

/**
 * Результат React hook получения питомца.
 */
export type UseGetPetResponse = Readonly<{
  pet: Pet | undefined
  error: GetPetError | undefined
  isLoading: boolean
  isValidating: boolean
  refresh: () => Promise<Pet | undefined>
}>
