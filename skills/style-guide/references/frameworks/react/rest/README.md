# REST в React

Для REST используй вместе две технологии:

- [`REST API`](../../../technologies/rest-api/README.md) предоставляет типизированные operations, API client и
  `HttpClient`;
- [`SWR`](../../../technologies/swr/README.md) связывает GET-operation с React lifecycle и remote cache.

React не настраивает transport и не выполняет самостоятельные `fetch`-запросы.

## Выбор способа

| Сценарий | Использование в React |
| --- | --- |
| REST GET предоставляет remote data для render | Специализированный SWR hook по [`get-data.md`](../../../technologies/swr/get-data.md) |
| REST GET выполняет download, export или другой императивный эффект | Операция готового API client |
| `POST`, `PUT`, `PATCH`, `DELETE` | Операция готового API client с последующей синхронизацией SWR cache |

```text
GET
→ SWR hook
→ API client
→ HttpClient

POST / PUT / PATCH / DELETE
→ API client
→ HttpClient
```

SWR выбран для remote GET-data, потому что предоставляет общий cache, дедупликацию, request state и revalidation.
API client остаётся обязательным исполнителем REST-запроса, потому что хранит типизированный контракт операции и
использует общую transport policy.

## Использование GET-hook

Component вызывает специализированный hook и использует стандартные состояния SWR:

```ts
const { data: pet, error, isLoading } = useGetPet(id)
```

Простой и доменный варианты реализации смотри в [`SWR GET data`](../../../technologies/swr/get-data.md).

## Изменяющие запросы

Изменяющие операции вызывай напрямую из event handler, action или другого владельца сценария:

```ts
await petStoreApi.pets.updatePet({
  id: '42',
  name: 'Charlie'
})
```

Фактические имена и аргументы бери из TypeScript-сигнатуры client. После изменяющего запроса обновляй связанный
GET-cache по правилам [`get-data.md`](../../../technologies/swr/get-data.md#revalidation-после-mutation).

## Границы

- Не выполняй GET remote data напрямую из component, event handler или `useEffect`.
- Не помещай download и export в общий remote cache, если результат не является server state для render.
- Не создавай `fetch` wrapper рядом с готовым API client.
- Не помещай base URL, auth, headers и error policy в React hooks.
- Не копируй SWR data в React state, Context или Zustand.
- Не оформляй изменяющие запросы как обычный `useSWR` GET-hook.
- Не добавляй SWR параллельно существующей data-fetching library без решения о migration boundary.
