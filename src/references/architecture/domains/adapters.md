# Доменные адаптеры

Доменный adapter является data boundary домена для работы с внешним источником. Он реализует операции в предметных
терминах, возвращает domain models и бросает только объявленные domain errors либо unexpected application defect.

Adapter используют внутренние consumers данных домена, а внешние consumers получают его capabilities через public
facet:

```text
React hook ────────┐
Domain service ────┼→ domain adapter → API client / SDK / storage
Public facet ──────┘
```

Ни hook, ни service, ни внешний consumer не вызывают generated API operation напрямую, если данные принадлежат домену.

## Зачем нужен adapter

Внешний источник определяет wire contract, но не предметный смысл приложения. Adapter превращает технический источник
в стабильную capability домена:

- принимает domain input;
- вызывает готовый API client или SDK;
- проверяет недоверенный response при необходимости;
- преобразует DTO в собственную domain model;
- интерпретирует известные source errors как объявленные domain errors;
- направляет неизвестный сбой в application defect policy;
- изолирует смену endpoint, SDK и wire format от всех consumers.

## Public contract

Adapter публикуется через подходящий facet домена. Его API не содержит название endpoint, DTO или transport:

```ts
export const getPetAdapter = async (petId: string): Promise<Pet> => {
  // Source integration остаётся внутри adapter.
}
```

Корневой facet экспортирует adapter как отдельную именованную capability:

```ts
export { getPetAdapter } from './adapters/get-pet.adapter'
```

Внешний consumer использует стабильный public API домена:

```ts
const pet = await getPetAdapter(petId)
```

Суффикс `Adapter` явно показывает consumer, что доступ к данным проходит через доменную границу. Не экспортируй generated
client или source operation как альтернативный путь: иначе часть consumers обойдёт domain mapping и снова начнёт
зависеть от DTO и source errors.

## Использование внутри домена

Framework-механизмы домена используют adapter напрямую:

```ts
const fetcher = ([, petId]: GetPetKey) => getPetAdapter(petId)
```

Hook отвечает за React/SWR lifecycle, но не повторяет API request, DTO mapping и обработку source errors. Service
координирует сценарий, но также не обходит adapter ради прямого вызова API client.

Внутри домена импортируй adapter по локальному implementation path, чтобы internal code не зависел от собственного
public barrel и не создавал cycle. За пределами домена импортируй capability только через public facet.

## Почему не service

Роль определяется поведением, а не принадлежностью к домену:

| Роль | Ответственность |
| --- | --- |
| Adapter | Связывает внешний source contract с domain models и domain errors |
| Domain service | Реализует предметный сценарий или правило, не принадлежащее одной модели |
| Composition service | Координирует несколько готовых domain capabilities |

Если функция только вызывает API, преобразует DTO и интерпретирует source errors, она остаётся adapter даже внутри
домена. Service может вызвать один или несколько adapters, применить бизнес-правила и выполнить переход состояния.

Не создавай service как бессмысленный wrapper над одной adapter operation. Добавляй его, когда появляется отдельная
предметная ответственность: координация, правило, переход или транзакционный сценарий.

## Контракт adapter

Adapter принимает и возвращает только domain types на публичной стороне:

```ts
type GetPetAdapter = (petId: string) => Promise<Pet>
```

Source DTO существует только внутри implementation:

```ts
type PetDto = Awaited<ReturnType<typeof petStoreApi.pets.getPet>>

const mapPetDto = (dto: PetDto): Pet => ({
  id: dto.id,
  name: dto.name
})
```

Adapter не возвращает:

- generated DTO или response wrapper;
- HTTP status и headers без предметного контракта;
- `ApiError`, SDK error или raw rejection;
- generic `{ data, error }`, повторяющий source API;
- transport-specific pagination, enum и nullable semantics без domain mapping.

Если сценарию действительно нужны metadata или pagination, домен сначала объявляет их собственную форму.

## Domain errors

Adapter знает source error только для интерпретации в контексте конкретной operation. Он создаёт ожидаемую ошибку через
internal domain factory:

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

Не конструируй error details произвольным object literal в каждом adapter. Domain factory централизует class, code и
payload. Factory остаётся внутренней, а consumers получают public error type, guard и стабильные codes.

Одинаковый source error может иметь разный предметный смысл в разных adapter operations. Не создавай один глобальный
mapping всех HTTP statuses на domain codes.

## Несколько источников

Public adapter скрывает выбор источника. Если нужны REST, cache и fallback SDK, раздели внутреннюю реализацию, но не
заставляй consumer выбирать source:

```text
adapters/
├── get-pet.adapter.ts
├── update-pet.adapter.ts
└── sources/
    ├── pet-store.source.ts
    └── pet-cache.source.ts
```

Каждый operation adapter определяет mapping своего сценария. Общий source-specific helper может определять приоритет,
fallback и reconciliation; такие helpers не экспортируются через domain facets.

Не создавай injected repository interface только ради гипотетической замены. Port нужен при нескольких реализациях,
реальной runtime composition или отдельной test boundary.

## Runtime facets

Если adapter универсален, экспортируй его через `index.ts`. Если transport зависит от browser, server request context
или другой среды, раздели реализации и capabilities через `browser.ts`, `client.ts` или `server.ts`.

Не реэкспортируй browser и server capabilities из общего barrel. Проверяй весь транзитивный module graph public facet.

## Тестирование

- Контракт adapter тестируется через domain inputs, models и errors.
- DTO mapper тестируется отдельно на wire fixtures.
- Source error mapping покрывает только объявленные expected cases.
- Unknown response и invariant violation проверяются как application defects.
- Hook test подменяет domain adapter, а не generated API client.

## Проверка

- Внутренние consumers доменных данных используют adapter напрямую; внешние consumers импортируют именованный adapter
  через public facet.
- API client и generated operations не опубликованы от имени домена.
- Adapter принимает и возвращает domain types.
- DTO и source errors не пересекают adapter boundary.
- Expected source case создаёт domain error через internal factory.
- Unknown source failure становится application defect.
- Runtime-specific capability опубликована только через подходящий facet.
