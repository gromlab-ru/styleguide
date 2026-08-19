# SWR + REST API Codegen

Минимальный hook чтения REST-ресурса через generated API operation.

```ts
import useSWR from 'swr'
import type { SWRResponse } from 'swr'
import { ordersApi } from 'infra/orders-api'

/**
 * Заказ, возвращаемый generated REST operation.
 */
type Order = Awaited<ReturnType<typeof ordersApi.orders.getOrder>>

/**
 * Загружает заказ по идентификатору.
 *
 * Использует параметры операции как стабильный SWR key и generated method как fetcher.
 */
export const useOrder = (id: string): SWRResponse<Order> => {
  return useSWR({ id }, ordersApi.orders.getOrder)
}
```

Фактические path, group, operation и params определяются generated API проекта. Перед копированием примера загрузи skills `rest-api-codegen` и `swr`.

Не создавай дополнительный fetcher, если operation API client уже совместима с SWR.
