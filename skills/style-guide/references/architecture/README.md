# Архитектура

Этот раздел определяет архитектурные решения frontend-приложения до выбора React-компонента, hook, state manager или
способа доступа к данным.

SLM Design является источником общих правил о владельцах, слоях, модулях, публичных фасетах и зависимостях. Локальные
референсы этого style guide не повторяют SLM, а фиксируют способ его применения и дополнительные project policies.

## Порядок работы

```text
Ответственность и продуктовый результат
→ владелец и слой по SLM Design
→ публичный контракт и ожидаемые исходы
→ граница внешних данных и defects
→ физическая структура
→ framework и technologies
```

Framework-компонент, hook, store, API client или mapper не становится архитектурным владельцем из-за своей технической
роли. Сначала определи смысл и владельца, затем механизм реализации.

## Карта раздела

| Референс | Когда загружать |
| --- | --- |
| [`slm-design.md`](slm-design.md) | Выбор владельца, слоя, module boundary, public API и допустимых зависимостей |
| [`slm-structure.md`](slm-structure.md) | Физическое размещение уже спроектированных SLM-единиц по локальным соглашениям |
| [`domains/README.md`](domains/README.md) | Проектирование или изменение предметного домена |
| [`domains/contracts.md`](domains/contracts.md) | Модели, команды, результаты, public API и граница DTO |
| [`domains/adapters.md`](domains/adapters.md) | Связь внешних источников с моделями и consumers домена |
| [`domains/errors.md`](domains/errors.md) | Ожидаемые неуспешные исходы, typed domain errors, codes и factories |
| [`failure-handling.md`](failure-handling.md) | Неожиданные defects, telemetry и безопасные application fallbacks |

## Граница документов

- SLM определяет, кто владеет ответственностью и контрактом.
- Domain policy определяет форму моделей, adapters, typed errors и error codes.
- Failure policy определяет путь неожиданных defects вне штатного доменного результата.
- Technology reference определяет transport, cache или другой механизм.
- Framework reference определяет integration с lifecycle и UI.

Не объявляй typed exceptions, каталог `types/`, adapter namespace или конкретную библиотеку обязательным правилом SLM.
Это policies данного style guide поверх архитектурной модели.

## Примеры

Архитектурные документы остаются независимыми от framework. Полный React-пример домена находится в
[`frameworks/react/examples/domains/pet`](../frameworks/react/examples/domains/pet/README.md) и показывает применение
этих policies через REST API client и SWR hook.
