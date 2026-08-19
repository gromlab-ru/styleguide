import type { ComponentPropsWithoutRef } from 'react'

/**
 * Собственные параметры статуса пользователя.
 */
export type UserStatusParams = {
  /** Текст статуса. */
  label: string
  /** Доступен ли пользователь сейчас. */
  isOnline: boolean
}

/**
 * Атрибуты корневого span без управляемого содержимого.
 */
type RootAttrs = Omit<ComponentPropsWithoutRef<'span'>, 'children'>

/**
 * Props статуса пользователя.
 */
export type UserStatusProps = RootAttrs & UserStatusParams
