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
| Получить REST server state для render | `useSWR` + domain adapter или GET-operation API client | [`get-data.md`](get-data.md) |
| Подготовить GET-data первого render | `preload` + `SWRConfig.cacheData` | [`ssr.md`](ssr.md) |
| Получать входящие realtime updates | `useSWRSubscription` | [`subscriptions.md`](subscriptions.md) |
| Выполнить `POST`, `PUT`, `PATCH`, `DELETE` | Domain adapter или API client для недоменных данных | [`get-data.md`](get-data.md#только-get) |
| Отправить socket command | Socket client напрямую | [`subscriptions.md`](subscriptions.md#socket-transport) |

## Преимущества

### GET data

- общий cache и dedup для одинаковых keys;
- единые request states для всех consumers;
- focus, reconnect и manual revalidation;
- conditional fetching без нарушения Rules of Hooks;
- типизированный fetcher через domain adapter или готовую API operation.

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
- Изменяющие domain operations выполняй adapter; недоменные operations выполняй API client; затем синхронизируй
  GET-cache.
- Outbound socket commands выполняй socket client, а не subscription hook.
- Не копируй SWR data в React state, Context или Zustand.
- Не помещай auth, URL и transport policy внутрь hooks.
- Для private data получай стабильный `userId` внутри hook и включай его в key, но не используй JWT или cookie.
- Не добавляй SWR параллельно существующей data-fetching library без migration boundary.

## Примеры

```text
examples/
├── hooks/
│   ├── use-get-pet/
│   └── use-get-auth-pet/
└── subscriptions/
    └── use-order-subscription/
```

- [`use-get-pet/`](examples/hooks/use-get-pet/) — простой GET-hook с типами API operation.
- [`use-get-auth-pet/`](examples/hooks/use-get-auth-pet/) — GET-hook со стабильным auth scope в cache key.
- [`use-order-subscription/`](examples/subscriptions/use-order-subscription/) — typed subscription key, callback и
  cleanup.
- [`React pet domain`](../../frameworks/react/examples/domains/pet/README.md) — SWR hook использует domain adapter,
  передаёт typed domain error и направляет unknown defect в Error Boundary.

Имена API clients, transports, operations и доменных моделей в examples условны. Используй фактические public API и
TypeScript-сигнатуры проекта.

Для API SWR, не описанного этими референсами, используй официальную [документацию SWR](https://swr.vercel.app/).
