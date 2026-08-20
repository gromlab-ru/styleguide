# React

Этот раздел описывает согласованную модель разработки React-приложения: как определить владельца поведения, выбрать
источник истины состояния и соединить React с REST, realtime, styles и SVG-иконками.

React и библиотеки не заменяют архитектурное решение. Сначала определи ответственность и её владельца, затем выбирай
framework-механизм и технологию реализации.

## Приоритет существующего проекта

- В готовом проекте существующая архитектура и stack имеют приоритет, пока пользователь или правила проекта явно не
  требуют этот style guide.
- Не добавляй preferred library параллельно существующему аналогу без решения о migration boundary.
- Для нового проекта, нового изолированного integration или строгого режима используй preferred stack этого раздела.
- Массовую миграцию архитектуры, state manager, data layer, styles или icons выполняй только отдельной задачей.

## Модель принятия решений

Работай от смысла к механизму:

```text
Ответственность и ожидаемый результат
→ владелец и публичная граница по SLM Design
→ источник истины состояния
→ React lifecycle и способ потребления
→ конкретная технология
```

1. Сформулируй результат или поведение без названий компонентов, hooks и библиотек.
2. По SLM Design определи единственного владельца, слой, публичный API и область жизни ресурсов.
3. Классифицируй состояние как local UI, shared client, REST server state или realtime state.
4. Выбери React state, Zustand или SWR по смыслу состояния, а не по удобству доступа.
5. Подключи готовый transport или generated API через профильный React integration.
6. Размести components, hooks, stores и services внутри границы владельца.

Component, hook, Provider, Zustand store и SWR hook являются механизмами реализации. Они не становятся
архитектурными владельцами только из-за своей технической роли.

## Почему выбран этот stack

