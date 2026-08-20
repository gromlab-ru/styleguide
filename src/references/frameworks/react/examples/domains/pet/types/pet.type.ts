/**
 * Доменная модель питомца.
 */
export type Pet = Readonly<{
  /** Идентификатор питомца. */
  id: string
  /** Отображаемое имя питомца. */
  name: string
}>
