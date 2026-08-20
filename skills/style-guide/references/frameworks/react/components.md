# React-компоненты

Применяй при создании, изменении или ревью React-компонента, Provider, Guard или Error Boundary.

Этот референс определяет правила работы с компонентом и набор сопровождающих файлов. Он не выбирает владельца,
каталог, уровень вложенности или публичный API: эти решения относятся к architecture-референсам.

Правила JavaScript, TypeScript, JSX/TSX, документации и CSS загружай из соответствующих языковых референсов.

Готовую реализацию смотри в [`examples/components/user-status/`](examples/components/user-status/README.md).

## Состав файлов компонента

Не оставляй самостоятельный публичный component без локального export и отдельного props contract. Styles добавляй,
когда component владеет стилизуемым DOM.

Каждый компонент создавай полным комплектом в рамках одной задачи:

```text
├── styles/
│   └── user-status.module.css
├── types/
│   └── user-status-props.type.ts
├── user-status.tsx
└── index.ts
```

- Полный набор файлов обязателен для визуального component с собственным стилизуемым DOM.
- Provider, Guard или Error Boundary без собственного DOM создаётся без CSS Module.
- Не оставляй временный standalone `.tsx` с намерением вынести props contract или public export позднее.
- Не объявляй публичный props-тип и локальные styles внутри `.tsx`.
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

- Файл styles является частью набора component с собственным стилизуемым DOM.
- Компонент с DOM следует главе [`CSS Modules`](../../languages/css.md#css-modules).
- Для component без собственного DOM-элемента, например Provider или Guard, не создавай пустой CSS Module.
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

- Публичный component не существует как standalone `.tsx` без props contract и export-файла.
- Для визуального component с собственным DOM созданы `types/`, `styles/` и `index.ts`.
- Для Provider, Guard или Error Boundary без DOM не создан пустой CSS Module.
- Каждый файл выполняет одну определённую роль.
- Props не объявлены внутри `.tsx`.
- Styles принадлежат компоненту и не импортированы у другого владельца.
- Локальный `index.ts` экспортирует component и props type.
- JSX/TSX, JavaScript, TypeScript и CSS проверены по языковым референсам без дублирования их правил здесь.
