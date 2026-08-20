import useSWRSubscription from 'swr/subscription'
import { useGetUser } from 'src/domains/user'
import { orderEvents } from 'src/infra/order-events'
import { getOrderSubscriptionKey } from './get-order-subscription-key'
import type {
  OrderSubscriptionKey,
  OrderSubscriptionOptions,
  UseOrderSubscriptionResponse
} from './types/use-order-subscription.type'

/**
 * Подписывается на realtime-обновления заказа.
 */
export const useOrderSubscription = (orderId: string | null): UseOrderSubscriptionResponse => {
  const user = useGetUser()
  const userId = user.data?.userId ?? null
  const key = getOrderSubscriptionKey(userId, orderId)
  const subscribe = ([, , currentOrderId]: OrderSubscriptionKey, { next }: OrderSubscriptionOptions) => {
    const subscription = orderEvents.subscribe(currentOrderId, {
      onData: (order) => next(null, order),
      onError: (error) => next(error)
    })

    return () => subscription.close()
  }

  return useSWRSubscription(key, subscribe)
}
