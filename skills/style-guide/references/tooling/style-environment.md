# Окружение для стилей

Загружай этот референс при создании style-окружения или когда перед CSS-задачей не найдены центральные design tokens, именованные breakpoints либо поддержка nesting.

Не создавай вторую систему рядом с существующей. В готовом проекте сначала соблюдай его обязательные инструкции и режим применения style guide.

## Исследование проекта

Перед предложением изменений найди:

- `variables.css`, `tokens.css`, `theme.css`, `media.css` и аналоги;
- `_variables.scss`, `_media.scss`, `_breakpoints.scss` и аналоги других препроцессоров;
- объявления `:root`, theme-селекторы, `@custom-media` и переменные препроцессора;
- PostCSS-конфигурацию и порядок plugins;
- настройки Sass, Less, Stylus и глобально подключаемых данных;
- browser targets, Browserslist и поддержку native CSS nesting;
- существующие шкалы цветов, spacing, typography, размеров и breakpoints.

Если система уже существует, используй её имена, значения, расположение и способ подключения. Не добавляй параллельные `variables` или `media`.

## Предложение изменений

Если центральной системы нет, до изменения dependencies или build-конфигурации предложи пользователю:

- место хранения variables и media;
- выбранный механизм для текущего стека;
- файлы и конфигурацию, которые потребуется добавить или изменить;
- область миграции: новый и затронутый код, без переписывания всего проекта;
- команды проверки после настройки.

После согласования подготовь окружение полностью: добавь необходимые зависимости, конфигурацию, глобальное подключение и исходные файлы, затем проверь реальную сборку стилей.

## Design tokens

Цвета, spacing, typography, радиусы и другие повторяемые смысловые значения храни централизованно.

Для чистого CSS используй CSS custom properties. Препроцессор или PostCSS для них не обязателен:

```css
:root {
  --color-text: #212124;
  --space-4: 1rem;
  --radius-2: 0.5rem;
}
```

По умолчанию предложи `src/shared/styles/variables.css`, но адаптируй путь к архитектуре проекта. Убедись, что файл подключён один раз на глобальной точке входа.

- Не переноси в tokens одноразовое локальное значение.
- Не создавай новый token с тем же смыслом под другим именем.
- Не меняй существующие значения design tokens в локальной style-задаче.
- Не экспортируй CSS custom properties через CSS Modules без требования проекта.

## Breakpoints

Media conditions нельзя хранить в обычных CSS custom properties: `var()` не работает в условии `@media`. Используй механизм, доступный текущему стеку.

При наличии существующей breakpoint-шкалы сохраняй её значения. Для нового проекта без шкалы можно предложить базовый Mobile First набор:

| Имя | Условие |
| --- | --- |
| `xs` | `max-width: 35.9375rem` |
| `sm` | `min-width: 36rem` |
| `md` | `min-width: 48rem` |
| `lg` | `min-width: 62rem` |
| `xl` | `min-width: 75rem` |
| `2xl` | `min-width: 88rem` |
| `3xl` | `min-width: 120rem` |

Не создавай весь набор автоматически, если проекту нужны другие точки или названия. Сначала сопоставь шкалу с layouts и существующим дизайном.

## PostCSS

Если проект использует PostCSS, но не предоставляет named media и nesting, предложи добавить global data, custom media и nesting plugins. Проверяй актуальные имена и API пакетов для версии проекта перед установкой.

Рекомендуемое хранилище:

```text
src/shared/styles/media.css
```

```css
@custom-media --xs (max-width: 35.9375rem);
@custom-media --sm (min-width: 36rem);
@custom-media --md (min-width: 48rem);
@custom-media --lg (min-width: 62rem);
@custom-media --xl (min-width: 75rem);
@custom-media --2xl (min-width: 88rem);
@custom-media --3xl (min-width: 120rem);
```

Пример конфигурации для стека с соответствующими plugins:

```js
export default {
  plugins: {
    '@csstools/postcss-global-data': {
      files: ['src/shared/styles/media.css']
    },
    'postcss-custom-media': {},
    'postcss-nesting': {},
    autoprefixer: {}
  }
}
```

- Сохраняй существующий формат PostCSS config: object, array, CommonJS или ESM.
- Не добавляй второй plugin, если custom media или nesting уже обеспечивает другой preset.
- Global data должен быть доступен до преобразования custom media.
- После сборки в поддерживаемом target-коде не должны оставаться необработанные custom media, если браузеры проекта не поддерживают их нативно.

## Sass и SCSS

Создай центральный `_media.scss` или используй существующий variables-файл проекта. Для нового кода предпочитай `@use`; не мигрируй существующие `@import` в рамках локальной задачи.

Если переменная хранит полное условие:

```scss
$md: 'min-width: 48rem';

.card {
  @media ($md) {
    display: grid;
  }
}
```

Если переменная хранит только размер:

```scss
$md: 48rem;

.card {
  @media (min-width: $md) {
    display: grid;
  }
}
```

Следуй форме, уже принятой проектом. Не смешивай full-condition и dimension variables в одной breakpoint-шкале.

## Less и другие препроцессоры

Создай центральный файл variables в принятом проектом месте и используй синтаксис текущего препроцессора.

```less
@md: 48rem;

.card {
  @media (min-width: @md) {
    display: grid;
  }
}
```

Для Stylus или другого препроцессора используй его variables или существующий media mixin. Не вводи mixin, если именованной переменной достаточно.

## Native CSS

Используй native `@custom-media` только после проверки поддержки всеми browser targets проекта. Не считай наличие синтаксиса в спецификации достаточным подтверждением.

Если custom media недоступны, но проект имеет build pipeline, предложи PostCSS. Если нет ни преобразования, ни необходимой browser support, именованные media conditions создать нельзя: сообщи об ограничении и согласуй literal fallback.

Никогда не имитируй breakpoint через CSS custom property:

```css
/* Не работает как media condition. */
@media (min-width: var(--breakpoint-md)) {
}
```

## Nesting

Media query размещается внутри изменяемого селектора, когда nesting обеспечивает:

- Sass, Less, Stylus или другой используемый препроцессор;
- PostCSS nesting plugin или preset;
- native CSS nesting, поддерживаемый всеми browser targets проекта.

Если nesting отсутствует, предложи настроить его вместе с media-системой. Когда подготовить окружение невозможно, используй верхнеуровневый `@media` с повторением селектора и сообщи о fallback.

## Проверка

- Variables и media имеют одно центральное место хранения.
- Новая система не дублирует существующую.
- Variables и media доступны во всех нужных style-файлах.
- Custom media, preprocessor variables и nesting реально компилируются текущей сборкой.
- Итоговый CSS соответствует browser targets проекта.
- Formatter, stylelint, build и релевантные тесты проходят.
- Вне затронутого кода не выполнена массовая миграция styles.
