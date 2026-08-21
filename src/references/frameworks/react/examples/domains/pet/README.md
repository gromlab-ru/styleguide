# Pet domain в React

Пример показывает домен, который связывает внешний REST API с собственной моделью через внутренний adapter и
предоставляет предметную operation `getPet`. Hook и внешние consumers не вызывают API client напрямую.

Пример объединяет несколько references:

- skill `slm-design` определяет владельца, domain contract и source boundary;
- [`architecture/slm-design/domains/adapters.md`](../../../../../architecture/slm-design/domains/adapters.md) определяет domain adapters;
- [`architecture/slm-design/domains/errors.md`](../../../../../architecture/slm-design/domains/errors.md) определяет typed domain errors;
- [`failure-handling.md`](../../../../../failure-handling.md) определяет unexpected defects;
- [`technologies/swr/get-data.md`](../../../../../technologies/swr/get-data.md) определяет key и cache lifecycle.

## Структура

```text
pet/
├── index.ts
├── client.ts
├── adapters/
│   └── get-pet.adapter.ts
├── errors/
│   ├── pet-domain.error.ts
│   ├── pet-error-code.ts
│   └── index.ts
├── hooks/
│   └── use-get-pet/
│       ├── types/
│       │   └── use-get-pet.type.ts
│       ├── get-pet-key.ts
│       └── use-get-pet.hook.ts
├── mappers/
│   └── get-pet.mapper.ts
└── types/
    ├── pet.type.ts
    └── index.ts
```

Названия сегментов являются локальной формой примера. Архитектурные инварианты определяет SLM, а domain references
фиксируют выбранные командой формы adapter и error contract.

## Public facets

- `index.ts` предоставляет framework-independent `getPet`, модель, operation-specific error contract и server-safe key generator.
- `client.ts` предоставляет React hook и не втягивается в server module graph.
- Mapper, error factories, source errors и API client остаются внутренними.

Внутренний hook импортирует `getPet` по implementation path, чтобы не зависеть от собственного public barrel. Внешний
consumer вызывает `getPet` только через `index.ts` домена. Суффикс `.adapter.ts` остаётся деталью внутренней структуры.

`src/infra/pet-store-api` и `src/shared/lib/application-defect` обозначают готовые project capabilities. Пример не
определяет их реализацию. Настроенный API client считается универсальным; если transport зависит от browser или request
context, домен открывает соответствующую operation через отдельный runtime facet.

## Поток данных

```text
useGetPet или внешний consumer
→ getPet
→ petStoreApi.pets.getPet
→ Pet DTO
→ mapPetDto
→ Pet
```

SWR cache содержит `Pet`, а не DTO. Expected source case adapter преобразует через internal factory в
`GetPetError`. Unknown rejection становится `ApplicationDefect` и не попадает в feature consumer как ожидаемая
ошибка.

## Consumer

```tsx
const petQuery = useGetPet(petId)

if (petQuery.isLoading) {
  return <PetSkeleton />
}

if (petQuery.error !== undefined) {
  switch (petQuery.error.details.code) {
    case PET_ERROR_CODE.NOT_FOUND:
      return <PetNotFound petId={petQuery.error.details.payload.petId} />
    case PET_ERROR_CODE.TEMPORARILY_UNAVAILABLE:
      return <PetUnavailable onRetry={petQuery.refresh} />
  }
}

if (petQuery.pet === undefined) {
  return null
}

return <PetCard pet={petQuery.pet} />
```

Ближайший Error Boundary отвечает за unknown defects, повторно выброшенные hook. Event handlers и mutations используют
отдельный async defect handler по `failure-handling.md`.

## Что демонстрирует пример

- Доменная модель не выведена из DTO.
- Internal adapter является единственной source boundary домена.
- Hook и внешние consumers используют предметную operation `getPet`.
- Expected source cases создают typed domain errors через internal factories.
- Unknown source error не становится `UNEXPECTED` domain code.
- Public `client` facet передаёт только `GetPetError`, прошедшую operation-specific runtime guard.
