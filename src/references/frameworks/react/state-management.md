# State management в React

Этот документ помогает выбрать источник истины состояния и React-механизм доступа к нему. Он не выбирает
архитектурного владельца: ответственность, module boundary и public API определяются по SLM Design.

## Главное правило

Не используй термин «глобальное состояние» как основание для выбора библиотеки. Сначала ответь:

1. Что означает состояние для продукта или UI.
2. Какой модуль владеет им по SLM Design.
3. Является ли источником истины browser client, REST API или realtime transport.
4. Каким consumers нужны данные и как долго они должны жить.
5. Кто создаёт, изменяет, сбрасывает и уничтожает состояние.

Один смысл должен иметь один источник истины. Не синхронизируй вручную несколько stores с одинаковыми данными.

## Выбор механизма

| Состояние | Механизм | Почему |
| --- | --- | --- |
| Значение принадлежит одному component subtree | React state или reducer | Состояние колокировано с lifecycle consumer и не требует внешнего store |
| Несколько частей UI используют общий client-only state | Zustand | Store даёт единые actions и точечные subscriptions без копирования state по component tree |
| Данные получены REST GET и отражают состояние сервера | SWR | Cache, request state, deduplication и revalidation являются частью server state lifecycle |
| Нужен последний transient realtime snapshot | `useSWRSubscription` | Subscription разделяется по key и очищается после последнего consumer |
| Realtime обновляет восстановимое REST-состояние | SWR GET-cache + subscription sync | GET остаётся каноническим bootstrap и восстанавливает состояние после reconnect |
| Важна обязательная обработка каждого события | Queue, reducer или специализированный event store | Latest-value semantics SWR может схлопнуть промежуточные события |

## React state

Используй `useState` или `useReducer`, когда состояние принадлежит одному component subtree и живёт вместе с ним:

- открытие локальной modal или dropdown;
- значение до подтверждения формы, если form library не владеет им;
- локальный выбор вкладки;
- временное состояние взаимодействия, не нужное другим владельцам.

Поднимай state к ближайшему общему React owner только пока он остаётся частью той же ответственности. Большое число
props само по себе не является основанием для Zustand: сначала проверь component boundary и публичный контракт.

Не копируй props или SWR data в local state без отдельной локальной семантики. Если нужен draft, явно отдели его от
server value и определи правила инициализации, сохранения и сброса.

## Zustand

Используй Zustand для разделяемого client-only state, когда React state больше не соответствует области потребления или
lifecycle, но данные не являются server cache.

Zustand выбран как preferred state manager, потому что предоставляет:

- небольшой typed store без обязательной иерархии Providers;
- подписку component только на выбранный slice;
- actions рядом с изменяемым состоянием;
- доступ из React и вне component tree через единый контракт;
- возможность создавать отдельные stores с разной областью жизни вместо одного универсального store.

Эти свойства уменьшают связанность consumers и количество служебного кода, но не отменяют архитектурного владельца.
Store принадлежит модулю, чью ответственность реализует, и не становится общим только потому, что его можно импортировать
из нескольких мест.

### Контракт store

- Храни state и изменяющие его actions в одном typed контракте владельца.
- Изменяй state через actions, а не через произвольные внешние вызовы `setState`.
- Выбирай в component минимальный slice вместо подписки на весь store.
- Используй несколько selectors, если component нужны независимые значения с разной частотой обновления.
- Выноси именованный selector, когда он переиспользуется или выражает правило чтения, а не ради каждой простой property.
- Не добавляй middleware, slices, persistence или devtools до появления соответствующей задачи.

Базовый пример находится в [`examples/stores/zustand/`](examples/stores/zustand/README.md).

### Область жизни

По умолчанию module-level Zustand store является singleton текущего JavaScript runtime. Перед его созданием проверь,
что состояние действительно должно переживать unmount отдельных consumers.

Если нужны независимые экземпляры одного state для нескольких subtree, tabs, widgets или requests, создай store factory
и явную Provider boundary. Не сохраняй request-specific или user-specific mutable state в общем server singleton.

Сброс state выполняет владелец lifecycle, например session module при logout или feature owner при завершении сценария.
Не распределяй одинаковую очистку по каждому component consumer.

### Persistence

Persistence изменяет lifecycle и контракт данных, поэтому не подключай её как удобную настройку по умолчанию.

До сохранения state определи:

- какие поля должны переживать reload;
- versioning и migration persisted schema;
- момент hydration и допустимое начальное UI-состояние;
- очистку при logout и смене tenant;
- отсутствие credentials, secrets и чувствительных данных;
- поведение при повреждённом или устаревшем значении.

Server state не становится client state только из-за требования переживать reload. Для REST-данных сначала используй
повторный GET, SSR или профильный cache mechanism.

## Граница Zustand и SWR

Server владеет REST state, а SWR cache хранит его клиентскую проекцию и subscription state. Zustand не должен
зеркалировать эти значения.

Не копируй в Zustand:

- response GET-operation;
- `isLoading`, `isValidating` и error SWR;
- канонический entity list или detail, который восстанавливается через REST;
- последнее subscription value, если consumer может читать его из `useSWRSubscription`;
- connection state, если transport SDK уже предоставляет его контракт.

Zustand может хранить client-only интерпретацию рядом с server state, например выбранный ID, режим отображения,
несохранённый draft или локальный порядок элементов. Не объединяй её с server snapshot в один объект без явной модели
конфликта и синхронизации.

## Context и Provider

Context используй для передачи стабильной dependency или scoped contract по React tree, а не как универсальный mutable
store. Часто обновляемое разделяемое client state помещай в Zustand, а server state оставляй в SWR.

Provider оправдан, когда он создаёт scope, экземпляр store, dependency или lifecycle resource. Не создавай Provider
только ради сокрытия обычного module import.

## Existing state manager

- Не добавляй Zustand параллельно Redux, MobX или другому принятому state manager в рамках локальной задачи.
- Для миграции определи ownership boundary и переноси один связный state-сценарий вместе с actions и consumers.
- Не оставляй две writable копии одного state на время неопределённой миграции.
- Если существующая библиотека решает задачу и её использование закреплено проектом, следуй проекту.

## Проверка

- Для состояния определены смысл, владелец, источник истины и область жизни.
- Local state не вынесен во внешний store без необходимости.
- Zustand содержит только client-owned state и не зеркалирует SWR.
- Components выбирают минимальные slices.
- Actions и reset lifecycle принадлежат владельцу store.
- Persistence имеет schema, migration и правила очистки либо не используется.
- Не создан второй state manager без migration boundary.