| Решение | Почему используем | Что получаем | За что не отвечает |
| --- | --- | --- | --- |
| [SLM Design](../../architecture/slm-design.md) | Архитектура должна строиться вокруг ответственности, а не вокруг папок и framework-ролей | Единственного владельца, закрытую реализацию, предсказуемый радиус изменений и проверяемый граф зависимостей | React API и выбор библиотек |
| [REST API Codegen](../../technologies/rest-api/README.md) | HTTP-контракт не должен вручную повторяться в components и hooks | Типизированные operations, единый API client и централизованную transport policy | React lifecycle и remote cache |
| [SWR для GET](../../technologies/swr/get-data.md) | Server state для render не должен вручную загружаться через `useEffect` и копироваться в client store | Общий cache, дедупликацию, единые request states и revalidation | Изменяющие REST-запросы и HTTP transport |
| [`useSWRSubscription`](../../technologies/swr/subscriptions.md) | React consumer обычно нужен последний актуальный realtime snapshot или сигнал для обновления GET-cache | Shared subscription по key, cleanup после последнего consumer и синхронизацию server state | Socket connection, commands, queue и event log |
| [Zustand](state-management.md#zustand) | Разделяемому client-only state нужен простой владелец без превращения его в remote cache | Typed actions, точечные selectors и независимый от component tree доступ | REST cache и канонический realtime server state |
| [PostCSS](styling.md) | Хотим писать стандартный CSS и добавлять недостающие возможности на этапе сборки | CSS Modules, nesting, custom media, Autoprefixer и централизованные design tokens | Архитектуру components и сами design tokens |
| [SVG sprites](../../technologies/svg-sprites/README.md) | Обычные небиблиотечные SVG-иконки не должны размножать handwritten components и SVG geometry в JavaScript | Внешний cacheable asset, типизированные имена и generated React component | Иконки готовой UI-библиотеки и сложные illustrations |

Эти решения дополняют друг друга. SLM определяет владельцев, REST API Codegen и socket SDK предоставляют transport,
SWR связывает server data с React lifecycle, Zustand хранит client-only state, а PostCSS и SVG sprites обслуживают
визуальную реализацию.

## Источник истины состояния

Не выбирай state manager по размеру данных или числу consumers. Сначала определи смысл состояния, владельца и область
жизни. Отделяй авторитетный источник данных от механизма, который предоставляет их React.

| Вид состояния | Авторитетный источник | Представление в React |
| --- | --- | --- |
| Local UI state одного component subtree | Component owner | React state или reducer |
| Разделяемое client-only state | Client module owner | Zustand store владельца |
| REST GET server state для render | Server | Клиентская проекция в SWR cache |
| Последнее transient realtime-значение | Realtime protocol или transport | Latest value в `useSWRSubscription` |
| REST state, обновляемый realtime-событиями | Server | SWR GET-cache + явный subscription sync |
| Socket connection, auth, reconnect и heartbeat | Transport manager или SDK | Его публичный React contract при необходимости |
| Результат `POST`, `PUT`, `PATCH` или `DELETE` | Server | Revalidation или обновление связанных SWR GET keys |

Не копируй SWR data в React state, Context или Zustand. Копия создаёт второй источник истины, требует ручной
синхронизации и может показывать устаревшие данные.

Подробные критерии выбора и правила Zustand находятся в [`state-management.md`](state-management.md).

## Потоки данных

### GET для render

```text
React component
→ специализированный SWR hook владельца
→ domain adapter или generated API client
→ HttpClient
→ REST API
```

SWR управляет cache и request lifecycle. API client сохраняет типизированный wire contract и использует общий
transport. Если потребителю нужен доменный контракт, source DTO и errors адаптирует domain adapter до записи в cache.

### Изменение server state

```text
Event handler или action владельца
→ domain adapter или generated API client для данных без доменного владельца
→ HttpClient
→ REST API
→ revalidation или адресное обновление SWR GET-cache
```

Изменяющий запрос не становится GET-cache operation. Его lifecycle принадлежит сценарию, который инициировал
изменение, а SWR после успеха синхронизирует связанные чтения. Если данные принадлежат домену, action вызывает domain
adapter и не обходит его прямым generated API request.

### Realtime

```text
Socket manager или SDK
→ useSWRSubscription
→ snapshot / delta / invalidation
→ SWR GET-cache как клиентская проекция или самостоятельное latest value
→ React component
```

SWR управляет listener lifecycle, но не создаёт и не закрывает shared connection. Если важна обязательная обработка
каждого события, replay, backpressure или offline queue, используй специализированный event mechanism вместо
latest-value subscription.

## Выбор SVG-иконки

Не переносите внешний библиотечный набор в project-owned sprite. Библиотека уже владеет визуальным контрактом своих
иконок, обновлениями и исправлениями.

| Источник изображения | Решение |
| --- | --- |
| Иконка предоставлена используемой UI или icon library | Использовать публичный component библиотеки |
| Обычная небиблиотечная SVG-иконка проекта | Добавить в `@gromlab/svg-sprites` |
| Иконка уже входит в project-owned sprite | Использовать generated React component |
| Illustration или SVG с gradients, masks и filters | Рассмотреть image asset или выполнить отдельную проверку sprite |

Не создавай handwritten React wrapper и не вставляй inline geometry для каждой обычной project-owned иконки.
React-specific правила находятся в [`icons.md`](icons.md).

## Карта раздела

| Референс | Когда загружать |
| --- | --- |
| [`components.md`](components.md) | Создание, изменение или ревью React-компонента, Provider, Guard или Error Boundary |
| [`state-management.md`](state-management.md) | Выбор между React state, Zustand, SWR и subscription state |
| [`styling.md`](styling.md) | Выбор и подготовка style stack React-приложения |
| [`rest.md`](rest.md) | Выбор между SWR hook и прямой REST API operation в React |
| [`realtime.md`](realtime.md) | Подключение realtime к React lifecycle и синхронизация GET-cache |
| [`icons.md`](icons.md) | Выбор и использование SVG-иконки в React |

Перед React-задачей также загрузи языковые референсы:

- `.jsx`: JavaScript и JSX/TSX;
- `.tsx`: JavaScript, TypeScript и JSX/TSX;
- CSS Module: CSS.

## Agent skills

Профильный reference определяет выбор и integration boundary. Для подробного API и setup загружай соответствующий
agent skill, если он доступен:

- `slm-design` для владельцев, слоёв, public API и зависимостей;
- `rest-api-codegen-ru` для generation, transport, auth и API client;
- `svg-sprites-ru` для exact mode, config, generated contract и диагностики;
- профильные skills PostCSS и Zustand при изменении их setup или использовании расширенного API.

Не угадывай API библиотеки и generated-кода. Если skill недоступен, используй официальную документацию и фактические
exports установленной версии.

## Примеры

```text
examples/
├── components/
│   └── user-status/
├── domains/
│   └── pet/
└── stores/
    └── zustand/
```

| Пример | Назначение |
| --- | --- |
| [`components/user-status/`](examples/components/user-status/README.md) | Полный набор файлов визуального React-компонента |
| [`domains/pet/`](examples/domains/pet/README.md) | Domain adapter, typed errors, DTO mapping, SWR hook и defect boundary |
| [`stores/zustand/`](examples/stores/zustand/README.md) | Typed Zustand store и выбор минимального slice |

Новую категорию добавляй только вместе с первым примером. Не создавай пустые каталоги заранее.

## Проверка решения

- Ответственность, владелец и public API определены до выбора framework-механизма.
- Для каждого состояния выбран один источник истины.
- REST transport, remote cache и client-only state не смешаны.
- Долгоживущие subscriptions и Providers имеют явного lifecycle owner.
- Project-owned и библиотечные иконки не смешаны в одном ownership contract.
- Existing stack не продублирован preferred libraries без migration boundary.
- Загружены профильные references изменяемых областей.
