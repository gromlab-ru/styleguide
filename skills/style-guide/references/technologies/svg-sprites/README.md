# SVG sprites

Для project-owned SVG-иконок используй `@gromlab/svg-sprites`. Generator собирает исходные SVG в mode-specific
sprite assets. Component modes и standalone bundler modes также создают типизированный public API.

## Зачем использовать sprite

- SVG geometry остаётся во внешнем cacheable asset и не увеличивает JavaScript chunks.
- В modes с public facade generated API ограничивает имя иконки точным TypeScript union.
- Один source SVG можно включить в несколько sprites через `input` без копирования файла.
- Несколько sprites позволяют независимо загружать разные наборы иконок.
- Production runtime generated-модулей не зависит от package генератора.

Bare `standalone` и `standalone@server` создают assets и JSON manifest без consumer facade и TypeScript union. Их
использование определяется exact-mode guide из skill `svg-sprites-ru`.

Sprite имеет приоритет перед direct import, inline SVG, ручным `<svg><use>` и handwritten framework-компонентом для
каждой обычной иконки.

## Порядок работы

1. Найди существующий sprite config, source SVG и generated public entry.
2. Если sprite отсутствует или меняется его состав, используй [`setup.md`](setup.md).
3. Для отображения готовой иконки используй [`usage.md`](usage.md).
4. Добавь framework reference для JSX, template syntax и framework-specific accessibility.
5. Если изменились source SVG или config, выполни sprite generation.
6. Выполни typecheck и минимальную проверку приложения, затронутую изменением.

## Выбор документа

| Задача | Референс |
| --- | --- |
| Создать или настроить sprite | [`setup.md`](setup.md) |
| Выбрать framework/bundler mode | [`setup.md`](setup.md#exact-mode) |
| Подключить source SVG | [`setup.md`](setup.md#input) |
| Изучить generated output | [`setup.md`](setup.md#generated-каталог) |
| Импортировать generated API | [`usage.md`](usage.md#public-entry) |
| Настроить размеры и цвета | [`usage.md`](usage.md#размеры-и-цвета) |
| Обработать сложный SVG | [`usage.md`](usage.md#сложные-svg) |

## Agent skill

Перед созданием или изменением sprite загрузи agent skill `svg-sprites-ru`. Он определяет exact modes, config API,
generated contracts, remote sprites, Viewer и диагностику.

Не восстанавливай mode-specific setup по памяти и не переноси snippets между bundlers. Для обычного использования
уже generated component достаточно [`usage.md`](usage.md) и фактических exports sprite-модуля.

## Проверка

- Project-owned SVG подключены через sprite, если для них не выбрано обоснованное исключение.
- Exact mode соответствует фактическому framework и bundler.
- Исходники и ручной public entry находятся вне generated-каталога.
- Consumer импортирует generated API через public entry sprite-модуля.
