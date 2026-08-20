# Домены

Перед проектированием домена загрузи skill `slm-design` и используй его раздел о доменах как источник архитектурных
правил. Этот reference фиксирует локальную policy style guide поверх SLM.

## Роль домена

Домен является единственным владельцем одной связной предметной ответственности и её публичного смысла:

- моделей и идентификаторов;
- команд и параметров сценариев;
- результатов и ожидаемых неуспешных исходов;
- бизнес-правил и допустимых состояний;
- адаптации внешних данных и ошибок;
- продуктового состояния и доменного UI;
- framework-механизмов, обслуживающих сценарий.

Домен не является владельцем всего состояния приложения. Transport остаётся в `infra`, generic primitives могут
принадлежать `shared`, compositions связывают готовые capabilities, а локальное визуальное state принадлежит своему
UI-владельцу.

## Порядок проектирования

1. Сформулируй предметную ответственность и сценарии.
2. Объяви собственные входы, модели и результаты без упоминания endpoint, SDK и DTO.
3. Определи ожидаемые неуспешные исходы каждого сценария.
4. Проведи границу между ожидаемым исходом и неожиданным defect.
5. Только после этого выбери внешние источники и technical dependencies.
6. Адаптируй requests, responses и source errors внутри домена.
7. Открой через public facets только capabilities реальных consumers.
8. Проверь contract adapter отдельно от его source mapping.

Подробная policy контракта находится в [`contracts.md`](contracts.md), связи с источниками — в
[`adapters.md`](adapters.md), ожидаемых ошибок — в [`errors.md`](errors.md), неожиданных defects — в
[`../failure-handling.md`](../failure-handling.md).

## Граница источника

```text
Domain command
→ public domain adapter
→ API client / SDK / storage
→ DTO или source error
→ internal domain mapping
→ domain model или typed domain error
```

DTO, source error и transport status не пересекают публичную границу домена. Совпадение полей DTO и модели не делает
DTO доменным контрактом.

## Framework integration

React hook, SWR key и subscription могут находиться внутри домена, если обслуживают его сценарий. Внутри домена они
импортируют adapter по implementation path и не вызывают API client, не определяют модели и не интерпретируют source
errors самостоятельно. Внешние consumers получают тот же adapter через public facet.

Полная реализация показана в
[`React pet domain`](../../frameworks/react/examples/domains/pet/README.md). Пример демонстрирует конкретный stack, но
не изменяет framework-independent правила домена.

## Проверка

- У доменной ответственности есть один модуль-владелец.
- Public contract описан без DTO, endpoint и source error.
- Ожидаемые исходы объявлены до source mapping.
- Неожиданный defect не замаскирован под штатную доменную ошибку.
- Framework и transport остаются механизмами реализации.
- Consumers импортируют домен только через подходящий public facet.
