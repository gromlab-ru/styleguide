# Неожиданные сбои

Неожиданный сбой — это неизвестный source response, нарушение runtime contract, programming error или сломанный
внутренний invariant. Он не входит в контракт ожидаемых исходов продуктовой operation.

В проектах команды такой сбой передаётся в application boundary как `ApplicationDefect`:

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

export const toApplicationDefect = (
  operation: string,
  cause: unknown
): ApplicationDefect => {
  return cause instanceof ApplicationDefect
    ? cause
    : new ApplicationDefect(operation, cause)
}
```

- `operation` является стабильным техническим идентификатором без credentials и персональных данных.
- `cause` сохраняется для централизованной диагностики, но не является domain contract и не обрабатывается feature
  consumer.
- Уже нормализованный defect не оборачивается повторно.
- Raw `cause` не отправляется в telemetry SDK и не показывается пользователю. Boundary сначала создаёт sanitised event.

## Маршрутизация

| Источник | Обработка |
| --- | --- |
| Render или rethrow из hook | Error Boundary минимального независимого UI-поддерева |
| Event handler или mutation | `catch`, проверка expected error, sanitised telemetry event и прекращение operation |
| Background task или subscription | Error channel владельца, sanitised telemetry event и failure state |

```ts
try {
  await updatePet(input)
} catch (error) {
  if (isUpdatePetError(error)) {
    handleExpectedError(error)
    return
  }

  reportDefect(toTelemetryEvent(
    toApplicationDefect('pets.updatePet', error)
  ))
  showSafeFallback()
}
```

Не оставляй пустой `catch`, один `console.error` или необработанный rejected promise как application policy.

## Проверка

- Expected error и `ApplicationDefect` проходят по разным каналам.
- Defect нормализован ровно один раз.
- Feature consumer не интерпретирует диагностический `cause`.
- Telemetry получает sanitised event, а пользователь не получает технические данные.
- Async operation прекращена либо владелец перешёл в явное failure state.
