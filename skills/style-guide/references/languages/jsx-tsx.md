# JSX и TSX

Применяй к JSX/TSX-деревьям. Для `.jsx` также загрузи JavaScript, для `.tsx` — JavaScript и TypeScript. Для React-компонента дополнительно загрузи [`карту React-раздела`](../frameworks/react/README.md) и профильные React-референсы.

JSX должен описывать готовое дерево, а не содержать вычисления, сложное ветвление и проверки формы данных.

## Props и формат элементов

- Строковые props пиши в двойных кавычках, динамические значения передавай через `{...}`.
- Статический boolean prop записывай без `={true}`, динамический — как `disabled={isSaving}`.
- Не добавляй пустые, дублирующиеся и неиспользуемые props.
- Короткий элемент оставляй в одну строку.
- В многострочном элементе размещай каждый prop отдельно, закрывающую скобку — на отдельной строке.
- Открывающий и закрывающий теги элемента с вложенным деревом размещай на отдельных строках.

```tsx
<UserCard
  user={user}
  isSelected={isSelected}
  onSelect={handleSelect}
/>
```

## Predicates и подготовка значений

- Проверяй данные predicates до передачи в JSX.
- В JSX оставляй только простой predicate gate или заранее подготовленный boolean-флаг.
- Составные runtime-условия, labels, длинные пути к данным и UI-решения вычисляй до `return`.
- Boolean-флаги называй через `is*`, `has*`, `can*` или `should*`.
- Локальные данные называй с суффиксами `Data`, `Items` или `List`.
- Для nullish-проверки используй `isDefined` или `isNotDefined`, если `0`, `false` и пустая строка являются допустимыми значениями.
- Не подменяй predicate неявной truthy-проверкой, если тип или контракт значения шире boolean.
- Если базовых predicates нет, создай `shared/lib/value-predicates` по [`value-predicates`](typescript/value-predicates/README.md) до изменения JSX.

```tsx
const profileUser = currentUser.error ? null : currentUser.data
const ordersData = orders.data
const shouldShowEmptyState = !orders.isLoading && isEmptyArray(ordersData)

return (
  <>
    {isDefined(profileUser) && (
      <Profile user={profileUser} />
    )}

    {isNonEmptyArray(ordersData) && (
      <OrdersList orders={ordersData} />
    )}

    {shouldShowEmptyState && (
      <EmptyState />
    )}
  </>
)
```

## Формат conditional rendering

После boolean-условия и `&& (` всегда переноси JSX на новую строку. Закрывающую `)` размещай на отдельной строке перед `}`. Применяй этот формат даже к одному короткому элементу.

Плохо:

```tsx
{isNonEmptyArray(ordersData) && (<OrdersList orders={ordersData} />)}
```

Также не оставляй элемент без группирующих скобок:

```tsx
{isNonEmptyArray(ordersData) && <OrdersList orders={ordersData} />}
```

Хорошо:

```tsx
{isNonEmptyArray(ordersData) && (
  <OrdersList orders={ordersData} />
)}
```

## Проверка массивов

Не используй `.length` как boolean-условие существования, пустоты или отображения массива.

Запрещённые формы:

```tsx
items?.length
items.length > 0
items.length !== 0
items.length === 0
!items.length
items && items.map(...)
items?.length && <ItemsList items={items} />
```

Такие проверки смешивают размер массива с boolean-решением, ухудшают narrowing и могут вывести `0` в React.

- Для непустого типизированного массива используй `isNonEmptyArray`.
- Для пустого, отсутствующего или `undefined` списка используй `isEmptyArray` согласно контракту predicate.
- Для массива из внешнего `unknown` используй `isArrayOf(value, itemGuard)`.
- Сначала присвой длинный путь локальной переменной, затем проверь и используй её.
- Если массив заранее нормализован и список нужно отрисовать без отдельного gate, прямой `map` допустим.
- Не добавляй predicate gate вокруг `map`, если пустой массив и так должен вернуть пустое дерево.

```tsx
const ordersData = orders.data
const shouldShowEmptyState = isEmptyArray(ordersData) && !orders.isLoading

return (
  <>
    {isNonEmptyArray(ordersData) && (
      <OrdersList orders={ordersData} />
    )}

    {shouldShowEmptyState && (
      <EmptyState />
    )}
  </>
)
```

Нормализованный массив:

```tsx
const ordersData = orders.data ?? []

return ordersData.map((order) => (
  <OrderCard key={order.id} order={order} />
))
```

## Тернарные выражения

Не используй ternary внутри JSX независимо от размера веток.

Плохо:

```tsx
return (
  <section>
    {isLoading ? <LoadingState /> : <OrdersList orders={orders} />}
  </section>
)
```

Для scalar-значения вычисли результат до JSX:

```tsx
const submitLabel = isSaving ? 'Сохраняем' : 'Сохранить'

return <button type="submit">{submitLabel}</button>
```

Для необязательного небольшого элемента используй простой predicate gate:

```tsx
return isDefined(user) && (
  <UserCard user={user} />
)
```

Для взаимоисключающих состояний верхнего уровня используй Early Return после всех hooks:

```tsx
/**
 * Отображает список заказов пользователя.
 *
 * Используется для:
 *  - отображения состояний загрузки и ошибки заказов
 *  - отображения загруженного списка заказов
 */
const Orders = (props: OrdersProps) => {
  const orders = useOrders(props.userId)

  if (orders.isLoading) {
    return <LoadingState />
  }

  if (isDefined(orders.error)) {
    return <ErrorState error={orders.error} />
  }

  return <OrdersList orders={orders.data} />
}
```

