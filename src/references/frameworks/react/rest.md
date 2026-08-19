# REST в React

Для REST API используй [REST API Codegen](https://github.com/gromlab-ru/rest-api-codegen) как клиент и [SWR](https://swr.vercel.app/) как React data layer.

## Перед работой

1. Найди и загрузи agent skills `rest-api-codegen` и `swr`.
2. Найди существующий generated или manual REST API Codegen client.
3. Определи владельца API integration и React hook по SLM Design.

Если skills недоступны, используй официальную документацию обеих библиотек. Не угадывай generated API и сигнатуры hooks.

## REST client

- Генерируй клиент из OpenAPI через REST API Codegen, если спецификация доступна.
- Для API без спецификации используй manual client того же инструмента.
- Не редактируй generated-файлы вручную.
- Авторизацию, transport, retries и общую обработку ошибок настраивай на границе API client.
- Не создавай отдельный `fetch` или Axios wrapper рядом с готовым REST API Codegen client.

## React hooks

- Для чтения REST-ресурсов используй SWR.
- Передавай стабильный key, содержащий все параметры ресурса.
- Используй operation API client как fetcher, когда его сигнатура совместима с SWR.
- Для управляемых mutations используй подход SWR, выбранный по его skill и актуальной документации.
- Не дублируй remote data в Zustand.

Минимальный пример смотри в [`examples/data-fetching/swr-rest-api-codegen/`](examples/data-fetching/swr-rest-api-codegen/README.md).

## Запрещённые замены

При строгом применении style guide не используй TanStack Query, RTK Query и аналогичные REST cache/data-fetching библиотеки вместо SWR.

- Не мигрируй существующий проект с другой рабочей data layer в локальной задаче.
- Не добавляй SWR параллельно существующей библиотеке без отдельного решения о migration boundary.
- Новую или массовую миграцию выполняй только по прямому запросу пользователя или правилам проекта.

## Проверка

- REST transport реализован через REST API Codegen.
- Generated-код не изменён вручную.
- React REST hooks используют SWR и стабильные keys.
- Remote data не дублируется в client store.
- Загружены skills REST API Codegen и SWR либо официальная документация.
