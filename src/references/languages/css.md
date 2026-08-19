# CSS

Применяй общие правила этого файла к `.css`, `.scss`, `.sass`, `.less` и style-частям других поддерживаемых проектом форматов. Для CSS Modules дополнительно применяй главу `CSS Modules`.

## Preflight перед изменением стилей

До написания кода:

1. Найди центральное хранилище CSS variables, preprocessor variables и design tokens.
2. Найди breakpoint-шкалу, custom media, media variables или mixins.
3. Проверь CSS pipeline, preprocessor, PostCSS config, nesting и browser targets.
4. Используй существующую систему и не создавай локальные дубли variables или breakpoints.
5. Если центральной системы нет, загрузи [`../tooling/style-environment.md`](../tooling/style-environment.md) и предложи пользователю подготовить её.

Не начинай с добавления новых literal-значений, пока не проверены существующие tokens и media.

## Форматирование

- Используй 2 пробела и одно свойство на строку.
- Между правилами верхнего уровня оставляй одну пустую строку.
- Перед каждым вложенным блоком оставляй одну пустую строку.
- При отсутствии проектного порядка группируй свойства так: positioning, box model, visual, typography, прочее.
- Не меняй порядок свойств во всём файле без отдельной задачи.

```css
.card {
  position: relative;
  display: flex;
  width: 100%;
  padding: var(--space-4);
  border-radius: var(--radius-2);
  background-color: var(--color-bg);
  color: var(--color-text);
}
```

## Именование классов

### CSS Modules

- Корневой селектор CSS Module всегда называй `.root`.
- Обычные локальные классы называй в `camelCase`: `.contentItem`, `.submitButton`.
- Не заменяй `.root` именем компонента, назначением блока или внешним `className`.
- Не смешивай `camelCase`, БЭМ и `kebab-case` в одном CSS Module.
- Не применяй БЭМ к CSS Modules.
- Модификаторы оформляй по общей главе `Модификаторы`.

```css
.root {
  display: flex;
}

.contentItem {
  min-width: 0;
}
```

### CSS с preprocessor или postprocessor

- Классы вне CSS Modules называй в `kebab-case`: `.product-card`, `.submit-button`, `.page-header`.
- Не используй `camelCase` для классов вне CSS Modules.
- Не применяй БЭМ, если изоляцию и вложенность обеспечивает окружение проекта.

```css
.product-card {
  display: grid;
}

.product-card-title {
  font-weight: 600;
}
```

### Чистый CSS без преобразования

Для глобального CSS без preprocessor и postprocessor используй БЭМ для блоков и элементов:

- блок: `.product-card`;
- элемент: `.product-card__title`;
- блоки, элементы и составные части имени пиши в `kebab-case`;
- не используй БЭМ-модификаторы `--modifier` или `_modifier` как часть имени блока или элемента.

```css
.product-card {
  display: grid;
}

.product-card__title {
  font-weight: 600;
}
```

### Модификаторы

Этот паттерн применяется ко всему CSS независимо от наличия modules, preprocessor или postprocessor.

- Модификатор оформляй отдельным коротким классом с `_`: `._active`, `._disabled`, `._red`, `._blue`.
- Всегда применяй модификатор вместе с базовым классом. Модификатор не является самостоятельной сущностью.
- Не кодируй модификатор в имени базового класса: не используй `.button--red`, `.button_red` или `.product-card--active`.
- Если nesting поддерживается, описывай модификатор через `&._modifier` внутри базового класса.
- Без nesting используй плоский compound selector `.button._modifier`.
- Если вариант описывает самостоятельную сущность, а не состояние базовой, создай отдельный обычный класс.

С nesting:

```css
.button {
  color: var(--color-text);

  &._red {
    color: var(--color-danger);
  }
}
```

Без nesting:

```css
.button {
  color: var(--color-text);
}

.button._red {
  color: var(--color-danger);
}
```

## Селекторы и вложенность

- Не вкладывай селекторы друг в друга без необходимости.
- Вкладывай media queries, псевдоклассы и псевдоэлементы в изменяемый селектор, только если nesting поддерживается окружением проекта.
- Если nesting недоступен и его нельзя подготовить, используй валидную плоскую форму текущей CSS-среды.
- Не создавай каскад из нескольких классов, если элемент можно адресовать одним классом. Compound selector базового класса с модификатором является допустимым исключением.
- Отделяй каждый вложенный блок пустой строкой от свойств и соседних блоков.

```css
.button {
  color: var(--color-text);

  &:hover {
    color: var(--color-primary);
  }

  &::before {
    content: '';
  }

  @media (--md) {
    display: inline-flex;
  }
}
```

