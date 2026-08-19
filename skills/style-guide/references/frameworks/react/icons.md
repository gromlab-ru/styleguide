# Векторные иконки в React

Для project-owned SVG без gradients используй [`@gromlab/svg-sprites`](https://github.com/gromlab-ru/svg-sprites). Готовый setup для React + Vite находится в [`examples/icons/svg-sprites/`](examples/icons/svg-sprites/README.md).

## Зачем использовать sprite

- SVG geometry остаётся во внешнем cacheable asset и не увеличивает JavaScript chunks.
- Один generated typed component обслуживает весь набор и проверяет prop `icon` через TypeScript.
- Sprite кэшируется независимо от обновлений React-кода.
- Один source SVG можно включить в несколько sprites через `input` без копирования файла.
- Несколько sprites позволяют разделять наборы по областям приложения.
- Production runtime не зависит от package генератора; package нужен только для generation, Viewer и advanced API.

Базовая цена внедрения: config, generation script и generated local API.

## Приоритет sprite

- Если SVG-файл иконки без gradient уже находится в проекте, включи его в подходящий sprite.
- Sprite имеет приоритет перед direct import, inline SVG и отдельным handwritten React-компонентом.
- SVG с gradients не включай в sprite: используй его как обычный image asset.
- Не копируй source SVG между sprites: подключай существующий файл через `input`.
- Не копируй иконку из установленной package icon library в project sprite без отдельной причины.
- Не редактируй `.svg-sprite`, generated component, manifest и types вручную.

## Базовый workflow

1. Config определяет exact mode, имя sprite и `input` существующих SVG.
2. Generator создаёт `.svg-sprite`, внешний asset, manifest, types и React component.
3. Пользовательский `index.ts` экспортирует generated public API.
4. Приложение импортирует component из корня sprite-модуля.

```ts
// src/infra/app-icons/index.ts
export * from './.svg-sprite'
```

```tsx
import { AppIcon } from 'infra/app-icons'

<AppIcon icon="search" width={24} height={24} aria-hidden="true" />
```

- `name: "app"` создаёт component `AppIcon`.
- `search.svg` становится типизированным значением `icon="search"`.
- Не импортируй component из внутренних файлов `.svg-sprite`.
- Не собирай URL, fragment ID и `<svg><use>` вручную для обычной иконки.

## Размеры

Generator удаляет фиксированные `width` и `height` из SVG внутри sprite, чтобы иконка могла масштабироваться.

- Задавай базовые `width` и `height` только consumer-компоненту в месте React-render.
- Сохраняй базовые props для первичного рендера, обычно `24 × 24`.
- Responsive и state-dependent размеры меняй через `className` в CSS Module.
- Не меняй размер через inline `style` и не возвращай фиксированные размеры в source или generated SVG.

## Цвета

Generator автоматически преобразует поддерживаемые `fill` и `stroke`:

- один цвет становится `var(--icon-color-1, currentColor)`;
- несколько цветов становятся `--icon-color-N` с исходными цветами в fallback.

Монохромная иконка наследует `currentColor`, а многоцветная сохраняет исходный вид. Вручную удалять цвета из source SVG не нужно.

- Явные цвета задавай через `--icon-color-N` в CSS Module.
- Значения variables связывай с design tokens проекта.
- Themes и states оформляй classes и modifier-классами.
- Не используй inline `style` и prop `color` как основной способ тематизации.

```tsx
<AppIcon
  icon="user"
  width={24}
  height={24}
  className={styles.userIcon}
  aria-hidden="true"
/>
```

```css
.root {
  display: flex;
}

.userIcon {
  --icon-color-1: var(--color-icon-primary);
  --icon-color-2: var(--color-icon-secondary);
}
```

## Доступность

- Декоративной иконке передавай `aria-hidden="true"`.
- Самостоятельной смысловой иконке передавай `role="img"` и `aria-label`.
- Не дублируй accessible name, если соседний текст уже описывает действие.
- Интерактивность размещай на `button` или `a`, а не на иконке.

## Иконки с gradients

Если SVG-иконка содержит gradient, не включай её в sprite и используй как обычное изображение.

## Preview

В проекте со sprites должна быть внутренняя preview/debug page через SpriteViewer.

- Для React + Vite используй Viewer из [готового примера](examples/icons/svg-sprites/README.md).
- Preview подключает используемые sprites и не входит в пользовательский production UI.
- Не создавай собственную gallery вместо SpriteViewer.

## Когда загружать agent skill

Локального примера достаточно для базового React + Vite setup и использования.

Загрузи `svg-sprites` или `svg-sprites-ru` для другого framework, bundler или exact mode, нескольких/remote sprites, transforms, unsafe IDs, migration и troubleshooting.

Если нужной дополнительной информации нет и skill недоступен, предложи установить:

```bash
npx skills add gromlab-ru/svg-sprites --skill svg-sprites-ru
```

Объясни, что skill содержит mode-specific setup, generated contracts, Viewer, migration и диагностику. При отказе используй официальную документацию.

## Проверка

- Project-owned SVG включены в sprite и не импортируются напрямую.
- Обычные иконки используют generated typed component.
- Базовые размеры заданы consumer-компоненту, изменения размера находятся в CSS Module.
- Цвета задаются через `--icon-color-N` и design tokens.
- SVG с gradients не входят в sprite и используются через `<img>` с импортированным asset URL.
- Generated-файлы не изменены вручную.
- Generation встроена в development и production build.
- SpriteViewer доступен на внутренней preview page.
