# Styling в React

При возможности выбора предпочитай PostCSS для styles React-приложения.

## Перед работой

1. Найди и загрузи доступный agent skill для PostCSS и используемых CSS plugins.
2. Проверь существующий style pipeline проекта.
3. Примени CSS preflight из [`languages/css.md`](../../languages/css.md).
4. Если нет центральных variables, media или nesting, используй [`style-environment.md`](../../tooling/style-environment.md).

## Предпочтительный стек

- PostCSS обрабатывает custom media и nesting.
- Central media definitions подключаются как global data.
- Autoprefixer настраивается в соответствии с browser targets проекта.
- Компонентные styles пишутся через CSS Modules.
- Design tokens и media имеют единое центральное место хранения.

## Границы

- Не мигрируй существующий SCSS, Less или другой рабочий pipeline в PostCSS в рамках локальной задачи.
- В новом проекте или при явной задаче на style environment выбирай PostCSS, если stack проекта позволяет его использовать.
- Не добавляй второй nesting или custom-media plugin, если эту возможность уже предоставляет preset.
- Не изменяй build tooling без проверки production-сборки styles.

## Проверка

- Для нового style environment рассмотрен PostCSS как основной вариант.
- Existing pipeline не продублирован параллельной конфигурацией.
- CSS Modules, custom media и nesting проходят реальную сборку.
- Итоговый CSS соответствует browser targets проекта.
