# HTTP transport

`HttpClient` выполняет generated и manual operations. Создай один transport для API и храни в нём общие настройки
HTTP:

```ts
import { HttpClient } from './generated'

export const httpClient = new HttpClient({
  baseUrl: 'https://api.example.com',
  timeout: 10_000,
  headers: {
    Accept: 'application/json'
  }
})
```

Для generated operations импортируй `HttpClient` из generated client. Для полностью ручного client без OpenAPI
импортируй его из `@gromlab/rest-api-codegen`. Operations и transport должны использовать совместимые контракты.

## Возможности

Конфигурация `HttpClient` задаёт общую policy запросов:

- `baseUrl`, headers, credentials и timeout;
- `onRequest` для auth и изменения запроса перед отправкой;
- `onResponse` для обработки успешного ответа;
- `onError` для нормализации ошибок, fallback или ограниченного retry;
- `customFetch`, query serializer и response parser, если стандартного поведения недостаточно.

Hooks получают request или response context и могут вернуть изменённое значение. Например, актуальный token можно
добавлять перед каждым защищённым запросом:

```ts
const httpClient = new HttpClient({
  baseUrl: 'https://api.example.com',
  onRequest(request) {
    const headers = new Headers(request.headers)
    headers.set('Authorization', `Bearer ${getAccessToken()}`)

    return {
      ...request,
      headers
    }
  }
})
```

Конкретная auth, error и retry policy зависит от API и runtime. Её точную реализацию бери из skill
`rest-api-codegen-ru`.

## Отмена запроса

Для отмены отдельного запроса передай внешний `AbortSignal`:

```ts
const controller = new AbortController()

const request = petStoreApi.pets.getPet(
  { id: '42' },
  { signal: controller.signal }
)

controller.abort()

await request
```

Отменённый запрос завершается отклонением Promise. Также запрос можно остановить через timeout, а группу активных
запросов — через общий `cancelToken` и `httpClient.abortRequest(token)`. Эти значения передаются в настройках
конкретной операции; общий timeout можно задать в transport.