- Не заменяй один ternary парой дублирующих условий `condition && ...` и `!condition && ...`.
- Не используй IIFE, `switch` или inline-функцию внутри JSX для обхода запрета ternary.
- Не размещай Early Return перед hooks, которые должны вызываться на каждом render.

## Декомпозиция JSX

Не сохраняй крупное JSX-дерево в переменную, если единственная цель переменной — позднее вставить это дерево в собственный `return`.

Плохо:

```tsx
const ordersContent = (
  <section>
    <OrdersToolbar filters={filters} onChange={handleFilterChange} />
    <OrdersSummary orders={ordersData} />
    <OrdersGrid orders={ordersData} />
  </section>
)

return <main>{ordersContent}</main>
```

Вынеси крупную ветку в отдельный именованный компонент:

```tsx
return (
  <main>
    <OrdersSection
      filters={filters}
      orders={ordersData}
      onFilterChange={handleFilterChange}
    />
  </main>
)
```

`OrdersSection` размещается в отдельном component-файле по правилам React и физической структуры SLM.

Выноси JSX в отдельный компонент, если выполняется хотя бы одно условие:

- ветка содержит несколько смысловых элементов;
- ветка имеет собственные conditions, handlers или подготовку данных;
- внутри ветки находится самостоятельный список или состояние интерфейса;
- разметка повторяется;
- JSX-переменная или render-функция нужна только для уменьшения размера родительского `return`;
- блоку требуется комментарий, чтобы объяснить его назначение.

- Не заменяй компонент функцией `renderOrders()` или `getOrdersContent()`, возвращающей JSX.
- Не объявляй новый компонент внутри тела родительского компонента.
- Не выноси один простой элемент в компонент без самостоятельной ответственности.
- Передавай вложенному компоненту минимальные подготовленные данные и callbacks, а не весь query/store без необходимости.

### Допустимое исключение для ReactNode

JSX-переменная допустима, когда React-элемент является значением для prop, slot, config или внешнего API, а не способом сократить собственный `return`.

```tsx
const emptyState = (
  <EmptyState
    description="Заказы не найдены"
    onReset={handleResetFilters}
  />
)

const tableConfig = {
  emptyState
}

return <OrdersTable config={tableConfig} orders={ordersData} />
```

- Используй исключение только когда API действительно принимает `ReactNode` или конфигурацию с React-элементом.
- Если prop принимает ReactNode напрямую, короткий элемент передавай inline: `emptyState={<EmptyState />}`.
- Если крупную ветку можно представить отдельным компонентом, создай компонент и передай `<OrdersSection />`, а не храни его реализацию в переменной родителя.
- Не называй обычную render-переменную «slot» или «config» только для обхода правила декомпозиции.
- Не применяй это исключение к JSX-переменной, которая используется единственный раз внутри собственного `return` без требования API.

## Wrappers

- Не добавляй wrapper только ради форматирования или CSS.
- Учитывай влияние wrapper на DOM, layout и доступность.
- Используй Fragment, только когда нужен единый JSX-root без дополнительного DOM-узла.
- Не меняй HTML-семантику и ARIA в style-only задаче.

## Комментарии

### Верхнеуровневый комментарий компонента

Каждый React-компонент обязан иметь JSDoc непосредственно перед объявлением.

- Описывай назначение компонента и только необходимый контекст его применения.
- Используй одну или несколько строк и абзацев в зависимости от сложности компонента.
- Добавляй сценарии применения, ограничения и важные особенности только когда они помогают понять контракт.
- Не пересказывай props, JSX-структуру и детали реализации.

```tsx
/**
 * Показывает текущую доступность пользователя.
 */
export const UserStatus = (props: UserStatusProps) => {
  // ...
}
```

### Комментарии внутри JSX/TSX

Обязательный JSDoc компонента не является комментарием внутри JSX-дерева. Для самой разметки действуют отдельные правила:

- По умолчанию не комментируй JSX/TSX-дерево.
- Оставляй комментарии только для workarounds, внешних ограничений и неочевидных причин.
- Используй только однострочную форму: `{/* Причина. */}`.
- Не комментируй очевидную структуру или назначение элемента.
- Если блоку нужен комментарий для объяснения назначения, выдели именованный компонент.

## Проверка

- Props оформлены единообразно, строки и expressions используют правильный синтаксис.
- JSX использует predicates и подготовленные boolean-флаги вместо неявных truthy-проверок.
- Conditional rendering через `&&` переносит JSX между отдельными строками `&& (` и `)}`.
- Условия пустоты и непустоты массивов не используют `.length`.
- В JSX отсутствуют ternary, IIFE, `switch` и inline render-функции.
- Крупные JSX-деревья не сохранены в переменные и вынесены в отдельные компоненты.
- JSX-переменные используются только как необходимые ReactNode-значения для props, slots, config или внешнего API.
- Early Return расположен после обязательных hooks.
- Длинные пути к данным не дублируются.
- React-компонент имеет верхнеуровневый JSDoc с достаточным для понимания контракта контекстом.
- Комментарии внутри JSX/TSX используются только для внешних ограничений, workarounds и неочевидных причин.
- Нет случайных wrappers и неуместных комментариев.
