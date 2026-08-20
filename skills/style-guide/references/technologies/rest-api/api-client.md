# Сборка REST API client

`createApiClient` связывает `HttpClient` с деревом операций. В результате consumer вызывает типизированные методы и
не передаёт transport вручную.

## Полный client

Для generated client базовый вариант использует полное `operationsTree`:

```ts
import {
  createApiClient,
  operationsTree
} from './generated'

import { httpClient } from './transport'

export const petStoreApi = createApiClient(
  httpClient,
  operationsTree
)
```

Структура дерева определяет путь методов, например `petStoreApi.pets.getPet`. Проверяй фактические группы и имена в
generated output.

## Собственное дерево

Client можно собрать только из нужных операций или организовать их в собственные группы:

```ts
import { createApiClient } from './generated'
import { getPet } from './generated/operations/get-pet'
import { searchPets } from './generated/operations/search-pets'

import { httpClient } from './transport'

export const petStoreApi = createApiClient(httpClient, {
  pets: {
    getPet,
    searchPets
  }
})
```

Используй прямые operation imports, когда нужен частичный client. Имена файлов и exports в примере условны: бери их
из фактического generated output.

## Client без OpenAPI

OpenAPI не является обязательным условием. Без specification установи package как runtime dependency и создай
операции вручную:

```bash
npm install @gromlab/rest-api-codegen
```

```ts
import type {
  ApiRequestClient,
  RequestParams
} from '@gromlab/rest-api-codegen'

type Pet = {
  id: string
  name: string
}

export function getPet(
  httpClient: ApiRequestClient,
  { id }: { id: string },
  params: RequestParams = {}
) {
  return httpClient.request<Pet>({
    path: `/pets/${encodeURIComponent(id)}`,
    method: 'GET',
    format: 'json',
    ...params
  })
}
```

Ручную operation передай в `createApiClient` тем же способом, что generated operation. Разница только в источнике:
генератор автоматически создаёт типы и операции из OpenAPI, а без specification их описывает разработчик по
фактическому wire contract.

## Исправление generated operation

Если vendor specification содержит ошибку, не изменяй generated-файл. Создай исправленную operation рядом с output
и замени её в пользовательском дереве:

```ts
import {
  createApiClient,
  operationsTree
} from './generated'

import { getPetCorrected } from './custom-operations/get-pet-corrected'
import { httpClient } from './transport'

export const petStoreApi = createApiClient(httpClient, {
  ...operationsTree,
  pets: {
    ...operationsTree.pets,
    getPet: getPetCorrected
  }
})
```

Для consumer путь `petStoreApi.pets.getPet` остаётся прежним. Такой override позволяет исправлять интеграцию без
ожидания новой vendor specification, а после исправления OpenAPI вернуть generated operation без изменения вызовов.

Manual и corrected operations должны повторять контракт generated operations. Детали типов, partial clients и
сложных overrides бери из skill `rest-api-codegen-ru`.
