---
title: OpenAI Agents JS jako router zadań dla Claude Code
description: Pokazujemy, jak agent w TypeScripcie triage’uje zadania, wybiera właściwego specjalistę i przekazuje je do Claude Code przez asTool i hooki.
pubDate: 2025-10-22
heroImage: ../../assets/blog/heroes/openai-agents-js-router-claude.jpg
tags: ["OpenAI Agents","Claude Code","Automation","TypeScript"]
draft: false
author: ClaudeCodeLab
readingTime: 2
heroImageAlt: "Przewodnik: OpenAI Agents - OpenAI Agents jako router"
---




## 1. Architektura rozwiązania

Z dokumentacji OpenAI Agents JS wynika, że agent może stać się narzędziem (`asTool`) dla innego agenta. Wykorzystamy to, aby triage w TypeScripcie decydował, czy zadanie powinno trafić do Claude Code (np. refaktoring frontendu), czy do innego bota (np. analizującego testy backendu). Pipeline składa się z:

1. Agenta triage (JS) z handoffami i narzędziami,  
2. Hooka w Claude Code, który w razie potrzeby uruchamia `claude` z odpowiednim promptem.

## 2. Definicja agenta triage

```typescript
import { Agent } from "@openai/agents";

const frontendAssistant = new Agent({
  name: "Frontend Claude",
  instructions: `
    Plan Mode: think deeply about frontend tasks, refactor Astro components,
    run hook pipeline (prettier, astro check, build).
  `,
});

const backendAssistant = new Agent({
  name: "Backend Analyst",
  instructions: "Analizuj logi serwera i testy integracyjne.",
});

const triage = new Agent({
  name: "Task Router",
  instructions: `
    Oceniaj zgłoszenia. Jeśli dotyczą UI/Frontend, użyj Claude Code.
    Jeśli dotyczą backendu, użyj backendowego agenta.
    W razie wątpliwości poproś o doprecyzowanie.
  `,
  handoffs: [backendAssistant],
});
```

## 3. Zamiana Claude Code w narzędzie

W praktyce start Claude Code realizujesz z poziomu CLI, ale w routerze JS możesz przygotować funkcję, która przekaże prompt do Claude’a:

```typescript
import { functionTool } from "@openai/agents";
import { execa } from "execa";

const claudeTool = functionTool({
  name: "claude_frontend_task",
  description: "Przekaż zadanie do Claude Code z Plan Mode i hookami.",
  parameters: z.object({ prompt: z.string() }),
  execute: async ({ prompt }) => {
    const { stdout } = await execa("claude", [prompt], {
      cwd: "/path/to/repo",
    });
    return stdout;
  },
});

triage.update({ tools: [claudeTool] });
```

Teraz, kiedy triage uzna, że zadanie jest frontendowe, wywoła `claude_frontend_task`. Claude Code od strony CLI ma już skonfigurowane hooki (`PostToolUse`), więc automatycznie sformatuje kod, uruchomi `astro check` i build.

## 4. Integracja z hookami Claude Code

W ustawieniach `.claude/settings.json` dodaj dedykowany hook, który zapisze kontekst zadania:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"Task Context: $SESSION_ID\" >> logs/claude-router.log",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

Do `PostToolUse` użyj konfiguracji z wcześniejszych artykułów (prettier, `astro check`, build), aby zapewnić CI-light pipeline.

## 5. Prognozowanie i raportowanie

Po zakończeniu zadania triage może wygenerować raport z `result.newItems`:

```typescript
const run = await triage.run({
  input: "Zrefaktoruj komponent hero i popraw animacje view transitions.",
});

const finalOutput = run.finalOutput;
const history = run.newItems.filter((item) => item.type === "RunToolCallItem");
console.log({ finalOutput, history });
```

W logach zobaczysz, które narzędzia były użyte (np. `claude_frontend_task`), a dzięki hookom Claude Code – jakie testy zostały uruchomione.

## 6. Wskazówki

- **Delimituj prompy** – w `claude` najlepiej przekazać pełny prompt (Plan Mode + Extended Thinking), aby Claude zrobił szczegółowy plan przed edycją.  
- **Obsługuj błędy** – jeśli CLI zwróci błąd, rzuć wyjątek w `execute`, aby triage wiedział, że zadanie trzeba ponowić.  
- **Rozszerz router** – dodaj kolejne narzędzia (np. `Data Analyst`) i pozwól triage-owi ważyć priorytety (dodatkowy guardrail lub scoring).

Taki układ pozwala centralnie zarządzać napływającymi zadaniami i automatycznie przekazywać je do Claude Code, gdzie hooki dbają o pełną jakość zmian w repozytorium.

## 📚 Dokumentacja i Zasoby

### Oficjalna Dokumentacja
- [OpenAI Agents SDK - JavaScript](https://openai.github.io/openai-agents-js/)
- [OpenAI Agents SDK - Python](https://openai.github.io/openai-agents-python/)
- [Model Context Protocol](https://modelcontextprotocol.io/)

### Powiązane Artykuły
- [OpenAI Agents JS - Orkiestracja](/blog/openai-agents-js-orkiestracja)
- [MCP (Model Context Protocol)](/blog/mcp-model-context-protocol)
