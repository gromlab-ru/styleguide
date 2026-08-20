# React

Этот раздел определяет preferred stack и карту React-specific правил. Общие setup и usage выбранных технологий
находятся в [`technologies`](../../technologies/README.md), подробные API — в профильных agent skills.

Перед React-задачей также загрузи языковые референсы:

- `.jsx`: JavaScript и JSX/TSX;
- `.tsx`: JavaScript, TypeScript и JSX/TSX.

## Agent skills

Перед использованием библиотеки:

1. Загрузи профильный референс этого React-раздела и проверь локальные examples.
2. Если референс требует agent skill или локальный пример не покрывает задачу, найди skill по имени технологии.
3. После загрузки считай профильный skill основным источником расширенных API и setup-инструкций.
4. Если skill недоступен, следуй правилу fallback из профильного референса.
5. Не угадывай API библиотеки и generated-кода.

Ожидаемые skills: `slm-design`, PostCSS, `zustand`, `rest-api-codegen-ru`, `svg-sprites-ru`.

## Preferred stack

| Задача | Предпочтительное решение | Референс |
| --- | --- | --- |
| Архитектура | SLM Design | [`architecture/slm-design.md`](../../architecture/slm-design.md) |
| Styling | PostCSS | [`styling.md`](styling.md) |
| Локальное состояние компонента | React state | [`state-management.md`](state-management.md) |
| Shared client state | Zustand | [`state-management.md`](state-management.md) |
| REST client | REST API Codegen | [`technologies/rest-api`](../../technologies/rest-api/README.md) |
| Remote data и cache | SWR | [`technologies/swr`](../../technologies/swr/README.md) |
| Realtime и subscriptions | `useSWRSubscription` | [`technologies/swr/subscriptions`](../../technologies/swr/subscriptions.md) |
| SVG sprites | `@gromlab/svg-sprites` | [`technologies/svg-sprites`](../../technologies/svg-sprites/README.md) |
| SVG-иконки в React | Generated React component | [`icons.md`](icons.md) |

## Карта раздела

| Референс | Когда загружать |
| --- | --- |
| [`components.md`](components.md) | Создание, изменение или ревью React-компонента, Provider, Guard или Error Boundary |
| [`styling.md`](styling.md) | Выбор и подготовка style stack React-приложения |
| [`state-management.md`](state-management.md) | Выбор между React state, Zustand, SWR и subscription state |
| [`rest/README.md`](rest/README.md) | Выбор между SWR hook и прямой REST API operation в React |
| [`icons.md`](icons.md) | Использование generated SVG sprite component в React |

## Примеры

Группируй примеры по типу React-сущности или integration. Не размещай пример непосредственно в `examples/`.

```text
examples/
├── components/
│   └── user-status/
└── stores/
    └── zustand/
```

| Пример | Назначение |
| --- | --- |
| [`components/user-status/`](examples/components/user-status/README.md) | Полный набор файлов React-компонента |
| [`stores/zustand/`](examples/stores/zustand/README.md) | Typed Zustand store и selectors |

Новую категорию добавляй только вместе с первым примером. Не создавай пустые каталоги заранее.

## Приоритет проекта

- В готовом проекте существующий stack имеет приоритет, пока пользователь или правила проекта явно не требуют style guide.
- Не добавляй preferred library параллельно существующему аналогу без решения о migration boundary.
- Для нового проекта, нового изолированного integration или строгого режима используй preferred stack этого раздела.
- Массовую миграцию архитектуры, state manager, data layer, styles или icons выполняй только отдельной задачей.

## Границы

- JavaScript, TypeScript, JSX/TSX и CSS продолжают действовать внутри React-кода.
- SLM Design определяет владельцев, слои, module boundaries и public API.
- Library choice не определяет архитектурного владельца.
- Не дублируй подробную документацию профильного agent skill в этом разделе.
