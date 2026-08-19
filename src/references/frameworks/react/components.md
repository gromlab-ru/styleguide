# React-компоненты

Применяй при создании, изменении или ревью React-компонента, Provider, Guard или Error Boundary.

Этот референс определяет правила работы с компонентом и обязательный набор сопровождающих файлов. Он не выбирает владельца, каталог, уровень вложенности или публичный API: эти решения относятся к architecture-референсам.

Правила JavaScript, TypeScript, JSX/TSX, документации и CSS загружай из соответствующих языковых референсов.

Готовую реализацию смотри в [`examples/components/user-status/`](examples/components/user-status/README.md).

## Состав файлов компонента

Не создавай отдельный `.tsx` без файлов types, styles и локального export.

Каждый компонент создавай полным комплектом в рамках одной задачи:

```text
├── styles/
│   └── user-status.module.css
├── types/
│   └── user-status-props.type.ts
├── user-status.tsx
└── index.ts
```

- Полный набор файлов обязателен для визуальных компонентов, Providers, Guards и Error Boundaries.
- Не оставляй временный standalone `.tsx` с намерением вынести types или styles позднее.
- Не объявляй props-типы и локальные стили внутри `.tsx`.
- Не объединяй component, props и styles в одном файле ради малого размера реализации.
- Не создавай дополнительные файлы без реальной роли.

## TSX-файл

`{name}.tsx` содержит реализацию одного компонента.

- Импортируй props-тип из `types/{name}-props.type.ts`.
- Импортируй CSS Module только при наличии собственного стилизуемого DOM.
- Не объявляй в файле второй самостоятельный компонент.
- Не размещай в `.tsx` type/interface props, CSS, local export barrel или implementation другого компонента.
- Синтаксис, predicates, conditional rendering, декомпозицию и обязательный JSDoc применяй по [`JSX/TSX`](../../languages/jsx-tsx.md).
- JavaScript и TypeScript внутри компонента продолжают подчиняться своим языковым референсам.

Смотри [`user-status.tsx`](examples/components/user-status/user-status.tsx).

## Types

Props выноси в `types/{name}-props.type.ts`.

- Собственные параметры называй `{Name}Params`.
- Атрибуты корневого HTML-элемента называй `RootAttrs`.
- Итоговый публичный тип называй `{Name}Props`.
- Для компонента с DOM выводи `RootAttrs` из `ComponentPropsWithoutRef<'tag'>`.
- Исключай через `Omit` атрибуты, которыми компонент управляет сам или которые конфликтуют с собственными параметрами.
- Для компонента без собственного корневого DOM-элемента не создавай фиктивный `RootAttrs`.
- Документируй types и поля по TypeScript-референсу.

Смотри [`user-status-props.type.ts`](examples/components/user-status/types/user-status-props.type.ts).

## Styles

Styles размещай в `styles/{name}.module.css` или в соответствующем module-формате препроцессора проекта.

- Файл styles является частью обязательного набора компонента.
- Компонент с DOM следует главе [`CSS Modules`](../../languages/css.md#css-modules).
- Для компонента без собственного DOM-элемента, например Provider или Guard, создай пустой CSS Module, но не импортируй его до появления стилизуемого DOM.
- Не добавляй такому компоненту DOM-wrapper только ради styles или `.root`.
- Не импортируй CSS Module другого компонента вместо создания styles текущего владельца.

Смотри [`user-status.module.css`](examples/components/user-status/styles/user-status.module.css).

## Local export

`index.ts` экспортирует публичные сущности компонента.

- Экспортируй компонент через named export.
- Экспортируй props через `export type`.
- Не экспортируй `Params`, `RootAttrs` и implementation details без необходимости.

Смотри [`index.ts`](examples/components/user-status/index.ts).

## Проверка

- Компонент не существует как standalone `.tsx` без types, styles и export-файла.
- Для `.tsx` созданы соответствующие `types/`, `styles/` и `index.ts`.
- Каждый файл выполняет одну определённую роль.
- Props не объявлены внутри `.tsx`.
- Styles принадлежат компоненту и не импортированы у другого владельца.
- Локальный `index.ts` экспортирует component и props type.
- JSX/TSX, JavaScript, TypeScript и CSS проверены по языковым референсам без дублирования их правил здесь.
