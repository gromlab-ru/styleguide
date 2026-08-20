# GET data

Используй `useSWR` для REST GET-data, которая представляет server state и участвует в React render. Fetcher вызывает
готовую GET-operation API client по технологии [`REST API`](../rest-api/README.md).

```text
useSWR
→ GET-operation API client
→ HttpClient
→ REST API
```

## Преимущества

- одинаковые keys используют общий client cache и дедуплицируют одновременные запросы;
- каждый consumer получает единые `data`, `error`, `isLoading`, `isValidating` и `mutate`;
- focus, browser reconnect и ручная revalidation обновляют данные без собственного `useEffect`;
- `null` key отключает запрос до появления обязательных параметров;
- несколько компонентов используют один remote state без копирования в Context или Zustand;
- fetcher может вызвать доменный service и сохранить в cache готовую доменную модель и доменную ошибку.

## Только GET

Remote request внутри `useSWR` выполняет только HTTP `GET`.

- Не выполняй через `useSWR` или `useSWRMutation` методы `POST`, `PUT`, `PATCH` и `DELETE`.
- Не используй `useSWRMutation` как второй способ выполнения REST-запросов.
- Изменяющие операции вызывай напрямую через API client из event handler, action или владельца сценария.
- После изменения синхронизируй связанные GET keys через `mutate`.
- Read-operation через `POST` по умолчанию также выполняй напрямую: она не становится GET-cache только из-за того,
  что не изменяет данные.

Императивный GET для download, export или другого результата, который не является server state для render, может
выполняться напрямую через API client. Не помещай binary response и одноразовый side effect в SWR cache без отдельной
причины.

Такая граница исключает автоматический запуск изменяющего запроса при mount, focus или reconnect, неоднозначный retry и
смешивание mutation state с cache чтения.

## Структура hook

Размещай hook, server-safe key generator и типы рядом. При текущем code style структура выглядит так:

```text
use-get-<name>/
├── types/
│   └── use-get-<name>.type.ts
├── get-<name>-key.ts
└── use-get-<name>.hook.ts
```

Части шаблона:

- `use-get-` — обязательный префикс папки и файла GET-hook;
- `get-` и `-key` — обязательные части имени key generator;
- `<name>` — имя после `useGet` в экспортируемой функции, записанное в `kebab-case`.

Ролевые суффиксы файлов определяет актуальный code style проекта, а не технология SWR.

Примеры:

| Экспортируемая функция | `<name>` | Папка hook |
| --- | --- | --- |
| `useGetPet` | `pet` | `use-get-pet/` |
| `useGetAuthPet` | `auth-pet` | `use-get-auth-pet/` |
| `useGetPet` домена | `pet` | `pet-domain/hooks/use-get-pet/` |

- Hook именуется через `useGet...`.
- Key generator экспортируется для client hook, SSR и внешней revalidation.
- Key generator не импортирует client hook и настроенный browser API client.
- Hook-файл экспортирует только hook.
- Не создавай общий barrel, который втягивает client hook в server module graph.

Полный простой пример находится в [`examples/hooks/use-get-pet/`](examples/hooks/use-get-pet/).

## Cache key

Используй tuple key со стабильным namespace и всеми аргументами, влияющими на результат:

```ts
export type GetPetKey = readonly ['pet-store-api/pets/get-pet', string]
```

```ts
export const getPetKey = (id: string | null): GetPetKey | null => {
  if (id === null) {
    return null
  }

  return ['pet-store-api/pets/get-pet', id]
}
```

SWR передаёт fetcher tuple целиком одним аргументом.

Не смешивай DTO и доменную модель под одним key. Разные представления получают разные namespaces, иначе consumers
прочитают несовместимые значения из общего cache entry.

## Auth scope

Если GET-response зависит от авторизованного пользователя, tenant или permission scope, stable auth identity является
обязательной частью cache key. Иначе новый пользователь может прочитать cache entry предыдущего пользователя до
revalidation.

