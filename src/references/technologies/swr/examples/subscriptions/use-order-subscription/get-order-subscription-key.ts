import type { OrderSubscriptionKey } from './types/use-order-subscription.type'

/**
 * Создаёт key subscription обновлений заказа.
 */
export const getOrderSubscriptionKey = (
  userId: string | null,
  orderId: string | null
): OrderSubscriptionKey | null => {
  if (userId === null || orderId === null) {
    return null
  }

  return ['orders/order-updated', userId, orderId]
}