## Media queries

### Общий паттерн

- Пиши Mobile First: базовый стиль относится к минимальному viewport, расширения идут вверх через `min-width`.
- Используй именованный breakpoint из центральной шкалы, если окружение проекта позволяет его объявить.
- Размещай media query внутри селектора, который она изменяет, если nesting поддерживается проектом.
- Не повторяй literal breakpoint, если существует соответствующий custom media или preprocessor variable.
- Не используй desktop-first откаты через `max-width`.
- Следуй существующим именам и значениям breakpoints проекта.
- Не добавляй второй способ объявления media рядом с уже используемым.

### Выбор синтаксиса

| Возможности проекта | Паттерн |
| --- | --- |
| Custom Media | `@media (--md)` |
| SCSS с полным условием в variable | `@media ($md)` |
| SCSS с размером в variable | `@media (min-width: $md)` |
| Less | `@media (min-width: @md)` |
| Native CSS с поддержкой nesting | вложенный `@media (min-width: 48rem)` |
| CSS без nesting | верхнеуровневый `@media` с повторением селектора |

Custom Media:

```css
.cardGrid {
  grid-template-columns: 1fr;

  @media (--md) {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

SCSS с полным условием в variable:

```scss
.cardGrid {
  grid-template-columns: 1fr;

  @media ($md) {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

Native CSS с nesting:

```css
.cardGrid {
  grid-template-columns: 1fr;

  @media (min-width: 48rem) {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### Literal breakpoint

Literal breakpoint допустим, только если:

- среда не позволяет подготовить именованные media conditions;
- значение является уникальным порогом одного компонента и не относится к общей шкале.

Для уникального порога оставляй короткий комментарий с причиной. Если значение повторяется или совпадает с общей шкалой, вынеси его в центральную media-систему.

## Tokens

- Повторяемые цвета, spacing, радиусы и смысловые значения используй через CSS variables.
- Одноразовое локальное значение можно оставить в файле владельца.
- Не меняй token-систему в локальной CSS-задаче.
- Не создавай token только ради замены одного литерала.

## Комментарии

- Оформляй CSS-комментарий как `/* Причина. */`.
- Комментируй только неочевидные ограничения, workarounds и причины.
- Не пересказывай очевидные свойства и значения.
- Удаляй устаревший комментарий при изменении поведения.

## CSS Modules

Эта глава применяется к `*.module.css`, `*.module.scss`, `*.module.sass`, `*.module.less` и аналогичным CSS Modules.

### Владение

- CSS Module принадлежит одному компоненту или модулю.
- Не импортируй CSS Module одного владельца в код другого владельца.
- Не выноси локальные классы компонента в global styles.
- Глобальные стили оставляй для tokens, media, reset, typography и themes.
- Если стиль должен переиспользоваться, выноси переиспользуемую UI-сущность или token, а не общий CSS Module.

### Структура селекторов

- `.root` описывает реальный корневой элемент стилизуемой сущности.
- Правила пустого CSS Module для React-компонента без собственного DOM-элемента определяет [`React-компоненты`](../frameworks/react/components.md).
- Не вкладывай классы элементов внутрь `.root`.
- Не используй каскад `.root .title`, если элемент можно адресовать локальным классом `.title`.
- Храни `.root` и классы элементов как отдельные правила верхнего уровня.

```css
.root {
  display: flex;
  color: var(--color-text);
}

.title {
  font-weight: 600;
}
```

## Проверка общего CSS

- Перед правкой найдены и использованы центральные variables, tokens и media.
- Форматирование и порядок свойств соответствуют правилам проекта.
- Все классы вне CSS Modules используют `kebab-case`.
- Для чистого глобального CSS без processors блоки и элементы названы по БЭМ.
- Модификаторы во всех форматах оформлены отдельными классами `._modifier` и применяются вместе с базовым классом.
- Вложенность ограничена необходимыми конструкциями.
- Media queries следуют Mobile First, общей breakpoint-шкале и синтаксису текущего окружения.
- Media query находится рядом с изменяемым селектором, если nesting поддерживается.
- Повторяемые смысловые значения используют tokens.
- Комментарии объясняют причину, а не пересказывают CSS.

## Проверка CSS Modules

Для CSS Modules дополнительно проверь:

- CSS Module принадлежит одному владельцу и не импортируется между владельцами.
- Корневой селектор называется `.root`.
- Локальные классы используют `camelCase`, а не `kebab-case` или БЭМ.
- Классы элементов не вложены в `.root` и не адресуются через лишний каскад.
