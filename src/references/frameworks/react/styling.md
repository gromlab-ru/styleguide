# Styling в React

При возможности выбора предпочитай PostCSS для styles React-приложения.

## Почему PostCSS

PostCSS сохраняет CSS основным языком styles и добавляет недостающие возможности на этапе сборки:

- CSS Modules создают локальную границу имён для component styles;
- nesting уменьшает повторение селектора без перехода на отдельный язык;
- custom media дают именованные breakpoints из одного центрального источника;
- Autoprefixer связывает output с browser targets проекта;
- design tokens остаются стандартными CSS custom properties;
- plugins подключаются по реальной потребности и не добавляют runtime в приложение.

Такой stack сохраняет близость к web platform, но предоставляет необходимую для приложения организацию и
совместимость. PostCSS является build pipeline, а не владельцем styles или design system.

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

CSS Module принадлежит component или другому SLM-владельцу, который определяет его разметку. Global tokens, themes,
reset и media definitions подключаются на application boundary и не копируются в каждый module.

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
