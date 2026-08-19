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
5. Добавь карту React-раздела, если задача относится к React, и выбери профильные React-референсы.
6. Перед работой со стилями найди центральные variables, tokens и media; если системы нет, добавь tooling-референс и предложи её подготовить.
7. Добавь SLM Design для архитектурного решения; после него добавь SLM structure, если требуется физическое размещение единиц.
8. После изменения выполни чеклисты каждого выбранного документа и доступные проверки проекта.

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

### Frameworks

| Референс | Загружать |
| --- | --- |
| [`references/frameworks/react/README.md`](references/frameworks/react/README.md) | Для любой React-задачи. Карта components, styling, state management, REST, realtime, icons и примеров |
| [`references/frameworks/react/components.md`](references/frameworks/react/components.md) | Дополнительно при создании, изменении или ревью React-компонента, Provider, Guard или Error Boundary |

JSX/TSX-референс описывает разметку и не заменяет React-референс. Для React-компонента обычно нужны оба.

### Tooling стилей

| Референс | Загружать |
| --- | --- |
| [`references/tooling/style-environment.md`](references/tooling/style-environment.md) | При создании style-окружения или когда не найдены центральные variables, именованные media либо поддержка nesting. Описывает PostCSS, preprocessors, native CSS и проверки сборки |

При обычной правке используй готовое окружение проекта. Если системы нет, сначала предложи пользователю её структуру и изменения tooling, затем настраивай после согласования.

### Архитектура

| Референс | Загружать | Не использовать для |
| --- | --- | --- |
| [`references/architecture/slm-design.md`](references/architecture/slm-design.md) | Выбор владельца, слоя, module boundary, public API и зависимостей по SLM Design | Языкового code style и API framework-библиотек |
| [`references/architecture/slm-structure.md`](references/architecture/slm-structure.md) | Когда нужно физически разместить уже спроектированные SLM-компоненты, Providers, Guards, Error Boundaries или вложенные модули | Выбора владельца, слоя, границы модуля или public API |

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
| Физическая структура SLM | `architecture/slm-structure.md` + референсы изменяемых файлов |

Если изменение React-компонента затрагивает CSS Module, добавь `languages/css.md`.

## Поддерживающий материал TypeScript

[`references/languages/typescript/value-predicates/README.md`](references/languages/typescript/value-predicates/README.md) описывает готовую библиотеку runtime predicates. Загружай и используй её только когда `languages/typescript.md` требует `shared/lib/value-predicates`, а эквивалентной библиотеки в проекте нет.

## Общая финальная проверка

- Выполнены formatter, linter, typecheck и релевантные тесты, предусмотренные проектом.
- Для изменений style-окружения выполнена реальная сборка CSS текущим pipeline.
- Diff не содержит случайного форматирования и архитектурных изменений вне задачи.
- Пройдены чеклисты всех выбранных референсов.
