# Генерация REST API client

Если доступна актуальная OpenAPI specification, используй `@gromlab/rest-api-codegen`, чтобы получить типы и
операции REST API.

Запускай CLI через one-shot команду package manager с зафиксированной версией:

```bash
npx --yes @gromlab/rest-api-codegen@5.2.4 \
  --input https://api.example.com/openapi.json \
  --output ./src/infra/pet-store-api/generated
```

Зафиксируй команду в scripts проекта. Точный input, output и актуальную версию CLI определяй по проекту и skill
`rest-api-codegen-ru`.

## Generated output

Генератор создаёт самодостаточный TypeScript client:

```text
generated/
├── create-api-client.ts
├── data-contracts.ts
├── http-client.ts
├── index.ts
├── operations-tree.ts
└── operations/
    ├── index.ts
    └── <operation>.ts
```

| Файл | Назначение |
| --- | --- |
| `data-contracts.ts` | Типы данных, параметры и тела запросов из OpenAPI |
| `operations/` | Типизированная функция для каждого endpoint |
| `operations-tree.ts` | Полное дерево операций для сборки API client |
| `http-client.ts` | `HttpClient`, `ApiError` и request contracts |
| `create-api-client.ts` | Связывание дерева операций с transport |
| `index.ts` | Общая точка экспорта generated client |

Generated client не требует runtime dependency на package генератора. Output-каталог полностью принадлежит CLI:
не изменяй generated-файлы и не размещай внутри них transport config, исправления или другой ручной код.

После генерации прочитай фактические exports, структуру `operationsTree` и сигнатуры нужных операций. Если OpenAPI
отсутствует или содержит ошибки, операции можно создать вручную по [`api-client.md`](api-client.md).
