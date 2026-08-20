# SVG-иконки в React

Для project-owned SVG используй технологию [`SVG sprites`](../../technologies/svg-sprites/README.md). Этот документ
добавляет только React-specific правила использования generated component.

## Перед работой

1. Найди существующий sprite и его public entry по [`SVG sprite usage`](../../technologies/svg-sprites/usage.md).
2. Если sprite отсутствует или требует regeneration, используй [`SVG sprite setup`](../../technologies/svg-sprites/setup.md).
3. Проверь фактическое имя и props generated React component.
4. Не создавай handwritten React component для SVG, которая должна входить в sprite.

## Generated component

Импортируй React component из корня sprite-модуля:

```tsx
import { AppIcon } from 'infra/app-icons'

<AppIcon
  icon="search"
  width={24}
  height={24}
  aria-hidden="true"
/>
```

Поле `name: "app"` в sprite config создаёт `AppIcon`, а `search.svg` становится типизированным значением
`icon="search"`. Используй фактические generated exports и не импортируй component из `.svg-sprite` по глубокому
пути.

Не собирай `<svg><use>`, fragment ID и URL sprite вручную. Generated component самостоятельно связывает имя иконки с
asset и `viewBox`.

## Размеры

- Передавай базовые `width` и `height` component в месте render.
- Responsive и state-dependent размеры меняй через `className` в CSS Module.
- Не возвращай фиксированные размеры в source или generated SVG.
- Не используй inline `style` как основной способ управления layout.

```tsx
<AppIcon
  icon="search"
  width={24}
  height={24}
  className={styles.searchIcon}
  aria-hidden="true"
/>
```

```css
.searchIcon {
  width: 24px;
  height: 24px;

  @media (--md) {
    width: 32px;
    height: 32px;
  }
}
```

## Цвета

Монохромная иконка наследует `currentColor`. Для многоцветной иконки задавай generated `--icon-color-N` через CSS
Module и связывай значения с design tokens:

```css
.statusIcon {
  --icon-color-1: var(--color-status-default);
  --icon-color-2: var(--color-status-accent);
}
```

Не меняй generated `fill` и `stroke`, не задавай `--icon-color-N` через inline `style` и не используй prop `color`
как основной способ тематизации.

## Доступность

- Декоративной иконке передавай `aria-hidden="true"`.
- Самостоятельной смысловой иконке передавай `role="img"` и `aria-label`.
- Не дублируй accessible name, если соседний текст уже описывает действие.
- Интерактивность размещай на `button` или `a`, а не на `AppIcon`.

## Проверка

- Иконка импортирована через public entry sprite-модуля.
- `icon` является generated типизированным именем.
- Размеры и цвета настроены через props и CSS Module.
- Accessibility соответствует смыслу иконки.
- В компоненте нет inline SVG geometry и ручного `<svg><use>`.
- Для сложного SVG выполнена проверка по [`SVG sprite usage`](../../technologies/svg-sprites/usage.md#сложные-svg).
