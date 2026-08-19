import cl from 'clsx'
import styles from './styles/user-status.module.css'
import type { UserStatusProps } from './types/user-status-props.type'

/**
 * Показывает доступность пользователя в карточке профиля.
 *
 * Используется для:
 *  - отображения текущего статуса пользователя
 *  - визуального различения online- и offline-состояний
 */
export const UserStatus = (props: UserStatusProps) => {
  const { label, isOnline, className, ...rootAttrs } = props

  return (
    <span
      {...rootAttrs}
      className={cl(styles.root, isOnline && styles._online, className)}
    >
      {label}
    </span>
  )
}
