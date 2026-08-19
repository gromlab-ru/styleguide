# useSWRSubscription

Минимальный hook subscription с устойчивым key и обязательным cleanup.

```ts
import useSWRSubscription from 'swr/subscription'
import type { SWRSubscriptionResponse } from 'swr/subscription'
import type { Order } from 'domains/orders'
import { orderEvents } from 'infra/order-events'

/**
 * Подписывается на realtime-состояние заказа.
 *
 * Передаёт события в SWR и прекращает transport subscription при cleanup.
 */
export const useOrderSubscription = (orderId: string): SWRSubscriptionResponse<Order, Error> => {
  return useSWRSubscription(['order', orderId], ([, currentOrderId], { next }) => {
    const subscription = orderEvents.subscribe(currentOrderId, {
      onData: (order) => next(null, order),
      onError: (error) => next(error)
    })

    return () => subscription.close()
  })
}
```

API `orderEvents` является placeholder владельца transport. Используй фактический SDK или adapter проекта и проверь его контракт cleanup.

Для сложного bidirectional, high-frequency или persistent realtime сначала проверь исключения из [`realtime.md`](../../../realtime.md).
