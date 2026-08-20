# Технологии

Этот раздел определяет выбранные frontend-технологии, их ответственность и общий способ работы с ними.
Framework-референсы подключают технологии к конкретным сценариям и добавляют только integration-specific правила.

## Карта раздела

| Технология | Когда загружать |
| --- | --- |
| [`rest-api/`](rest-api/README.md) | Создание, настройка или использование REST API client |
| [`swr/`](swr/README.md) | REST GET-data, SSR cache hydration и realtime subscriptions через SWR |
| [`svg-sprites/`](svg-sprites/README.md) | Создание, генерация или использование SVG sprites |

Не дублируй setup и базовые контракты технологии в framework-разделе. Сначала загрузи technology reference, затем
добавь профильный framework reference для интеграционной границы, component или другого сценария приложения.
