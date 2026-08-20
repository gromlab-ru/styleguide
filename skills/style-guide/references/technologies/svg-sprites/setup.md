# Подготовка SVG sprite

Используй `@gromlab/svg-sprites` для создания sprite asset и типизированного API. Перед настройкой загрузи agent
skill `svg-sprites-ru` и используй его exact-mode guide.

## Перед работой

1. Определи package manager, framework, router и bundler по реальным scripts и config-файлам.
2. Найди существующие sprite configs, source SVG, generation scripts и imports generated API.
3. Проверь `predev`, `prebuild`, `pretypecheck` и другие lifecycle scripts; не перезаписывай их.
4. Выбери имя и состав одного sprite.
5. Определи команды typecheck и build для проверки результата.

Не создавай дублирующий sprite для одного consumer и одного exact mode без отдельной границы загрузки. Разные
consumers и modes могут собирать один source-набор в независимые outputs; source SVG при этом не копируется.

## Размещение

Размещай sprite-модуль в `src/infra/<sprite-name>`. Внутри храни source SVG или ссылки на них, config и
пользовательский public entry:

```text
src/infra/app-icons/
├── icons/
├── svg-sprite.config.json
├── index.ts
└── .svg-sprite/
```

Называй sprite по назначению всего набора, например `app-icons` или `file-manager-icons`, а не по одной иконке.

## Exact mode

Config должен содержать полный mode key, соответствующий framework и bundler. Например:

- React + Vite — `react@vite`;
- React + Webpack 5 — `react@webpack`;
- Vue + Vite — `vue@vite`;
- static HTML с собственной публикацией — `standalone`.

Полный список modes и mode-specific setup бери из skill `svg-sprites-ru`. Не используй generic `react`, `vue`,
`vite` или другой сокращённый mode и не выбирай mode только по установленным dependencies: проверь реальные dev и
build commands.

## Config

Предпочитай JSON config, если проекту не нужны package-типы или программная конфигурация:

```json
{
  "mode": "react@vite",
  "name": "app",
  "input": "./icons/**/*.svg"
}
```

`name` задаёт имя generated API. Значение `app` создаёт `AppIcon`, `AppIconName` и связанные exports. Используй
`kebab-case` и имя всего sprite.

TypeScript или JavaScript config применяй только при необходимости. Если TypeScript config импортирует
`defineSpriteConfig` или package types, установи `@gromlab/svg-sprites` как development dependency.

## Input

Пути `input` разрешаются относительно каталога config-файла:

- каталог включает SVG только на одном уровне;
- для подпапок используй явный recursive glob `./icons/**/*.svg`;
- точный файл подключается точным путём;
- массив объединяет несколько sources;
- значение с префиксом `!` исключает совпадения;
- каждый positive source должен найти хотя бы один SVG;
- разные файлы с одинаковым basename конфликтуют.

Не копируй общий SVG в несколько каталогов. Добавь его точный путь или glob в `input` каждого нужного sprite.

## Generation script

CLI принимает один путь к config-файлу или config-less каталогу:

```bash
npx --yes @gromlab/svg-sprites src/infra/app-icons/svg-sprite.config.json
```

Закрепи команду в `package.json` и запускай её до процессов, импортирующих generated API:

```json
{
  "scripts": {
    "sprites:app": "npx --yes @gromlab/svg-sprites src/infra/app-icons/svg-sprite.config.json",
    "predev": "npm run sprites:app",
    "dev": "vite",
    "prebuild": "npm run sprites:app",
    "build": "tsc --noEmit && vite build"
  }
}
```

Сохраняй существующие lifecycle scripts и встраивай generation без повторного запуска одной команды. Для нескольких
sprites создай отдельную команду на каждый config и один общий script.

Запуск через `npx` не добавляет package в dependencies. Устанавливай `@gromlab/svg-sprites` как development
dependency только для package-типов config, программного API или `SpriteViewer`.

## Generated-каталог

В React/Next component mode generator создаёт `.svg-sprite` с внешним `sprite.svg`, manifest, типами, public facade
и React component:

```text
.svg-sprite/
├── index.js
├── index.d.ts
├── icon-data.js
├── icon-data.d.ts
├── sprite.svg
├── svg-sprite.manifest.js
├── svg-sprite.manifest.d.ts
└── react/
    ├── react-component.js
    ├── react-component.d.ts
    └── react-component.module.css
```

Другие framework adapters и standalone modes имеют собственный generated contract. Bare `standalone` и
`standalone@server` не создают `.svg-sprite/index.js` и consumer facade. Всегда сверяй output с exact guide из skill.

Generator полностью владеет `.svg-sprite` и generated `.gitignore`:

- не редактируй и не форматируй generated-файлы вручную;
- не помещай внутрь пользовательский code;
- не перемещай `sprite.svg` в `public` для bundler modes;
- не переписывай generated asset URL;
- после смены mode полностью перегенерируй sprite.

Пользовательский `index.ts` размещай рядом с `.svg-sprite`, а не внутри него.

## Viewer

`SpriteViewer` не является обязательной частью sprite. Добавляй его по запросу или для массовой визуальной проверки,
сложных цветов и transforms. Подключение Viewer зависит от framework, bundler и router; используй exact guide из
skill `svg-sprites-ru`.

## Проверка

1. Запусти точную sprite-команду.
2. Проверь mode, имя, число иконок и generated output.
3. Проверь public entry и типизированный список имён.
4. Запусти typecheck.
5. Запусти минимальную dev или build-команду, затронутую изменением.
