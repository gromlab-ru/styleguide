# Использование SVG sprite

Используй generated public API sprite-модуля в component и standalone bundler modes. Для создания или изменения
sprite используй [`setup.md`](setup.md).

Bare `standalone` и `standalone@server` не создают consumer facade. Для них не применяй инструкции по `index.ts` из
этого документа: загрузи skill `svg-sprites-ru` и используй exact-mode guide.

## Public entry

Создай пользовательский `index.ts` рядом с generated-каталогом:

```ts
export * from './.svg-sprite/index.js'
```

Импортируй component, типы имён и другие exports из корня sprite-модуля. Не импортируй framework component,
manifest или `sprite.svg` по глубокому пути из `.svg-sprite`.

## Generated API

Имя API определяется полем `name` config. Например, `name: "app"` создаёт component `AppIcon`, тип `AppIconName`
и список имён `appIconNames` в component modes.

Имя source-файла без `.svg` становится публичным именем иконки: `search.svg` используется как `search`. Неизвестное
имя должно приводить к TypeScript error. Не собирай fragment URL и внутренний SVG ID из публичного имени вручную.

Синтаксис component или Web Component зависит от exact mode. Используй framework reference и фактические generated
declarations.

## Размеры и цвета

- Управляй размером через props/attributes generated component и CSS consumer-кода.
- Не возвращай фиксированные `width` и `height` в generated SVG.
- Монохромная иконка наследует `currentColor`.
- Для преобразованных многоцветных иконок используй generated variables `--icon-color-N`.
- Связывай размеры и цвета с design tokens проекта.
- Не редактируй `fill` и `stroke` внутри generated sprite.

Generated component по умолчанию принимает стандартные SVG attributes. Точный набор props определяет выбранный mode.

## Доступность

- Декоративную иконку скрывай от accessibility tree.
- Самостоятельной смысловой иконке задавай роль изображения и accessible name.
- Не дублируй имя, если соседний текст уже описывает действие.
- Интерактивность размещай на `button`, `a` или другом подходящем control, а не на SVG-иконке.

Framework-specific атрибуты и синтаксис бери из соответствующего framework reference.

## Сложные SVG

SVG с gradients по умолчанию используй как image asset. Patterns, filters, masks и `url(#...)` добавляй в sprite
только после проверки generated result. Если сложный SVG должен войти в sprite, загрузи skill `svg-sprites-ru`,
проверь transforms и выполни визуальную проверку.

Не копируй source SVG для обхода ограничений. Один файл подключается в нужные sprites через `input`.

## Запрещённые замены

- Не создавай отдельный handwritten component для каждой обычной project-owned SVG-иконки.
- Не вставляй полную SVG geometry inline в component или template.
- Не собирай `<svg><use>` и URL generated asset вручную.
- Не импортируй source SVG напрямую, если он уже входит в sprite.
- Не изменяй `.svg-sprite` вручную.

## Проверка

- Consumer импортирует API из корня sprite-модуля.
- Имя иконки проверяется generated TypeScript type.
- Размеры, цвета и accessibility заданы на стороне consumer.
- Generated paths, IDs и asset URL не собраны вручную.
- Для сложного SVG выполнена отдельная визуальная проверка или выбран image asset.
