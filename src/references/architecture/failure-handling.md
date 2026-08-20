# Неожиданные defects

Unexpected defect означает сбой вне объявленных ожидаемых доменных ошибок: нарушение runtime contract, programming
error, неизвестный source response или сломанный внутренний invariant.

Defect не преобразуется в domain code. Он направляется в централизованный application channel, который сохраняет
диагностику и показывает безопасный fallback.

## Два канала

```text
Expected domain error
→ typed domain exception
→ domain guard
→ feature consumer

Unexpected defect
→ ApplicationDefect
→ application boundary
→ telemetry + safe fallback
```

Feature consumer не получает raw source error и не обязан знать global fallback policy.

## ApplicationDefect

Project-wide wrapper может хранить безопасный operation identifier и исходный `cause` для диагностики:

```ts
export class ApplicationDefect extends Error {
  constructor(
    readonly operation: string,
    readonly cause: unknown
  ) {
    super(`Unexpected defect in ${operation}`)
    this.name = 'ApplicationDefect'
  }
}
```

- `operation` не содержит credentials и персональные данные.
- `cause` доступен telemetry boundary, но не публикуется как domain payload и не выводится пользователю.
- Уже нормализованный defect не оборачивается повторно.
- Wrapper не превращает defect в ожидаемую ошибку и не гарантирует возможность продолжить сценарий.

Конкретный logger, telemetry SDK и sanitization определяются application infrastructure.

## React и async boundaries

React Error Boundary перехватывает render errors, но не ловит rejected event handlers и произвольные background tasks.

| Источник | Маршрут defect |
| --- | --- |
| Render или rethrow из hook | Ближайший Error Boundary |
| SWR fetcher | SWR `error`, domain guard, затем rethrow неизвестного defect из hook |
| Event handler или mutation action | `catch`, domain guard, затем expected UI либо `reportDefect` и controlled fallback |
| Background subscription | Transport/error channel, telemetry и controlled connection state |

Domain SWR hook передаёт ожидаемую domain error consumer, а неизвестное значение направляет в Error Boundary:

```ts
if (query.error !== undefined && !isPetDomainError(query.error)) {
  throw toApplicationDefect('pets.useGetPet', query.error)
}
```

Mutation owner также разделяет оба канала:

```ts
try {
  await updatePetAdapter(input)
} catch (error) {
  if (isPetDomainError(error)) {
    handleExpectedError(error)
    return
  }

  reportDefect(toApplicationDefect('pets.updatePetAdapter', error))
  showSafeFallback()
}
```

Не оставляй пустой `catch`, один `console.error` или необработанный rejected promise как application policy.

## Безопасный fallback

- Не показывай пользователю raw `message`, stack, response body и source code.
- Сохраняй возможность повторить безопасную idempotent operation, если сценарий это допускает.
- Изолируй fallback ближайшей осмысленной boundary, не заменяя всё приложение без необходимости.
- Не продолжай mutation flow после неизвестного частичного сбоя без reconciliation.
- Добавляй correlation identifier только из безопасного telemetry contract.

## Проверка

- Expected domain errors и defects проходят по разным каналам.
- Raw error доступна только диагностической infrastructure.
- SWR hook передаёт consumer только значение, прошедшее domain guard.
- Async action имеет явный expected-error и defect handler.
- Пользователь получает безопасный fallback без технических данных.
- Defect отправлен в telemetry либо явно документировано отсутствие telemetry infrastructure.
