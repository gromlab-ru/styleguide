# Доменный контракт

Доменный контракт описывает предметную ответственность независимо от REST API, SDK, storage и framework. Он является
единственным контрактом продуктовых данных для consumers домена.

## Что объявляет домен

- модели и value objects;
- идентификаторы и enums с предметным смыслом;
- входы команд и queries;
- успешные результаты;
- ожидаемые неуспешные исходы;
- события и доступные формы состояния;
- public capabilities для реальных consumers.

## Независимость от DTO

Публичную модель объявляй непосредственно в домене:

```ts
export type Pet = Readonly<{
  id: string
  name: string
}>
```

Не выводи её из source type:

```ts
// Неверно: источник владеет формой домена.
export type Pet = PetDto
export type Pet = Pick<PetDto, 'id' | 'name'>
export type Pet = Awaited<ReturnType<typeof petStoreApi.pets.getPet>>
```

Request и response types источника допускаются только во внутреннем adapter или mapper. Даже identity mapping должен
явно вернуть доменный тип, чтобы последующая смена источника не меняла public contract автоматически.

## Входы и результаты

Публичная operation принимает параметры в терминах домена и возвращает объявленный доменный результат:

```ts
export type GetPetInput = Readonly<{
  petId: string
}>

export const getPetAdapter = async (input: GetPetInput): Promise<Pet> => {
  // Source integration и domain error mapping остаются внутри adapter.
}
```

Не публикуй generated operation, request DTO или полный API client от имени домена. Public domain adapter переводит
доменный input в source request и source response в доменную модель, скрывая технический контракт от consumers.

## Public API

- Корневой `index.ts` экспортирует framework-independent contract и capabilities.
- `client.ts` экспортирует React hooks и другой browser/client-only API.
- `server.ts` или `browser.ts` создавай только при доказанной runtime boundary.
- Mapper, source-specific helpers, error factories и implementation details остаются внутренними.
- Не экспортируй сегмент namespace только потому, что он существует физически.

Публичное имя должно выражать предметную capability и роль boundary, например `getPetAdapter`, а не source namespace
`petStoreApi.pets.getPet`.

## Состояние и cache

Domain state и remote cache содержат доменные модели и результаты, а не DTO. Если одному source response нужны разные
предметные представления, каждый домен создаёт собственный mapping и cache namespace.

Не используй один cache key для DTO и доменной модели: consumers должны однозначно знать contract cache entry.

## Проверка

- Public types не импортируют source types.
- Public API не реэкспортирует generated operations и DTO.
- Input и result сформулированы в предметных терминах.
- Mapping source contract находится внутри домена.
- Cache и domain state не содержат DTO.
- Public facets не открывают implementation details.
