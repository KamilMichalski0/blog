---
title: "Integracja agentów z danymi firmowymi przez MCP w OpenAI Agents SDK"
description: "Praktyczny przewodnik po MCPServerStreamableHttp i MCPServerStdio: GitHub, Postgres i Notion jako źródła danych dla agentów AI."
pubDate: "2025-10-21"
heroImage: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop"
tags: ["OpenAI Agents", "MCP", "Integracje", "TypeScript"]
draft: false
author: "ClaudeCodeLab"
---

## 1. Czym jest Model Context Protocol?

Model Context Protocol (MCP) umożliwia agentom dostęp do zewnętrznych systemów – od GitHuba po bazy danych – bez pisania własnych wrapperów. Dokumentacja SDK opisuje dwa najczęściej używane transporty:

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