```ts
export type GetAuthPetKey = readonly [
  'pet-store-api/pets/get-pet',
  string,
  string
]
```

```ts
export const getAuthPetKey = (
  userId: string | null,
  petId: string | null
): GetAuthPetKey | null => {
  if (userId === null || petId === null) {
    return null
  }

  return ['pet-store-api/pets/get-pet', userId, petId]
}
```

Не передавай `userId` в каждый hook из component. Auth-aware hook самостоятельно получает текущего пользователя и
передаёт stable ID в key generator:

```ts
export const useGetAuthPet = (petId: string | null): UseGetAuthPetResponse => {
  const user = useGetUser()
  const userId = user.data?.userId ?? null
  const key = getAuthPetKey(userId, petId)
  const fetcher = ([, , currentPetId]: GetAuthPetKey) => {
    return petStoreApi.pets.getPet(currentPetId)
  }

  return useSWR<GetAuthPetData, GetAuthPetError, GetAuthPetKey | null>(key, fetcher)
}
```

`userId` используется только для cache identity. Fetcher передаёт operation только параметры ресурса, а JWT или cookie
добавляет `HttpClient`. До загрузки `useGetUser().data` key равен `null`, поэтому private GET не выполняется.

`useGetUser` является единым владельцем текущей auth identity. Resource hooks читают её внутри себя и не заставляют
каждый component получать и передавать `userId` вручную.

Hook скрывает auth context от consumer и вызывается только с параметрами своего ресурса:

```ts
const pet = useGetAuthPet(petId)
```

Выбирай стабильную identity по контракту ответа и получай её внутри hook:

- `userId`, если представление зависит от пользователя;
- `sessionId`, если cache должен жить только в пределах одной авторизованной сессии;
- `tenantId` вместе с `userId`, если пользователь переключает tenant;
- `authEpoch`, если role/permissions меняют ответ при прежнем `userId` и keys должны быть полностью разделены.

Не помещай в key access token, refresh token или cookie. JWT refresh создаёт новый namespace, накапливает старые
entries, раскрывает credential в memory/devtools и делает cache непонятным при отладке.

Пока auth state определяется, `userId` равен `null` и private GET не запускается. При logout или account switch:

1. Отключи private hooks через `null` user/session identity.
2. Очисти cache предыдущей сессии.
3. Активируй scope нового пользователя.

Для SWR 2.5+ очищай текущий cache provider через scoped `unload`:

```ts
const { unload } = useSWRConfig()

unload({ revalidate: false })
```

`unload` удаляет entries и заставляет SWR игнорировать результаты старых in-flight requests. Если public и private
data не должны очищаться вместе, размести private hooks в отдельном `SWRConfig` provider scope.

Очистку выполняет auth/session owner один раз при смене identity, а не каждый private resource hook.

Не используй `keepPreviousData` при переходе между auth scopes: предыдущие пользовательские данные не должны
отображаться после смены identity.

Полный пример находится в [`examples/hooks/use-get-auth-pet/`](examples/hooks/use-get-auth-pet/).

## Fetcher и response

Fetcher остаётся локальной функцией hook и выполняет запрос через API client:

```ts
export const useGetPet = (id: string | null): UseGetPetResponse => {
  const key = getPetKey(id)
  const fetcher = ([, petId]: GetPetKey) => petStoreApi.pets.getPet(petId)

  return useSWR<GetPetData, GetPetError, GetPetKey | null>(key, fetcher)
}
```

Не создавай в fetcher самостоятельный `fetch`, URL, auth headers или общую обработку HTTP-ошибок. Эти правила уже
принадлежат `HttpClient`.

Возвращай стандартный `SWRResponse` без ручной пересборки. Generics `useSWR` и return type fetcher определяют контракт
`data` и `error`.

## Доменный service

Если consumer нужна доменная модель, не добавляй DTO mapping и обработку ошибок в SWR hook. Передай в fetcher функцию
доменного запроса:

