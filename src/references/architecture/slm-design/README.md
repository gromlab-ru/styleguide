# SLM Design

Этот профиль применяется только в проектах, где команда выбрала SLM Design.

Архитектурные решения о владельцах, слоях, модулях, фасетах и зависимостях принимай по agent skill `slm-design`. Если
skill недоступен, используй [официальную документацию SLM Design](https://gromlab-ru.github.io/slm-design/).

Профиль не заменяет эти источники и содержит только дополнительные соглашения команды.

## Решения команды

| Область | Референс | Что выбрано командой |
| --- | --- | --- |
| Домены | [`domains/README.md`](domains/README.md) | Обязательный доступ к продуктовым данным только через public API владельца |
| Доступ к источникам | [`domains/adapters.md`](domains/adapters.md) | Internal adapters за предметными public operations |
| Ожидаемые ошибки | [`domains/errors.md`](domains/errors.md) | Typed exceptions со стабильными domain codes |

Полный пример применения policies находится в
[`frameworks/react/examples/domains/pet`](../../frameworks/react/examples/domains/pet/README.md).
