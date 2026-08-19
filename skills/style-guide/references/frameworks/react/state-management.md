# State management в React

Для разделяемого изменяемого client state предпочитай [Zustand](https://github.com/pmndrs/zustand).

## Перед работой

1. Найди и загрузи agent skill `zustand`.
2. Определи владельца состояния по SLM Design.
3. Проверь, действительно ли состоянию нужен store.

Если skill недоступен, используй [официальную документацию Zustand](https://zustand.docs.pmnd.rs/).

## Выбор хранилища

- Локальное UI-состояние одного компонента оставляй в React state.
- Разделяемое изменяемое client state размещай в Zustand store владельца.
- Remote REST data и server cache размещай в SWR, а не в Zustand.
- Realtime subscription data по умолчанию размещай в `useSWRSubscription`, если сценарий подходит SWR.
- Не создавай global store только для устранения prop drilling без анализа владельца и lifecycle.

## Работа со store

- Компонент выбирает минимальный slice через selector.
- Не подписывай компонент на весь store без необходимости.
- Изменение состояния выполняй через actions store.
- State и actions типизируй явно.
- Не дублируй derived state, если значение вычисляется selector или функцией.
- Store не становится архитектурным владельцем: он принадлежит SLM-модулю ответственности.

Минимальный пример смотри в [`examples/stores/zustand/`](examples/stores/zustand/README.md).

## Приоритет проекта

- Не добавляй Zustand рядом с существующим state manager в локальной задаче без согласования.
- В новом проекте или строгом режиме style guide выбирай Zustand для shared client state.
- Миграцию Redux, MobX и других stores выполняй только отдельной задачей.

## Проверка

- Store используется для shared client state, а не local или remote state.
- Владелец и lifecycle состояния определены.
- Компоненты используют selectors минимального размера.
- Загружен skill Zustand или официальная документация.
