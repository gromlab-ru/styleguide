import type { SWRResponse } from 'swr'
import type { PetDomainError } from '../../../errors'
import type { Pet } from '../../../types'

/**
 * Ключ cache для получения доменной модели питомца.
 */
export type GetPetKey = readonly ['pet-domain/pets/get-pet', string]

/**
 * Результат hook получения доменной модели питомца.
 */
export type UseGetPetResponse = SWRResponse<Pet, PetDomainError>
