# SWR

Используй `swr` как React data layer для трёх задач:

1. Получение и client cache REST GET-data.
2. Подготовка GET-data для первого render через SSR.
3. Получение realtime updates через subscriptions.

SWR не заменяет HTTP или socket transport. REST-запросы выполняет API client по технологии
[`REST API`](../rest-api/README.md), а socket connection принадлежит отдельному transport manager или SDK.

## Выбор подхода

| Задача | Решение | Референс |
| --- | --- | --- |
| Получить REST server state для render | `useSWR` + GET-operation API client | [`get-data.md`](get-data.md) |
| Подготовить GET-data первого render | `preload` + `SWRConfig.cacheData` | [`ssr.md`](ssr.md) |
| Получать входящие realtime updates | `useSWRSubscription` | [`subscriptions.md`](subscriptions.md) |
| Выполнить `POST`, `PUT`, `PATCH`, `DELETE` | API client напрямую | [`get-data.md`](get-data.md#только-get) |
| Отправить socket command | Socket client напрямую | [`subscriptions.md`](subscriptions.md#socket-transport) |

## Преимущества

### GET data

- общий cache и dedup для одинаковых keys;
- единые request states для всех consumers;
- focus, reconnect и manual revalidation;
- conditional fetching без нарушения Rules of Hooks;
- типизированный fetcher через готовую API operation.

### SSR

- данные доступны на первом render;
- контент участвует в pre-rendering и SEO;
- отсутствует повторный initial browser GET;
- после hydration продолжают работать client cache и revalidation.

SSR используется только для данных первого render. Закрытая modal, неактивная вкладка и другой lazy UI загружают
данные после активации на клиенте.

### Subscriptions

- realtime updates без polling;
- одна subscription для одинакового key;
- automatic cleanup после последнего consumer;
- latest data/error в React lifecycle;
- синхронизация канонического GET-cache через snapshot, delta или invalidation.

## Границы

- Remote fetcher `useSWR` выполняет только HTTP `GET`.
- Не используй `useSWRMutation` для REST mutations.
- Изменяющие REST operations выполняй API client и затем синхронизируй GET-cache.
- Outbound socket commands выполняй socket client, а не subscription hook.
- Не копируй SWR data в React state, Context или Zustand.
- Не помещай auth, URL и transport policy внутрь hooks.
- Для private data получай стабильный `userId` внутри hook и включай его в key, но не используй JWT или cookie.
- Не добавляй SWR параллельно существующей data-fetching library без migration boundary.

## Примеры

```text
examples/
├── pet-domain/
│   ├── errors/
│   │   ├── index.ts
│   │   ├── pet-domain.error.ts
│   │   └── pet-error-code.ts
│   ├── hooks/
│   │   └── use-get-pet/
│   ├── mappers/
│   ├── services/
│   │   └── get-pet/
│   └── types/
├── hooks/
│   ├── use-get-pet/
│   └── use-get-auth-pet/
├── shared/
│   └── errors/
│       ├── domain.error.ts
│       └── index.ts
└── subscriptions/
    └── use-order-subscription/
```

- [`use-get-pet/`](examples/hooks/use-get-pet/) — простой GET-hook с типами API operation.
- [`use-get-auth-pet/`](examples/hooks/use-get-auth-pet/) — GET-hook со стабильным auth scope в cache key.
- [`pet-domain/hooks/use-get-pet/`](examples/pet-domain/hooks/use-get-pet/) — доменный GET-hook с простым fetcher.
- [`get-pet/`](examples/pet-domain/services/get-pet/) — доменный service, выполняющий API request и применяющий внутренние
  mappers домена.
- [`shared/errors/`](examples/shared/errors/) — общий runtime-маркер и guard доменных ошибок.
- [`use-order-subscription/`](examples/subscriptions/use-order-subscription/) — typed subscription key, callback и
  cleanup.

Имена API clients, transports, operations и доменных моделей в examples условны. Используй фактические public API и
TypeScript-сигнатуры проекта.

`pet-domain/` представляет один пример доменного модуля, а не слой `domains` приложения.

Для API SWR, не описанного этими референсами, используй официальную [документацию SWR](https://swr.vercel.app/).
