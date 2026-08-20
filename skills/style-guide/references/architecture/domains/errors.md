# Ожидаемые доменные ошибки

Домен объявляет ожидаемые неуспешные исходы своих сценариев. В этом style guide успешная operation возвращает доменную
модель напрямую, а ожидаемый неуспешный исход бросается как типизированная доменная ошибка со стабильным code и
предметным payload.

Typed domain exceptions являются локальной project policy, а не обязательным требованием SLM.

## Почему domain exception

- успешный путь возвращает модель без wrapper `ok/value`;
- SWR использует стандартные каналы `data` и `error`;
- code и payload принадлежат домену, а не transport;
- runtime guard отделяет ожидаемую ошибку от unexpected defect;
- consumer обрабатывает только объявленные предметные cases.

TypeScript не описывает thrown type в сигнатуре функции. Поэтому каждая boundary, принимающая `unknown`, обязана
проверить значение доменным guard до передачи feature consumer.

## Код и details

Коды объявляй рядом с владельцем:

```ts
export const PET_ERROR_CODE = {
  NOT_FOUND: 'PET_NOT_FOUND',
  TEMPORARILY_UNAVAILABLE: 'PET_TEMPORARILY_UNAVAILABLE'
} as const
```

Связывай code и payload через discriminated union:

```ts
export type PetErrorDetails =
  | Readonly<{
      code: typeof PET_ERROR_CODE.NOT_FOUND
      payload: Readonly<{
        petId: string
      }>
    }>
  | Readonly<{
      code: typeof PET_ERROR_CODE.TEMPORARILY_UNAVAILABLE
    }>
```

- Code записывай в `SCREAMING_SNAKE_CASE` и делай стабильной частью contract.
- Payload содержит только предметные данные, необходимые consumer.
- Не добавляй пустой payload, если исходу не нужны данные.
- Не помещай в details source error, HTTP status, raw response, `cause`, stack или внешний message.
- Message класса предназначен для диагностики и не используется как пользовательский текст.

## Domain error и factories

Constructor и factories остаются внутренней реализацией домена. Public API открывает тип ошибки, guard и codes,
необходимые consumer:

```ts
export type PetDomainError = Error & Readonly<{
  name: 'PetDomainError'
  details: PetErrorDetails
}>

class PetDomainErrorImpl extends Error implements PetDomainError {
  readonly name = 'PetDomainError'

  constructor(readonly details: PetErrorDetails) {
    super(`pet:${details.code}`)
  }
}

export const isPetDomainError = (value: unknown): value is PetDomainError => {
  return value instanceof PetDomainErrorImpl
}

export const createPetNotFoundError = (petId: string): PetDomainError => {
  return new PetDomainErrorImpl({
    code: PET_ERROR_CODE.NOT_FOUND,
    payload: { petId }
  })
}
```

Не конструируй details рядом с каждым `throw`. Именованная factory централизует code, payload и класс ошибки. Factory
не экспортируется через public facet, если внешний consumer не должен создавать ошибку домена.

`instanceof` работает только внутри одного JavaScript runtime. Для JSON, SSR/RSC serialization, worker или другого
process boundary определи отдельный serializable contract и parser; не считай class instance универсальным wire format.

## Expected outcome

Ошибка является ожидаемой, если сценарий заранее объявляет её и consumer может принять осмысленное продуктовое
решение. Сам факт, что значение попало в `catch`, не делает его ожидаемым.

| Ситуация | Решение |
| --- | --- |
| Объект не найден и UI имеет отдельное состояние | `PetDomainError` с code `PET_NOT_FOUND` |
| Временная недоступность предусмотрена UX с retry | Code `PET_TEMPORARILY_UNAVAILABLE` |
| Действие запрещено предметным состоянием | Domain code с нужным предметным payload |
| DTO нарушает обязательный runtime contract | Unexpected defect |
| Mapper нарушил внутренний invariant | Unexpected defect |
| Получен неизвестный source response | Unexpected defect |

Не добавляй универсальный `UNEXPECTED` в каждый domain error union. Он превращает неизвестный сбой в штатный исход и
заставляет каждого consumer имитировать глобальную defect policy.

## Mapping source errors

Domain adapter интерпретирует только доказанные source cases:

```ts
try {
  const dto = await petStoreApi.pets.getPet(petId)

  return mapPetDto(dto)
} catch (error) {
  if (isPetNotFoundSourceError(error)) {
    throw createPetNotFoundError(petId)
  }

  throw toApplicationDefect('pets.getPet', error)
}
```

Одинаковый HTTP status может иметь разный предметный смысл в разных сценариях. Не создавай общий mapping
`ApiError -> DomainError` без контекста конкретной operation.

## Consumer

Consumer получает только значение, прошедшее domain guard:

```ts
if (isPetDomainError(error)) {
  switch (error.details.code) {
    case PET_ERROR_CODE.NOT_FOUND:
      return renderPetNotFound(error.details.payload.petId)
    case PET_ERROR_CODE.TEMPORARILY_UNAVAILABLE:
      return renderPetRetry()
  }
}
```

Не добавляй `default` для закрытого union, если exhaustive check должен обнаружить новый contract case.

## Проверка

- Expected errors объявлены до source integration.
- Успешная operation возвращает доменную модель без result wrapper.
- Error details содержат только предметные данные.
- Source errors и transport statuses не опубликованы.
- Error создаётся именованной internal factory, а не inline object рядом с `throw`.
- Unknown defect не преобразован в `UNEXPECTED` domain error.
- Runtime boundary проверяет `unknown` доменным guard.
- Exception representation названа local policy, а не правилом SLM.
