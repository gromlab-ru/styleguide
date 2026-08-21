# Доменные адаптеры

Adapter является внутренней ролью домена: он связывает domain contract с API client, SDK, storage или другим внешним
источником. Consumer использует предметную operation домена и не знает, каким adapter она реализована.

## Public operation

Файл adapter может находиться во внутреннем сегменте `adapters/`, но экспортируемая capability называется в терминах
домена:

```ts
// adapters/get-pet.adapter.ts
export const getPet = async (petId: string): Promise<Pet> => {
  // Source integration остаётся внутри домена.
}
```

Public facet экспортирует эту же функцию без дополнительного wrapper:

```ts
export { getPet } from './adapters/get-pet.adapter'
```

Не публикуй имена `getPetAdapter`, `petAdapter.getPet()` и source-specific operations. Суффикс `.adapter.ts` описывает
роль implementation-файла, а не contract consumer.

## Consumers

Внешний consumer импортирует operation только через public facet домена:

```ts
import { getPet } from 'src/domains/pets'
```

Hook, service и другой код внутри того же домена используют локальный implementation path:

```ts
import { getPet } from '../../adapters/get-pet.adapter'
```

Framework integration вызывает ту же operation:

```ts
const fetcher = ([, petId]: GetPetKey) => getPet(petId)
```

Не создавай service или public operation как wrapper над adapter. Одна функция одновременно реализует source boundary
и предоставляется через facet под предметным именем.

Port или repository interface добавляется только при нескольких реализациях, runtime composition или отдельной test
boundary. Гипотетическая замена источника не является достаточной причиной.

## Mapping

Adapter использует внутренние mappers для преобразования source requests и responses. Даже identity mapping возвращает
явный domain type. DTO не сохраняется в domain state/cache и не передаётся domain UI.

```ts
const mapPetDto = (petDto: PetDto): Pet => ({
  id: petDto.id,
  name: petDto.name
})
```

## Ошибки

Adapter интерпретирует известный source error в контексте operation и создаёт объявленную domain exception через
внутреннюю factory. Неизвестный сбой становится `ApplicationDefect`:

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

Raw source error не становится expected contract consumer. Диагностический `cause` может сохраняться только внутри
`ApplicationDefect` и обрабатывается общей boundary, а не feature consumer.

В SLM-проектах product-agnostic `ApplicationDefect` и `toApplicationDefect` принадлежат
`shared/lib/application-defect`.

## Проверка

- Public operation имеет предметное имя без суффикса `Adapter`.
- Внешние consumers используют public facet, внутренние — implementation path.
- Adapter возвращает domain result после явного mapping.
- Service и public wrapper не дублируют adapter.
- Expected source cases и unknown defects направлены в разные каналы.
