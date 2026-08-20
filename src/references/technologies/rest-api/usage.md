# Использование REST API client

Импортируй публичный API client и вызывай его типизированные методы:

```ts
import { petStoreApi } from 'infra/pet-store-api'

const pet = await petStoreApi.pets.getPet({ id: '42' })
```

Группы, имена методов, аргументы и возвращаемые типы определяются фактическим деревом client. Прочитай
TypeScript-сигнатуру операции и не восстанавливай её по URL endpoint.

`createApiClient` уже связал методы с `HttpClient`, поэтому transport в вызов передавать не нужно.

## Настройки запроса

Дополнительные options конкретного запроса передавай последним аргументом операции:

```ts
const pet = await petStoreApi.pets.getPet(
  { id: '42' },
  {
    headers: {
      'X-Request-ID': requestId
    },
    signal,
    timeout: 5_000
  }
)
```

Последний аргумент может переопределить headers и другие поддерживаемые request options только для этого вызова.
Общие URL, headers, credentials, auth и error policy должны оставаться в [`HttpClient`](transport.md).

Примеры имён и аргументов условны. Доступные options определяет фактическая сигнатура operation. Не создавай
параллельный `fetch` или другой client, если нужная операция уже доступна.
