# Style Guide Skill

Отдельный проект frontend style guide для AI-агентов. Исходники хранятся в `src/`, готовый устанавливаемый skill собирается в `skills/style-guide/`.

## Принцип устройства

`SKILL.md` не содержит все правила. Он объясняет агенту, какие референсы загрузить по расширению файла и характеру задачи.

- `code-style.md` — обязательные общие правила без дополнительной группировки.
- `languages/` — JavaScript, TypeScript, JSX/TSX, HTML и CSS.
- `frameworks/` — React.
- `architecture/` — физическое оформление уже принятых архитектурных решений.
- `tooling/` — подготовка центральных variables, media и nesting для стилей.

## Структура

```text
src/
├── SKILL.md
└── references/
    ├── code-style.md
    ├── architecture/
    │   ├── slm-design.md
    │   └── slm-structure.md
    ├── frameworks/
    │   └── react/
    │       ├── README.md
    │       ├── components.md
    │       ├── styling.md
    │       ├── state-management.md
    │       ├── rest.md
    │       ├── realtime.md
    │       ├── icons.md
    │       └── examples/
    │           ├── components/
    │           ├── stores/
    │           ├── data-fetching/
    │           ├── subscriptions/
    │           └── icons/
    ├── tooling/
    │   └── style-environment.md
    └── languages/
        ├── css.md
        ├── html.md
        ├── javascript.md
        ├── jsx-tsx.md
        ├── typescript.md
        └── typescript/
            └── value-predicates/
```

Сборка сохраняет эту структуру без объединения документов:

```text
skills/style-guide/
├── SKILL.md
└── references/
    └── ...
```

## Команды

- `npm run build` — пересобрать `skills/style-guide/`.
- `npm run check` — проверить синтаксис сборщика и выполнить сборку.

У проекта нет runtime-зависимостей; нужен Node.js 18 или новее.

## Разработка

1. Изменяйте только исходники в `src/`.
2. Обновляйте карту в `src/SKILL.md` при добавлении или перемещении референса.
3. Запускайте `npm run check`.
4. Коммитьте обновлённый `skills/style-guide/` вместе с исходниками.

Каталог `skills/style-guide/` можно подключить как внешний каталог skills или перенести в каталог skills конкретного AI-инструмента.
