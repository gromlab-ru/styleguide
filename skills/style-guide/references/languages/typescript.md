# TypeScript

Применяй к `.ts` и TypeScript-частям `.tsx` **после** [`javascript.md`](javascript.md). Этот файл содержит только отличия и дополнения TypeScript.

## Типизация API

- Типизируй параметры функций и компонентов.
- Для публичных функций указывай возвращаемый тип.
- Для локальной реализации используй inference, когда тип очевиден и не является контрактом.
- Не дублируй выводимый тип локальной переменной явной аннотацией без причины.
- Не используй `React.FC`; правила типизации React-компонента находятся в framework-референсе.

## Ранние возвраты (Early Return) и narrowing

Применяй общие правила главы [`Ранние возвраты (Early Return) и ветвление`](javascript.md#ранние-возвраты-early-return-и-ветвление) из JavaScript.

- Используй guard clauses, чтобы исключить `null`, `undefined` и неподходящие варианты union до основного сценария.
- После guard clause полагайся на control-flow narrowing TypeScript, а не обходи проверку через `as` или non-null assertion `!`.
- Для внешнего `unknown` сначала выполни runtime-проверку, затем продолжай работу с суженным типом.

```ts
/**
 * Возвращает отображаемое имя пользователя.
 *
 * Сужает отсутствующего и неактивного пользователя до основного сценария.
 */
const getUserName = (user?: User): string => {
  if (!user) {
    return 'Гость'
  }

  if (!user.isActive) {
    return 'Неактивный пользователь'
  }

  return user.name
}
```

## Type и interface

- Используй `type` для props, DTO, view models, unions, mapped types и композиции.
- Используй `interface` для расширяемых контрактов и declaration merging.
- Не смешивай `type` и `interface` для одной категории сущностей без причины.

```ts
export type UserCardProps = {
  user: User
  onSelect: (userId: string) => void
}

export interface StorageAdapter {
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<void>
}
```

## Type-only imports и exports

- Импортируй сущность только для типов через `import type`.
- Экспортируй только тип через `export type`.
- Не меняй value import на type import, если сущность нужна в runtime.

```ts
import { createUser } from './create-user'
import type { User } from './user.type'

export { UserCard } from './user-card'
export type { UserCardProps } from './types/user-card-props.type'
```

## Unknown, any и narrowing

- Не используй `any` как обычный тип. Оставляй его только на неизбежной интеграционной границе с объяснимой причиной.
- Принимай внешние и недоверенные данные как `unknown`, затем сужай тип runtime-проверкой.
- Не используй `as` для обхода TypeScript. Assertion допустим после валидации или на границе с явно описанной причиной.
- Используй `as const` для литеральных конфигураций и enum-like объектов.
- Вместо `@ts-ignore` используй `@ts-expect-error` с объяснением причины, если подавление необходимо.

## Runtime predicates

Для базовых runtime-проверок используй `shared/lib/value-predicates`. Если библиотеки нет, создай её по [`typescript/value-predicates/README.md`](typescript/value-predicates/README.md).

- Импортируй predicates через public API библиотеки.
- Базовая библиотека содержит только проверки nullish, primitives, strings, arrays, records и literal unions.
- Доменные guards (`isOrder`, `isCity`) размещай рядом с владельцем данных.
- Для пустого или непустого списка используй `isEmptyArray` и `isNonEmptyArray`, а не `.length` в boolean-условии.
- Для массива из внешнего `unknown` используй `isArrayOf(value, itemGuard)`.
- Перед чтением полей object-like `unknown` используй `isRecord` и `hasOwn`.
- Прямой `.length` допустим, когда нужен числовой размер, индексный цикл или проверка длины строки.

```ts
/**
 * Проверяет runtime-значение на соответствие заказу.
 *
 * Сужает unknown после проверки обязательного строкового идентификатора.
 */
const isOrder = (value: unknown): value is Order => {
  return isRecord(value) && hasOwn(value, 'id') && isString(value.id)
}

if (isArrayOf(response.data, isOrder)) {
  // response.data: Order[]
}
```

## TypeScript-документация

Следуй общим правилам JSDoc из JavaScript. Выбирай объём описания по сложности функции и не дублируй
TypeScript-сигнатуру через `@param`, `@returns` и `@type`.

- Каждый `type`, `interface`, `enum` и каждое их поле или значение имеют JSDoc.
- Константу документируй, если это публичный контракт, доменное ограничение, magic value или переиспользуемая конфигурация.
- Документируй смысл и ограничения значения, а не его объявленный тип.

```ts
/**
 * Фильтры списка заказов.
 */
export type OrderFilters = {
  /** Идентификатор владельца заказов. */
  userId?: string
  /** Статус заказа для фильтрации. */
  status?: OrderStatus
}
```

## Наборы констант и literal types

Применяй общие правила главы [`Константы и стабильные значения`](javascript.md#константы-и-стабильные-значения) из JavaScript. Если набор значений нужен одновременно в runtime и type system, объявляй enum-like объект через `as const` и выводи из него literal union.

- Константный объект верхнего уровня называй в `SCREAMING_SNAKE_CASE`.
- Ключи объекта называй в `SCREAMING_SNAKE_CASE`.
- Runtime-значения сохраняют формат контракта и не обязаны повторять регистр ключей.
- Выводи type из объекта, а не дублируй значения вручную в отдельном union.
- Документируй назначение набора и смысл отдельных значений, если он неочевиден из контракта.
- Error codes, статусы, режимы, типы событий и feature flags являются частными случаями этого паттерна.

```ts
/**
 * Поддерживаемые состояния оплаты.
 */
export const PAYMENT_STATUS = {
  /** Оплата ожидает подтверждения. */
  PENDING: 'pending',
  /** Оплата подтверждена. */
  PAID: 'paid',
  /** Оплата завершилась ошибкой. */
  FAILED: 'failed'
} as const

/**
 * Состояние оплаты.
 */
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]
```

## Проверка

- JavaScript-правила применены до TypeScript-правил.
- Guard clauses обеспечивают narrowing без необоснованных assertions.
- Публичные контракты типизированы явно, локальные типы не дублируют inference.
- Type-only imports и exports оформлены явно.
- `any`, `unknown`, assertions и suppressions обоснованы.
- Runtime-данные сужаются predicates, доменные guards принадлежат владельцам.
- Runtime-наборы значений объявлены один раз, а literal types выведены из них.
- Именованные TypeScript-функции имеют JSDoc с достаточным для понимания поведения контекстом.
- TypeScript-контракты документированы без повторения сигнатур.
