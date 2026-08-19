# SVG-спрайт для React на Vite

Инструкция по быстрому созданию SVG-спрайта в React-приложении на Vite.

## Генерация спрайта

Выберите каталог для будущего SVG-спрайта, например `src/infra/app-icons`, и создайте в нём `svg-sprite.config.json`. В `input` укажите путь к существующим SVG относительно файла конфигурации. Перемещать или копировать иконки не требуется.

Пример конфига:

```json
{
  "mode": "react@vite",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

Каталог `svg-icons` не должен содержать SVG с gradients. Такие файлы храните отдельно как обычные image assets.

Пакет не нужно добавлять в зависимости проекта: генерация запускается через `npx`.

Добавьте команды генерации в `package.json`. Сгенерированные файлы по умолчанию исключены из Git, поэтому `predev` и `prebuild` пересобирают спрайт перед каждым запуском и сборкой:

```json
{
  "scripts": {
    "sprites": "npx --yes @gromlab/svg-sprites src/infra/app-icons/svg-sprite.config.json",
    "predev": "npm run sprites",
    "dev": "vite",
    "prebuild": "npm run sprites",
    "build": "tsc --noEmit && vite build"
  }
}
```

## Использование спрайта

Значение `name: "app"` создаёт React-компонент `AppIcon`.

Создайте точку входа `src/infra/app-icons/index.ts`:

```ts
export * from './.svg-sprite/index.js'
```

Импортируйте generated component только через пользовательскую точку входа sprite-модуля, а не из `.svg-sprite`:

```tsx
import { AppIcon } from 'infra/app-icons'

<AppIcon
  icon="search"
  width={24}
  height={24}
  aria-hidden="true"
/>
```

Свойство `icon` принимает имена исходных SVG без расширения: `search.svg` становится `icon="search"`. Неизвестное имя является TypeScript-ошибкой.

Generator по умолчанию удаляет `width` и `height` из SVG внутри sprite. Не возвращайте фиксированные размеры в source или generated-файлы: задавайте базовые `width` и `height` только компоненту `AppIcon` в месте React-render. Responsive и state-dependent размер меняйте через CSS Module, не удаляя базовые props:

```tsx
import styles from './styles/search-button.module.css'

<AppIcon
  icon="search"
  width={24}
  height={24}
  className={styles.searchIcon}
  aria-hidden="true"
/>
```

```css
.root {
  display: inline-flex;
}

.searchIcon {
  width: 24px;
  height: 24px;

  @media (--md) {
    width: 32px;
    height: 32px;
  }
}
```

Generator автоматически обрабатывает поддерживаемые `fill` и `stroke`:

- единственный цвет заменяется на `var(--icon-color-1, currentColor)`;
- несколько цветов заменяются на `--icon-color-N`, где fallback каждой variable равен исходному цвету SVG.

Поэтому монохромная иконка без дополнительных styles наследует `currentColor`, а многоцветная сохраняет исходные цвета. Вручную удалять цвета из source SVG не нужно.

Рекомендуемый способ явного изменения цвета — generated CSS variable `--icon-color-1`, связанная с design token через CSS Module:

```tsx
import styles from './styles/search-button.module.css'

<AppIcon
  icon="search"
  width={24}
  height={24}
  aria-hidden="true"
  className={styles.searchIcon}
/>
```

```css
.root {
  display: inline-flex;
}

.searchIcon {
  --icon-color-1: var(--color-icon-primary);
}
```

Для многоцветной иконки задайте только variables, которые требуется переопределить; остальные сохранят исходные fallback-цвета:

```tsx
import styles from './styles/status.module.css'

<AppIcon
  icon="status"
  width={24}
  height={24}
  role="img"
  aria-label="Статус готовности"
  className={styles.statusIcon}
/>
```

```css
.root {
  display: inline-flex;
}

.statusIcon {
  --icon-color-1: var(--color-status-default);
  --icon-color-2: var(--color-status-accent);
}
```

Не задавайте `--icon-color-N` через inline `style`. Для themes и UI-состояний используйте classes и modifier-классы CSS Module.

Для декоративной иконки используй `aria-hidden="true"`. Для самостоятельной смысловой иконки передавай `role="img"` и `aria-label`. Интерактивность размещай на `button` или `a`, а не на самой иконке.

Vite сам подключает styles компонента и добавляет внешний `sprite.svg` в итоговую сборку. SVG geometry не попадает в JavaScript chunk, а asset кэшируется отдельно от React-кода.

## Иконки с gradients

Если SVG-иконка содержит gradient, не включайте её в sprite и используйте как обычное изображение.

## Дебаг и превью

Viewer показывает все иконки на одной странице, позволяет проверить их отображение, изменить цвета и посмотреть связанные CSS-переменные. Он нужен только для разработки и устанавливается отдельно:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Создайте `svg-sprite.html` в корне проекта:

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8">
    <title>Иконки проекта</title>
  </head>
  <body>
    <!-- React-корень Viewer для дебага и превью SVG-спрайта -->
    <div id="svg-sprite-viewer"></div>

    <!-- Подключение создаваемого ниже скрипта дебаггера -->
    <script type="module" src="/src/svg-sprite-debug.tsx"></script>
  </body>
</html>
```

Создайте `src/svg-sprite-debug.tsx`:

```tsx
import { createRoot } from 'react-dom/client'
import { SpriteViewer } from '@gromlab/svg-sprites/react'

const sources = [
  () => import('../src/infra/app-icons/.svg-sprite/svg-sprite.manifest.js')
] as const

const viewerRoot = document.getElementById('svg-sprite-viewer')

if (!viewerRoot) {
  throw new Error('SVG sprite viewer root is not found')
}

createRoot(viewerRoot).render(
  <SpriteViewer sources={sources} title="Иконки проекта" />
)
```

Запустите `npm run dev` и откройте `/svg-sprite.html`.

Стандартная production-сборка Vite использует только `index.html` и не включает страницу Viewer.
