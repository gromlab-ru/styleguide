# Граница домена в SLM

Эта policy задаёт принятую командой форму применения правил `SLM-DOMAIN-R022`–`SLM-DOMAIN-R026`. Проектирование
владельца, сценариев и базового domain contract выполняй по skill `slm-design`.

## Обязательная граница

Для продуктовых данных с доменным владельцем любой consumer за пределами модуля использует только public API этого
домена. Правило распространяется на `app`, `compositions`, другие домены и framework integration вне владельца.

За пределами домена запрещено:

- напрямую вызывать API client, SDK, storage или другой внешний источник для получения и изменения доменных данных;
- импортировать DTO, source types и ошибки внешнего сервиса;
- самостоятельно преобразовывать ответы источника;
- интерпретировать HTTP statuses, SDK errors и другие технические признаки как продуктовые исходы.

Ограничение не относится к техническим capabilities без доменного владельца: telemetry, localization, theme и другим
возможностям `infra` в пределах ответственности consumer.

## Публичный контракт

Домен публикует только собственные:

- inputs и commands;
- models и results;
- events и доступные формы состояния;
- operation-specific expected errors.

Публичные операции называются в предметных терминах: `getPet`, `updatePet`, `searchOrders`. Суффикс `Adapter` описывает
внутреннюю роль и не входит в public API.

DTO и другие значения внешнего источника преобразуются внутренними mappers до попадания в domain state, cache, UI или
публичный результат.

## Поток данных

```text
app / composition / другой домен
→ public domain operation: getPet
→ internal adapter
→ API client / SDK / storage
→ source DTO
→ internal mapper
→ Pet

known source error
→ internal mapping
→ GetPetError
→ exhaustive consumer handling

unknown failure
→ ApplicationDefect
→ application boundary
```

Форму internal adapter определяет [`adapters.md`](adapters.md), ожидаемых ошибок — [`errors.md`](errors.md), неизвестных
сбоев — общая [`failure-handling policy`](../../../failure-handling.md).

## Проверка

- Consumer доменных данных импортирует public facet домена, а не источник.
- Public facet транзитивно не содержит DTO, source types и source errors.
- Source response преобразован до записи в state, cache и UI.
- Public operation названа в предметных терминах и не содержит суффикс `Adapter`.
- Expected errors объявлены для конкретной operation; unknown failure направлен в application boundary.

Полная реализация находится в
[`React pet domain`](../../../frameworks/react/examples/domains/pet/README.md).
