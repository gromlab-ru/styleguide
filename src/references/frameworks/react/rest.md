# REST в React

Для REST используй вместе две технологии:

- [`REST API`](../../technologies/rest-api/README.md) предоставляет типизированные operations, API client и
  `HttpClient`;
- [`SWR`](../../technologies/swr/README.md) связывает GET-operation с React lifecycle и remote cache.

React не настраивает transport и не выполняет самостоятельные `fetch`-запросы.

Разделение сохраняет две независимые ответственности:

- API client владеет типизированным wire contract и общей transport policy;
- SWR владеет React lifecycle чтения, cache identity, request state и revalidation.

Благодаря этому один API client используется из React hooks, event handlers, SSR и другого runtime-кода, а React
integration не дублирует URL, auth, headers и error policy.

## Выбор способа

| Сценарий | Использование в React |
| --- | --- |
| REST GET предоставляет данные домена для render | Специализированный SWR hook вызывает domain adapter |
| REST GET предоставляет недоменные remote data для render | Специализированный SWR hook вызывает API client по [`get-data.md`](../../technologies/swr/get-data.md) |
| REST GET выполняет download, export или другой императивный эффект | Операция готового API client |
| Mutation изменяет данные домена | Action вызывает domain adapter и затем синхронизирует SWR cache |
| Mutation не относится к доменной ответственности | Операция готового API client с последующей синхронизацией cache при необходимости |

```text
GET domain state для render
→ SWR hook
→ domain adapter
→ API client
→ HttpClient

GET non-domain server state для render
→ SWR hook
→ API client
→ HttpClient

GET для download / export
→ API client
→ HttpClient

Domain POST / PUT / PATCH / DELETE
→ domain adapter
→ API client
→ HttpClient
```

Подробную семантику cache, keys и revalidation определяет [`SWR GET data`](../../technologies/swr/get-data.md).
Этот документ определяет только выбор способа вызова из React.

## Использование GET-hook

Component вызывает специализированный hook и использует стандартные состояния SWR:

```ts
const { pet, error, isLoading } = useGetPet(id)
```

Простой и доменный варианты реализации смотри в [`SWR GET data`](../../technologies/swr/get-data.md).

## Изменяющие запросы

Изменяющую domain operation вызывай через adapter из event handler, action или другого владельца сценария:

```ts
await updatePetAdapter({
  id: '42',
  name: 'Charlie'
})
```

Фактические имена и аргументы бери из публичного domain contract. Adapter внутри вызывает API client и преобразует
source response и errors. После изменяющего запроса обновляй связанный GET-cache по правилам
[`get-data.md`](../../technologies/swr/get-data.md#revalidation-после-mutation).

## Границы

- Не выполняй GET server state для render напрямую из component, event handler или `useEffect`.
- Не помещай download и export в общий remote cache, если результат не является server state для render.
- Не создавай `fetch` wrapper рядом с готовым API client.
- Не вызывай API client напрямую для данных с доменным владельцем: используй public domain adapter.
- Не помещай base URL, auth, headers и error policy в React hooks.
- Не копируй SWR data в React state, Context или Zustand.
- Не оформляй изменяющие запросы как обычный `useSWR` GET-hook.
- Не добавляй SWR параллельно существующей data-fetching library без решения о migration boundary.

## Проверка

- GET server state для render получен через специализированный SWR hook.
- Императивный GET не помещён в cache без необходимости.
- Domain mutation выполнена adapter; недоменная mutation выполнена API client.
- Mutation синхронизировала связанные GET keys.
- Hook не содержит transport policy и самостоятельный `fetch`.
- Remote state не скопирован в другой client store.
