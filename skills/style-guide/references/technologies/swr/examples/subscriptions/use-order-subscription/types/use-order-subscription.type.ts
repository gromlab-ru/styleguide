import type { SWRSubscriptionOptions, SWRSubscriptionResponse } from 'swr/subscription'
import type { Order } from 'src/domains/orders'

/**
 * Ключ subscription обновлений заказа.
 */
export type OrderSubscriptionKey = readonly [
  'orders/order-updated',
  string,
  string
]

/**
 * Ошибка subscription обновлений заказа.
 */
export type OrderSubscriptionError = Error

/**
 * Параметры subscribe callback обновлений заказа.
 */
export type OrderSubscriptionOptions = SWRSubscriptionOptions<
  Order,
  OrderSubscriptionError
>

/**
 * Результат subscription обновлений заказа.
 */
export type UseOrderSubscriptionResponse = SWRSubscriptionResponse<
  Order,
  OrderSubscriptionError
>
