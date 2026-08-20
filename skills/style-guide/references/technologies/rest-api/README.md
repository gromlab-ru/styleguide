# REST API

Для REST API используй `@gromlab/rest-api-codegen`. Технология состоит из типизированных operations, общего
`HttpClient` и API client, собранного через `createApiClient`.

```text
OpenAPI или manual operations
+ configured HttpClient
→ createApiClient
→ typed API client
→ REST API
```

Технология не зависит от framework. Framework определяет только место и lifecycle вызова готовых операций.

## Порядок работы

1. Найди существующий API client или общий SDK и переиспользуй его.
2. При наличии OpenAPI сгенерируй operations по [`generation.md`](generation.md).
3. Настрой общий `HttpClient` по [`transport.md`](transport.md).
4. Собери полный, частичный или ручной client по [`api-client.md`](api-client.md).
5. Вызывай готовые операции по [`usage.md`](usage.md).

## Карта документов

| Задача | Референс |
| --- | --- |
| Сгенерировать operations и типы из OpenAPI | [`generation.md`](generation.md) |
| Настроить HTTP, hooks и cancellation | [`transport.md`](transport.md) |
| Собрать или исправить API client | [`api-client.md`](api-client.md) |
| Выполнить запрос через готовый client | [`usage.md`](usage.md) |

Для точного API библиотеки, auth, retry, SSR и расширенных сценариев загрузи agent skill `rest-api-codegen-ru`.
