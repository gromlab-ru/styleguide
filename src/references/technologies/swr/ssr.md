# SSR

SSR подготавливает только GET-data, которая участвует в первом render. Сервер начинает запрос, передаёт результат в
request-scoped SWR cache, а client hook продолжает обычную revalidation после hydration.

```text
Server Component
→ preload(key, serverFetcher)
→ SWRConfig cacheData
→ Client useSWR с тем же key
```

## Преимущества

- данные доступны на первом render без отдельного loading state после hydration;
- контент участвует в pre-rendering и доступен поисковым системам;
- browser не повторяет initial GET для уже подготовленного key;
- server и client используют один cache identity;
- после hydration сохраняются focus, reconnect и manual revalidation SWR.

Цена SSR — server API request, ожидание или streaming boundary, сериализация результата и увеличение передаваемых
данных. Не выполняй preload только ради потенциального будущего использования.

## Что загружать на сервере

Создавай server-preloaded cache data только для данных, необходимых текущему первому render:

- видимый контент страницы;
- данные, определяющие отображаемое initial состояние;
- данные ближайшей render boundary, которая действительно mounted на сервере.

Не подготавливай cache data на сервере для данных после пользовательского действия:

- закрытой modal;
- неактивной вкладки;
- закрытого accordion;
- hover или focus interaction;
- шага wizard, который ещё не открыт;
- другого условного UI, отсутствующего в первом render.

Такой preload создаёт лишний server request, увеличивает TTFB и RSC payload и позволяет ошибке скрытой части интерфейса
повлиять на страницу. Если modal изначально открыта по URL и действительно входит в первый render, её данные можно
подготовить на сервере.

## SWR 2.5+

Для React Server Components и SWR 2.5+ используй `preload` вместе с `SWRConfig.cacheData`. `cacheData` является
актуальным официальным RSC-путём, но перед внедрением проверь фактическую версию SWR: API появился в 2.5 и остаётся
экспериментальным.

Server Component импортирует server-safe key generator и named domain adapter. Server API client используй напрямую
только для данных без доменного владельца:

```tsx
import { preload, SWRConfig } from 'swr'

import { getCurrentUserAdapter } from 'domains/auth'
import { getPetAdapter } from 'domains/pet'
import { getCurrentUserKey } from 'path/to/use-get-current-user/get-current-user-key'
import { getPetKey } from 'path/to/use-get-pet/get-pet-key'

export const PetPage = async ({ petId }: PetPageProps) => {
  const petKey = getPetKey(petId)
  const currentUserKey = getCurrentUserKey()

  if (petKey === null) {
    return null
  }

  const cacheData = {
    ...preload(petKey, () => getPetAdapter(petId)),
    ...preload(currentUserKey, () => getCurrentUserAdapter())
  }

  return (
    <SWRConfig value={{ cacheData }}>
      <PetClient petId={petId} />
    </SWRConfig>
  )
}
```

Каждый `preload` возвращает fragment `cacheData`. Объединяй fragments через spread: запросы запускаются сразу и
выполняются параллельно. `petKey` зависит от параметра ресурса, а `currentUserKey` не требует аргументов.

Client Component вызывает обычный hook с тем же key generator. SWR использует server-loaded result для initial render,
записывает его в client cache и использует client fetcher для последующих revalidations.

Имена adapters и компонентов условны. Adapter должен быть server-safe и использовать подходящий transport. Если
интеграция зависит от request context, импортируй capability из server facet домена. Не импортируй browser adapter или
client hook в server module graph. Для данных без доменного владельца настрой server API client по runtime-правилам
технологии [`REST API`](../rest-api/README.md).

## Request scope

Server preload и `cacheData` принадлежат конкретному request. Не сохраняй пользовательские результаты в изменяемом
module-level cache: следующий request может получить данные другого пользователя.

- Создавай `cacheData` внутри server request/render.
- Для private data включай в key тот же стабильный `userId`, который client hook получает через auth hook.
- Получай `userId` из request-local auth context, а не из параметра client component.
- Не помещай raw token, cookie или refresh token в SWR key.
- Не переиспользуй browser singleton, cookie или mutable auth state на сервере.
- Передаваемые клиенту данные должны быть допустимы для serialization boundary текущего framework.

```ts
const petKey = getAuthPetKey(currentUser.id, petId)
```

Server preload получает `userId` из request-local auth, а client `useGetAuthPet` — из `useGetUser`. Значения обязаны
совпасть, иначе browser не найдёт server-loaded entry либо прочитает cache другого пользователя. Полные правила смотри в
[`get-data.md`](get-data.md#auth-scope).

Чтобы private data участвовала в первом client render, current-user data также должна быть доступна при hydration:
предзагрузи `useGetUser` либо инициализируй auth provider тем же request-local пользователем. Если `userId` появится
позже, private hook сначала получит `null` key и подключится к preloaded entry только после загрузки пользователя.

## Старые и другие SSR integrations

Если проект не использует SWR 2.5 `cacheData`, передай server-loaded data через `SWRConfig.fallback`. Array key при
ручном создании fallback сериализуется через `unstable_serialize`:

```ts
import { unstable_serialize } from 'swr'

const fallback = {
  [unstable_serialize(getPetKey(id))]: pet
}
```

Не сериализуй key вручную для `useSWR` и `mutate`: SWR делает это самостоятельно. `unstable_serialize` нужен для
ключа обычного объекта `fallback`.

## Границы

- Не импортируй `useSWR`, `useSWRSubscription` и client hooks в Server Component.
- Не создавай общий barrel для server-safe key generator и client hook.
- Не prefetch данные, отсутствующие в первом render.
- Не запускай subscriptions и socket transport на сервере как часть SWR hydration.
- Не разделяй изменяемый пользовательский cache между requests.

## Проверка

- Server и client используют один key generator.
- Private server и client keys используют одинаковый стабильный auth scope.
- Preload ограничен данными первого render.
- `cacheData` создаётся внутри request scope.
- Client не повторяет initial GET и сохраняет последующую revalidation.
- Lazy UI загружает данные после активации на клиенте.