```ts
const fetcher = ([, petId]: GetPetKey) => domainService.getPet(petId)
```

Доменный service вызывает лёгкий API client и применяет внутренний mapper домена для преобразования DTO в доменную
модель. Все ошибки интерпретирует сам service: ожидаемые source errors заменяет предметными доменными исходами, а
неизвестный сбой оборачивает в отдельную доменную ошибку с исходным значением типа `unknown` в payload. Mapper не создаёт
ошибки и не управляет control flow. Поэтому SWR hook остаётся простым, а consumer всегда получает безопасную доменную
границу через `data` и `error`.

Модель и ожидаемые ошибки объявляй в соответствующих внутренних сегментах домена. Hook и service используют эти
контракты напрямую: типы не принадлежат service и не доступны через его namespace.

Для нескольких ожидаемых исходов достаточно одного конструктора ошибки домена с discriminated union в `details`.
Общий `DomainError` позволяет выполнить runtime-проверку любой доменной ошибки, а `PetDomainError` определяет конкретный
домен. Экспортируй стабильные коды через public API домена: consumers не должны повторять строковые литералы. Смысл
каждого кода кратко зафиксируй в комментарии рядом с декларацией. Храни `code` и `payload` в одном объекте, чтобы
TypeScript сужал payload по code:

```ts
if (isPetDomainError(error)) {
  switch (error.details.code) {
    case PET_ERROR_CODE.NOT_FOUND:
      return error.details.payload.petId
  }
}
```

`isDomainError` проверяет любую доменную ошибку, `isPetDomainError` — ошибку конкретного домена.
Consumer самостоятельно сопоставляет код с пользовательским текстом с учётом контекста и локализации.
Исходное значение в `payload.error` ошибки неожиданного сбоя предназначено для диагностики; renderer выбирает безопасное
состояние по доменному коду и не выводит это значение пользователю.

Полные примеры находятся в [`examples/pet-domain/hooks/use-get-pet/`](examples/pet-domain/hooks/use-get-pet/) и
[`examples/pet-domain/services/get-pet/`](examples/pet-domain/services/get-pet/). Hook принадлежит домену вместе с
контрактом и service; не размещай его во внешнем общем каталоге hooks.

## Revalidation после mutation

После успешной изменяющей operation предпочитай повторный GET через bound `mutate()`:

```ts
const pet = useGetPet(id)

await petStoreApi.pets.updatePet({ id, name })
await pet.mutate()
```

Revalidation получает каноническое состояние сервера и не предполагает, что response mutation совпадает с GET-data.

Используй `useSWRConfig().mutate`, когда изменённый cache не принадлежит текущему consumer или требуется обновить
несколько keys. Для адресного обновления переиспользуй экспортированный key generator:

```ts
const { mutate } = useSWRConfig()

await petStoreApi.pets.updatePet({ id, name })
await mutate(getPetKey(id))
```

Global `mutate(key)` без data запускает revalidation только когда соответствующий GET-hook mounted в том же cache
provider. Если mounted consumer отсутствует, выполни явный сценарий обновления при следующем mount или передай data.

## Ручное обновление cache

Optimistic data, rollback и ручное merge применяй только когда обычная revalidation не решает задачу. Определи:

- optimistic state;
- rollback при ошибке;
- необходимость финальной revalidation;
- связанные detail и list keys;
- защиту от race conditions.

Для изменения на основе текущего значения используй functional `mutate(current => next)`, а не значение из render
closure.

## Проверка

- Fetcher выполняет только GET-operation API client.
- Key содержит namespace и все влияющие на результат аргументы.
- Remote data не копируются в другой client store.
- Mutation выполняется API client и синхронизирует связанные GET keys.
- Доменный cache не содержит DTO и source errors.
- `dedupingInterval` не описан как TTL: он только подавляет повторные запросы внутри интервала.
