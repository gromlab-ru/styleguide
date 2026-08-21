---
name: style-guide
description: >-
  Используй при создании, изменении, форматировании и ревью frontend-кода:
  JavaScript, TypeScript, React, JSX, TSX, HTML и CSS. Применяет code style,
  SLM Design, PostCSS, Zustand, SWR, useSWRSubscription, REST API Codegen,
  SVG sprites, правила типизации, документации и CSS Modules. Не используй
  для Next.js-specific поведения, backend-кода или tooling вне frontend.
---

# Frontend Style Guide

Этот skill содержит карту референсов. Не загружай все документы: выбери минимальный набор по расширению файлов и характеру изменения.

## Главное правило приоритета

В готовом проекте по умолчанию соблюдай существующий стиль проекта, даже если он противоречит этому style guide. Не приводи существующий код к правилам skill без отдельного основания.

Применяй style guide строго в одном из двух случаев:

- пользователь прямо попросил следовать этому style guide в текущей задаче;
- правила проекта явно требуют следовать этому style guide.

Явное требование проекта может находиться в `AGENTS.md`, `README`, документации, конфигурации агента или других обязательных инструкциях репозитория. В этом случае style guide является частью стиля проекта и применяется ко всему затронутому коду.

Если строгий style guide конфликтует с formatter, linter или другой обязательной автоматической проверкой проекта, не игнорируй конфликт и не меняй конфигурацию самовольно. Сохрани рабочее состояние проекта и сообщи пользователю о несовместимых требованиях.

## Алгоритм выбора

1. Изучи обязательные инструкции репозитория, затронутые файлы, formatter, linter и локальные соглашения.
2. Определи режим: стиль проекта по умолчанию или строгий style guide по явному требованию пользователя либо проекта.
3. Всегда прочитай [`references/code-style.md`](references/code-style.md).
4. Выбери языковые референсы по таблице расширений.
5. Добавь technology reference для REST API client, SWR или SVG sprites, если задача использует соответствующую технологию.
6. Добавь карту React-раздела, если задача относится к React, и выбери профильные React-референсы.
7. Перед работой со стилями найди центральные variables, tokens и media; если системы нет, добавь tooling-референс и предложи её подготовить.
8. Добавь SLM Design для архитектурного решения; после него добавь SLM structure, если требуется физическое размещение единиц.
9. Для доменного сценария добавь domain contracts, expected errors и failure handling до выбора source integration.
10. После изменения выполни чеклисты каждого выбранного документа и доступные проверки проекта.

Не применяй правила по памяти. Если затронуто несколько областей, прочитай все соответствующие файлы.

## Карта документации

### Code style

Всегда загружай [`references/code-style.md`](references/code-style.md): приоритеты правил, базовое форматирование, naming, имена файлов и комментарии.

### Языки

| Референс | Загружать |
| --- | --- |
| [`references/languages/javascript.md`](references/languages/javascript.md) | Для `.js`, `.jsx`, `.ts`, `.tsx`. Общий JavaScript-синтаксис, значения, imports/exports и JSDoc |
| [`references/languages/typescript.md`](references/languages/typescript.md) | Дополнительно для `.ts`, `.tsx`. Типы, type-only imports/exports, narrowing, predicates и TypeScript-документация |
| [`references/languages/jsx-tsx.md`](references/languages/jsx-tsx.md) | Дополнительно для `.jsx`, `.tsx`. Props, conditional rendering, списки, декомпозиция и комментарии в разметке |
| [`references/languages/html.md`](references/languages/html.md) | Для `.html` и HTML-частей шаблонов. Атрибуты, структура, семантика и комментарии |
| [`references/languages/css.md`](references/languages/css.md) | Для `.css`, `.scss`, `.sass`, `.less` и CSS Modules. Правила написания и организации стилей |

TypeScript не заменяет JavaScript-референс: для `.ts` и `.tsx` всегда загружай оба.

### Общие policies

| Референс | Загружать |
| --- | --- |
| [`references/failure-handling.md`](references/failure-handling.md) | Unexpected defects, telemetry, Error Boundary, async handlers и safe fallback |

### Technologies

| Референс | Загружать |
| --- | --- |
| [`references/technologies/README.md`](references/technologies/README.md) | Карта общих frontend-технологий и граница с framework-specific правилами |
| [`references/technologies/rest-api/README.md`](references/technologies/rest-api/README.md) | Создание, настройка или использование REST API client через `@gromlab/rest-api-codegen` |
| [`references/technologies/swr/README.md`](references/technologies/swr/README.md) | REST GET-data, SSR hydration и realtime subscriptions через SWR |
| [`references/technologies/svg-sprites/README.md`](references/technologies/svg-sprites/README.md) | Создание, генерация или использование SVG sprites через `@gromlab/svg-sprites` |

Technology reference определяет общий setup и usage. Для hooks, components и framework lifecycle дополнительно
загружай соответствующий framework reference.

### Frameworks

| Референс | Загружать |
| --- | --- |
| [`references/frameworks/react/README.md`](references/frameworks/react/README.md) | Для любой React-задачи. Карта components, styling, state management, REST/SWR, realtime, SVG icons и примеров |
| [`references/frameworks/react/components.md`](references/frameworks/react/components.md) | Дополнительно при создании, изменении или ревью React-компонента, Provider, Guard или Error Boundary |
| [`references/frameworks/react/state-management.md`](references/frameworks/react/state-management.md) | Дополнительно при выборе, создании или изменении React state, Zustand store, Context либо другого источника состояния |
| [`references/frameworks/react/styling.md`](references/frameworks/react/styling.md) | Дополнительно при выборе или изменении style stack React-приложения |
| [`references/frameworks/react/rest.md`](references/frameworks/react/rest.md) | Дополнительно при выборе между SWR hook и прямой REST API operation в React |
| [`references/frameworks/react/realtime.md`](references/frameworks/react/realtime.md) | Дополнительно при подключении realtime к React lifecycle или синхронизации GET-cache |
| [`references/frameworks/react/icons.md`](references/frameworks/react/icons.md) | Дополнительно при выборе или использовании SVG-иконки в React |

