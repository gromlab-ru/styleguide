# Ожидаемые доменные ошибки

SLM оставляет проекту выбор формы ожидаемых неуспешных исходов. В проектах команды успешная operation возвращает
доменный результат напрямую, а ожидаемый неуспешный исход бросается как typed domain exception.

```ts
type GetPet = (petId: string) => Promise<Pet>
```

Не оборачивай успешный результат в `Result`, `{ ok, value }` или `{ data, error }`.

## Публичный контракт

Ошибка содержит стабильный domain code и только необходимые consumer предметные данные:

```ts
export const PET_ERROR_CODE = {
  NOT_FOUND: 'PET_NOT_FOUND',
  TEMPORARILY_UNAVAILABLE: 'PET_TEMPORARILY_UNAVAILABLE'
} as const

export type PetErrorDetails =
  | Readonly<{
      code: typeof PET_ERROR_CODE.NOT_FOUND
      payload: Readonly<{ petId: string }>
    }>
  | Readonly<{
      code: typeof PET_ERROR_CODE.TEMPORARILY_UNAVAILABLE
    }>

export type GetPetErrorDetails = Extract<
  PetErrorDetails,
  Readonly<{
    code:
      | typeof PET_ERROR_CODE.NOT_FOUND
      | typeof PET_ERROR_CODE.TEMPORARILY_UNAVAILABLE
  }>
>
```

- Code записывается в `SCREAMING_SNAKE_CASE` и считается стабильной частью domain contract.
- Связь code и payload описывается discriminated union.
- Пустой payload не добавляется.
- Message экземпляра используется для диагностики, а не как пользовательский текст.
- Для каждой operation экспортируется отдельный details/error type с допустимыми именно для неё codes.

Стабильный code не переименовывается и не переиспользуется с новым смыслом без согласованной миграции всех consumers.
Удаление code выполняется после удаления его producers и consumers.

## Создание ошибки

Класс и factories остаются внутренними. Public facet открывает operation-specific type, codes и runtime guard.

```ts
export type PetDomainError = Error & Readonly<{
  name: 'PetDomainError'
  details: PetErrorDetails
}>

export type GetPetError = PetDomainError & Readonly<{
  details: GetPetErrorDetails
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

export const isGetPetError = (value: unknown): value is GetPetError => {
  return isPetDomainError(value) && (
    value.details.code === PET_ERROR_CODE.NOT_FOUND ||
    value.details.code === PET_ERROR_CODE.TEMPORARILY_UNAVAILABLE
  )
}

export const createPetNotFoundError = (petId: string): GetPetError => {
  return new PetDomainErrorImpl({
    code: PET_ERROR_CODE.NOT_FOUND,
    payload: { petId }
  })
}
```

Не собирай details рядом с каждым `throw`: именованная factory централизует code, payload и конкретную реализацию
ошибки.

TypeScript не отражает thrown type в `Promise<Pet>`, поэтому operation contract дополнительно экспортирует `GetPetError`
и `isGetPetError`.

## Runtime guard

Значение из `catch` или library error channel проверяется operation-specific guard до передачи feature consumer:

```ts
if (isGetPetError(error)) {
  handlePetError(error)
}
```

Значение, которое не прошло guard, направляется в `ApplicationDefect` по общей
[`failure-handling policy`](../../../failure-handling.md). Не добавляй code `UNEXPECTED` в domain error union.

## Consumer

Consumer обрабатывает все codes, объявленные operation-specific contract, либо передаёт typed error владельцу, который
обеспечивает исчерпывающую обработку:

```ts
switch (error.details.code) {
  case PET_ERROR_CODE.NOT_FOUND:
    return renderPetNotFound(error.details.payload.petId)
  case PET_ERROR_CODE.TEMPORARILY_UNAVAILABLE:
    return renderPetRetry()
}
```

Не добавляй `default`, который скрывает расширение закрытого union. Новый expected code сначала добавляется в operation
contract, затем во всех его consumers.

## Проверка

- Success возвращается напрямую без result wrapper.
- Expected failure представлен domain exception со стабильным code.
- Для operation объявлены допустимые error codes и operation-specific guard.
- Class и factories не опубликованы.
- Значение `unknown` проверяется domain guard.
- Consumer исчерпывающе обработал expected codes либо делегировал typed error явному владельцу.
- Unknown failure не маскируется domain code.
