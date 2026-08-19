# Value Predicates

Базовая библиотека runtime predicates для безопасной работы с `unknown`, `null`, primitives, массивами и объектами.

## Когда использовать

- Скопируй `index.ts` и `value-predicates.ts` в `shared/lib/value-predicates/`, только если style guide требует predicates, а проект ещё не предоставляет эквивалентную библиотеку.
- Импортируй функции через public API: `shared/lib/value-predicates`.
- Не добавляй сюда доменные guards для DTO и API-моделей. Размещай их рядом с владельцем данных.

## Группы

- Nullish: `isDefined`, `isNotDefined`.
- Primitives: `isString`, `isNumber`, `isBoolean`.
- Strings: `isNonEmptyString`.
- Arrays: `isArray`, `isArrayOf`, `isEmptyArray`, `isNonEmptyArray`.
- Objects: `isRecord`, `hasOwn`.
- Literal unions: `isOneOf`.

## Выбор predicate

| Сценарий | Predicate |
| --- | --- |
| Удалить `null` и `undefined`, сохранив `0`, `false` и `''` | `isDefined` |
| Проверить непустой типизированный список | `isNonEmptyArray` |
| Показать empty state для `null`, `undefined` или `[]` | `isEmptyArray` |
| Проверить массив из внешнего `unknown` | `isArrayOf(value, itemGuard)` |
| Прочитать поле неизвестного объекта | `isRecord` + `hasOwn` + predicate поля |
| Проверить значение literal union | `isOneOf` |

```ts
/**
 * Проверяет runtime-значение на соответствие заказу.
 *
 * Сужает unknown после проверки обязательных полей заказа.
 */
const isOrder = (value: unknown): value is Order => {
  return (
    isRecord(value) &&
    hasOwn(value, 'id') &&
    isString(value.id) &&
    hasOwn(value, 'title') &&
    isString(value.title)
  )
}

if (isArrayOf(response.data, isOrder)) {
  // response.data: Order[]
}
```

Прямой `.length` допустим, когда нужен числовой размер, проверка длины строки или индексный цикл. Для boolean-решения о пустом списке используй predicate.
