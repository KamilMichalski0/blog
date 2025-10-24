---
title: "MCP + Notion: agent, który aktualizuje runbooki z historii PR"
description: Konfigurujemy MCP dla GitHuba i Notion, aby agent AI czytał pull requesty i automatycznie dopisywał Lessons Learned w bazie runbooków.
pubDate: 2025-10-22
heroImage: ../../assets/blog/heroes/openai-agents-mcp-notion-runbook.jpg
tags: ["OpenAI Agents","MCP","Notion","Automation"]
draft: false
author: ClaudeCodeLab
readingTime: 2
heroImageAlt: OpenAI Agents - Notion agent, który aktualizuje
---




## 1. Cel i architektura

Chcemy, by agent AI po każdym merge’u:

1. Pobierał najnowsze PR-y z GitHuba.  
2. Wyciągał kluczowe wnioski.  
3. Aktualizował stronę „Runbook: Lessons Learned” w Notion.

Model Context Protocol (MCP) umożliwia agentowi pracę z obydwoma narzędziami bez dodatkowych wrapperów.

## 2. Konfiguracja MCP

Dodaj do projektu `.mcp.json` (zgodnie z dokumentacją JS SDK):

```json
{
  "mcpServers": {
    "github": {
      "transport": "http",
      "url": "https://mcp.github.com",
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      },
      "toolFilter": ["list_pull_requests", "get_pull_request"]
    },
    "notion": {
      "transport": "http",
      "url": "https://mcp.notion.com/mcp",
      "env": {
        "NOTION_TOKEN": "${NOTION_TOKEN}"
      }
    }
  }
}
```

`toolFilter` ogranicza GitHub MCP do niezbędnych funkcji.

## 3. Agent analityk

```typescript
import { Agent, MCPServerStreamableHttp } from "@openai/agents";

const githubServer = new MCPServerStreamableHttp({
  name: "github",
  url: "https://mcp.github.com",
  cacheToolsList: true,
});

const notionServer = new MCPServerStreamableHttp({
  name: "notion",
  url: "https://mcp.notion.com/mcp",
  cacheToolsList: true,
});

const runbookMaintainer = new Agent({
  name: "Runbook Maintainer",
  instructions: `
    1. Pobierz ostatnie zmergowane PR-y.
    2. Przeanalizuj sekcję description i diff.
    3. Wyciągnij Lessons Learned i zapisz w Notion.
  `,
  mcpServers: [githubServer, notionServer],
});
```

## 4. Pozyskanie PR-ów i generowanie wniosków

```typescript
const result = await runbookMaintainer.run({
  input: `
    Use github to list merged pull requests from the last 3 days in repo org/repo.
    Summarize each into lessons learned.
  `,
});

console.log(result.finalOutput);
```

`result.newItems` pokaże, które narzędzia MCP zostały wykorzystane. Jeśli w repozytorium jest dużo PR-ów, możesz poprosić agenta, aby przefiltrował te oznaczone etykietą `runbook`.

## 5. Aktualizacja Notion

Następnie poproś agenta:

```
Use notion to append the lessons to page https://notion.site/runbook-lessons with a table containing:
- PR title
- Summary
- Lesson Learned
```

MCP Notion umożliwia odwołania do większości typów bloków; jeśli Twój serwer MCP wymaga konkretnych nazw narzędzi (np. `append_blocks`), dodaj je w instrukcjach.

## 6. Automatyzacja harmonogramu

Połącz agenta z cronem lub pipeline CI:

```bash
#!/bin/bash
set -e
claude "Run runbook maintainer: summarize merged PRs and update Notion."
```

Możesz też użyć `Runner.run_streamed`, aby wizualizować postęp (np. logi: „Pobrano PR #245”, „Dodano wpis w Notion”).

## 7. Wskazówki

- **Inwaliduj cache** – po dodaniu nowych narzędzi MCP użyj `server.invalidateToolsCache()`.  
- **Walidacja** – dodaj guardrail w agencie, aby sprawdzał, czy pole Lesson Learned nie jest puste.  
- **Security** – trzymaj tokeny w `.env` i nie commituj ich.

Dzięki MCP agent samodzielnie łączy GitHub i Notion: może codziennie wzbogacać runbook o świeże wnioski bez udziału człowieka.

## 📚 Dokumentacja i Zasoby

### Oficjalna Dokumentacja
- [OpenAI Agents SDK - JavaScript](https://openai.github.io/openai-agents-js/)
- [OpenAI Agents SDK - Python](https://openai.github.io/openai-agents-python/)
- [Model Context Protocol](https://modelcontextprotocol.io/)

### Powiązane Artykuły
- [OpenAI Agents JS - Orkiestracja](/blog/openai-agents-js-orkiestracja)
- [MCP (Model Context Protocol)](/blog/mcp-model-context-protocol)
