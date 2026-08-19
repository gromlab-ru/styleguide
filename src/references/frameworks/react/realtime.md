# Realtime и subscriptions в React

Для realtime-данных и subscriptions по умолчанию используй [`useSWRSubscription`](https://swr.vercel.app/docs/subscription#useswrsubscription).

## Перед работой

1. Найди и загрузи agent skill `swr`.
2. Определи владельца realtime-ресурса и lifecycle соединения по SLM Design.
3. Проверь, соответствует ли сценарий модели `useSWRSubscription`.

## Базовый паттерн

- Используй стабильный subscription key, идентифицирующий ресурс.
- Передавай новые данные и ошибки через `next`.
- Обязательно возвращай cleanup, который прекращает subscription.
- Используй updater form `next`, когда новое событие зависит от предыдущих данных.
- Учитывай deduplication subscriptions с одинаковым key.
- Не дублируй subscription data в Zustand без отдельной ответственности client state.

Минимальный пример смотри в [`examples/subscriptions/use-swr-subscription/`](examples/subscriptions/use-swr-subscription/README.md).

## Когда SWR не подходит

Разрешено использовать другое средство, если задача не соответствует модели latest subscription data или React-managed lifecycle.

Типовые исключения:

- двунаправленный протокол с командами, acknowledgements и сложным состоянием соединения;
- высокочастотный поток с backpressure, batching или windowing;
- multiplexing и координация большого числа динамических каналов;
- replay, event log, offline queue или persistence;
- соединение живёт независимо от mounted React consumers;
- специализированный SDK уже управляет reconnect, heartbeat, transport и cleanup;
- требования протокола лучше покрывает другая библиотека или platform API.

В исключении:

- выбери средство, решающее фактические требования задачи;
- загрузи его agent skill или официальную документацию;
- зафиксируй причину отказа от `useSWRSubscription` рядом с владельцем integration;
- явно определи lifecycle, cleanup, reconnect, errors и источник истины;
- не скрывай transport lifecycle внутри случайного UI-компонента.

## Проверка

- Проверена применимость `useSWRSubscription` до выбора альтернативы.
- Subscription имеет стабильный key и cleanup.
- Владелец соединения и источник истины определены.
- Для альтернативы зафиксирована техническая причина и проверен lifecycle.
