# Realtime в React

Этот документ определяет способ подключения realtime к React lifecycle. Контракт `useSWRSubscription`, keys,
subscribe callback, cleanup, sync payload, auth scope и reconnect описаны в
[`SWR subscriptions`](../../technologies/swr/subscriptions.md).

## Роли

Realtime integration разделяет три ответственности:

| Ответственность | Владелец |
| --- | --- |
| Connection, credentials, reconnect и protocol | Socket manager или SDK |
| Shared listener lifecycle и latest client projection | `useSWRSubscription` |
| Место и длительность подключения в React tree | SLM-владелец сценария |

`useSWRSubscription` выбран для React integration, потому что одинаковый key разделяет subscription между consumers,
а disposer вызывается после unmount последнего consumer. Это устраняет ручные listeners в каждом component, но не
делает SWR владельцем connection или авторитетным источником server state.

## Выбор integration mode

| Потребность | React integration |
| --- | --- |
| UI показывает последний transient snapshot | Component читает `data` из специализированного subscription hook |
| Realtime обновляет восстановимое REST-состояние | Subscription owner синхронизирует SWR GET-cache |
| Realtime нужен всему module subtree | Именованный owner component или Provider монтирует sync lifecycle |
| Realtime нужен только пока виден один consumer | Этот consumer монтирует subscription hook |
| Нужно отправить command | Action или service вызывает socket client напрямую |
| Нужен ordered event processing, replay или queue | Используется специализированный mechanism вместо latest-value subscription |

## Самостоятельное latest value

Используй subscription data напрямую, если UI нужен последний transient snapshot, который не требуется
восстанавливать через REST:

```text
socket manager
→ useSWRSubscription
→ latest data / error
→ React component
```

Подход подходит для presence, live progress, connection indicator и аналогичных значений. Не копируй latest value в
React state или Zustand только ради доступа из нескольких components: одинаковый subscription key уже предоставляет
shared client projection.

Если важна обязательная обработка каждого события, latest-value semantics не соответствует сценарию. Точные критерии
выбора находятся в
[`subscriptions.md#когда-swr-не-подходит`](../../technologies/swr/subscriptions.md#когда-swr-не-подходит).

## GET bootstrap и realtime sync

Для восстановимого server state авторитетным источником остаётся server, а SWR GET-cache является его канонической
клиентской проекцией:

```text
REST GET → SWR GET-cache → React consumers
realtime event → sync → тот же SWR GET-cache
```

Так UI получает данные до первого события, повторный GET восстанавливает клиентскую проекцию после disconnect, а
consumers не выбирают между двумя client stores.

Subscription owner применяет snapshot, delta или invalidation по фактическому контракту payload. Правила выбора и
защиты от stale updates находятся в
[`subscriptions.md#стратегии-sync`](../../technologies/swr/subscriptions.md#стратегии-sync).

## Lifecycle owner

SLM-владелец состояния определяет область жизни realtime integration:

- один visible consumer монтирует hook, если данные нужны только ему;
- module-wide sync монтируется именованным owner component или Provider на границе модуля;
- session-wide sync принадлежит session или application owner, а не случайной page;
- always-on sync не скрывается внутри визуального component, который исчезает при навигации.

Owner component может не рендерить DOM. Его назначение и область жизни должны быть понятны из имени и места
подключения. Наличие hook или Provider само по себе не создаёт новую архитектурную границу.

## Transport и session boundary

Subscription hook получает готовый transport. Его subscribe callback регистрирует exact listener и возвращает disposer,
а сам hook возвращает subscription response для React consumer. Создание shared connection, commands, auth, reconnect
и reconciliation остаются в transport manager или SDK.

При смене user identity session owner сначала отключает private subscription keys, затем меняет transport context и
активирует keys новой identity. Подробный порядок и требования к stable auth key находятся в
[`SWR subscriptions`](../../technologies/swr/subscriptions.md#socket-transport).

## Проверка

- Выбран самостоятельный latest snapshot или sync SWR GET-cache.
- Server не подменён клиентским cache как авторитетный источник данных.
- Subscription lifecycle имеет явного SLM-владельца.
- Always-on sync не зависит от случайного screen lifecycle.
- Hook использует готовый transport и не владеет shared connection.
- Для сложной event semantics выбран профильный mechanism, а не latest-value subscription.
- Технический контракт проверен по `technologies/swr/subscriptions.md`.