JSX/TSX-референс описывает разметку и не заменяет React-референс. Для React-компонента обычно нужны оба.

### Tooling стилей

| Референс | Загружать |
| --- | --- |
| [`references/tooling/style-environment.md`](references/tooling/style-environment.md) | При создании style-окружения или когда не найдены центральные variables, именованные media либо поддержка nesting. Описывает PostCSS, preprocessors, native CSS и проверки сборки |

При обычной правке используй готовое окружение проекта. Если системы нет, сначала предложи пользователю её структуру и изменения tooling, затем настраивай после согласования.

### Архитектура

| Референс | Загружать | Не использовать для |
| --- | --- | --- |
| [`references/architecture/README.md`](references/architecture/README.md) | Выбор архитектурного профиля и порядок применения командных policies | Правил конкретной архитектуры |
| [`references/architecture/slm-design/README.md`](references/architecture/slm-design/README.md) | Карта решений команды для проекта на SLM | Выбора владельца, слоя, module boundary и зависимостей вместо skill `slm-design` |
| [`references/architecture/slm-design/domains/README.md`](references/architecture/slm-design/domains/README.md) | Обязательная граница product data: consumers используют только public API доменного владельца | Проектирования самого доменного контракта вместо skill `slm-design` |
| [`references/architecture/slm-design/domains/adapters.md`](references/architecture/slm-design/domains/adapters.md) | Internal adapter, mappers и предметные public operations домена | Технических capabilities без доменного владельца |
| [`references/architecture/slm-design/domains/errors.md`](references/architecture/slm-design/domains/errors.md) | Ожидаемые неуспешные исходы, typed domain errors, codes и factories | Неожиданных programming и integration defects |

## Выбор по файлу

| Файл или задача | Минимальный набор после `code-style.md` |
| --- | --- |
| `.js` | `languages/javascript.md` |
| `.ts` | `languages/javascript.md` + `languages/typescript.md` |
| `.jsx` с React-компонентом | `languages/javascript.md` + `languages/jsx-tsx.md` + `frameworks/react/README.md` + `frameworks/react/components.md` |
| `.tsx` с React-компонентом | `languages/javascript.md` + `languages/typescript.md` + `languages/jsx-tsx.md` + `frameworks/react/README.md` + `frameworks/react/components.md` |
| `.html` | `languages/html.md` |
| `.css`, `.scss`, `.sass`, `.less` | `languages/css.md`; при отсутствии variables/media добавить `tooling/style-environment.md` |
| CSS Module | `languages/css.md`, общие главы + `CSS Modules`; при отсутствии variables/media добавить tooling-референс |
| React state или Zustand | `frameworks/react/README.md` + `frameworks/react/state-management.md` + референсы изменяемых файлов |
| REST GET или mutation в React | `frameworks/react/README.md` + `frameworks/react/rest.md` + профильные technology-референсы |
| Realtime в React | `frameworks/react/README.md` + `frameworks/react/realtime.md` + `technologies/swr/subscriptions.md` |
| SVG-иконка в React | `frameworks/react/README.md` + `frameworks/react/icons.md` + `technologies/svg-sprites/usage.md` для project-owned иконки |
| Доменная operation или integration с источником в SLM | Skill `slm-design` + `architecture/slm-design/domains/README.md` + `architecture/slm-design/domains/adapters.md` + `architecture/slm-design/domains/errors.md` + `failure-handling.md` |
| API, SDK, storage или realtime payload с доменным владельцем в SLM | Skill `slm-design` + `architecture/slm-design/domains/README.md` + `architecture/slm-design/domains/adapters.md` + `architecture/slm-design/domains/errors.md` + профильные framework/technology references |
| Ожидаемые доменные ошибки в SLM | Skill `slm-design` + `architecture/slm-design/domains/README.md` + `architecture/slm-design/domains/errors.md` + `failure-handling.md` |
| Unexpected error или defect | `failure-handling.md` + референсы framework/technology boundary |

Если изменение React-компонента затрагивает CSS Module, добавь `languages/css.md`.
Для REST или realtime с доменным владельцем в SLM-проекте дополнительно загружай `architecture/slm-design/domains/README.md`,
`architecture/slm-design/domains/adapters.md`, `architecture/slm-design/domains/errors.md` и `failure-handling.md`.

## Поддерживающий материал TypeScript

[`references/languages/typescript/value-predicates/README.md`](references/languages/typescript/value-predicates/README.md) описывает готовую библиотеку runtime predicates. Загружай и используй её только когда `languages/typescript.md` требует `shared/lib/value-predicates`, а эквивалентной библиотеки в проекте нет.

## Общая финальная проверка

- Выполнены formatter, linter, typecheck и релевантные тесты, предусмотренные проектом.
- Для изменений style-окружения выполнена реальная сборка CSS текущим pipeline.
- Diff не содержит случайного форматирования и архитектурных изменений вне задачи.
- Пройдены чеклисты всех выбранных референсов.
