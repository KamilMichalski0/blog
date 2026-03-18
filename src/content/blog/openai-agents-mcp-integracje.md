---
title: "MCP w OpenAI Agents SDK: integracja danych firmowych"
description: "Praktyczny przewodnik po MCPServerStreamableHttp i MCPServerStdio z GitHubem, Postgresem i Notion jako źródłami danych dla agentów AI."
pubDate: 2025-10-21
heroImage: ../../assets/blog/heroes/openai-agents-mcp-integracje.jpg
tags: ["OpenAI Agents","MCP","Integracje","TypeScript"]
draft: false
author: ClaudeCodeLab
readingTime: 2
heroImageAlt: "Ilustracja do artykułu o integracji agentów z danymi firmowymi przez MCP"
---




## 1. Czym jest Model Context Protocol?

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) umożliwia agentom dostęp do zewnętrznych systemów – od GitHuba po bazy danych – bez pisania własnych wrapperów. Dokumentacja [SDK](https://openai.github.io/openai-agents-js/) opisuje dwa najczęściej używane transporty:

- **`MCPServerStreamableHttp`** – dla usług udostępnianych przez HTTP (idealne dla GitHuba, Notion).  
- **`MCPServerStdio`** – dla lokalnych procesów uruchamianych z CLI (np. Postgresowy serwer MCP).

## 2. Konfiguracja streamowalnego serwera HTTP

Załóżmy, że chcesz, aby agent uzyskiwał dane z firmowego GitHuba i bazy wiedzy w Notion:

```typescript
import {
  Agent,
  MCPServerStreamableHttp,
  createMCPToolStaticFilter,
} from "@openai/agents";

const githubMcp = new MCPServerStreamableHttp({
  name: "company-github",
  url: "https://mcp.github.com",
  cacheToolsList: true,
  toolFilter: createMCPToolStaticFilter(["list_pull_requests", "get_issue"]),
});

const notionMcp = new MCPServerStreamableHttp({
  name: "company-notion",
  url: "https://mcp.notion.com/mcp",
  cacheToolsList: true,
});
```

`cacheToolsList: true` przyspiesza ładowanie; kiedy dodasz nowe narzędzie, wywołaj `githubMcp.invalidateToolsCache()` aby odświeżyć cache.

## 3. Dodanie lokalnego serwera stdio

Do zapytań SQL skorzystaj z `MCPServerStdio`, który uruchomi serwer jako proces:

```typescript
import { MCPServerStdio } from "@openai/agents";

const postgresMcp = new MCPServerStdio({
  fullCommand: "npx -y postgres-mcp-server",
  cacheToolsList: true,
  toolFilter: (tool) => tool.name?.startsWith("select_") ?? false,
});
```

W pliku `.env` przechowuj dane dostępowe (np. `DATABASE_URL`), a następnie przekaż je jako zmienne środowiskowe przy uruchamianiu procesu.

## 4. Agent korzystający z wielu MCP

Skonfiguruj agenta, który potrafi przełączać się między źródłami:

```typescript
const opsAnalyst = new Agent({
  name: "Ops Analyst",
  instructions: `
    Odpowiadasz na pytania o status deployów, raporty błędów i dokumentację.
    Używaj MCP do pobierania danych: GitHub dla PR i issue, Notion dla runbooków, Postgres dla metryk.
  `,
  mcpServers: [githubMcp, notionMcp, postgresMcp],
});
```

Teraz po wywołaniu:

```typescript
const result = await opsAnalyst.run({
  input: "Podaj status PR #245 i czy w bazie są nierozwiązane alerty.",
});
console.log(result.finalOutput);
```

Agent automatycznie wybierze odpowiednie narzędzia MCP (np. `list_pull_requests`, `select_alerts`) i zwróci scaloną odpowiedź. Dziennik `result.newItems` pokaże, które narzędzia zostały wykorzystane.

## 5. Dobre praktyki z dokumentacji

- **Filtruj narzędzia** – ograniczaj dostęp do konkretnych funkcji (`createMCPToolStaticFilter` lub funkcja własna), aby uniknąć wywołań spoza zakresu.  
- **Odświeżaj cache po zmianach** – `invalidateToolsCache()` gwarantuje, że agent pozna nowe endpointy bez restartu aplikacji.  
- **Łącz MCP z guardrailami** – zanim agent sięgnie po dane wrażliwe, sprawdź kontekst wejścia (np. czy pytanie ma odpowiedni poziom uprawnień).  
- **Monitoruj błędy** – obsługuj wyjątki w `try/catch`, aby informować użytkownika, gdy zewnętrzny serwer MCP jest niedostępny.

Z tą konfiguracją agent AI zyskuje wgląd w realne systemy firmowe i może odpowiadać na bieżąco na pytania o deploye, zgłoszenia czy metryki – bez ręcznego kopiowania danych.

## 📚 Dokumentacja i Zasoby

### Oficjalna Dokumentacja
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [OpenAI Agents SDK - JavaScript](https://openai.github.io/openai-agents-js/)
- [OpenAI Agents - MCP Integration](https://openai.github.io/openai-agents-js/concepts/mcp)
- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers)

### Powiązane Artykuły
- [MCP (Model Context Protocol)](/blog/mcp-model-context-protocol)
- [OpenAI Agents JS - Orkiestracja](/blog/openai-agents-js-orkiestracja)
- [OpenAI Agents JS - Zespół Pomocowy](/blog/openai-agents-js-zespol-pomocowy)
