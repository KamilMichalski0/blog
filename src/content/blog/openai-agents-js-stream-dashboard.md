---
title: "Streaming RunResult: dashboard pracy agentów"
description: "Zobacz, jak użyć `agent.run({ stream: true })`, klasyfikować zdarzenia i pokazywać postęp zadań w dashboardzie zespołu agentów."
pubDate: 2025-10-22
heroImage: ../../assets/blog/heroes/openai-agents-js-stream-dashboard.jpg
tags: ["OpenAI Agents","Streaming","Dashboard","TypeScript"]
draft: false
author: ClaudeCodeLab
readingTime: 2
heroImageAlt: "Ilustracja do artykułu o dashboardzie strumieniowym dla zespołu agentów"
---




## 1. Po co nam streaming?

OpenAI Agents SDK udostępnia tryb strumieniowy (`stream: true`), który emituje zdarzenia w trakcie pracy agenta. Dzięki temu możemy:

- pokazywać użytkownikowi postęp,  
- rejestrować każde wywołanie narzędzia (`RunToolCallItem`),  
- monitorować „myślenie” modelu (`RunReasoningItem`),  
- budować live dashboard dla zespołu operations.

## 2. Podstawowa konfiguracja

```typescript
import { Agent } from "@openai/agents";

const triage = new Agent({
  name: "Ops Triage",
  instructions: "Przydzielaj zadania do odpowiednich specjalistów, raportuj postęp.",
});
```

## 3. Uruchomienie w trybie strumieniowym

```typescript
const resultStream = await triage.run({
  input: "Sprawdź status deploya i przygotuj raport błędów.",
  stream: true,
});

for await (const event of resultStream) {
  handleEvent(event);
}
```

`resultStream` to asynchroniczny iterator emitujący obiekty typu `RunEvent`. Każdy zawiera `type` i `rawItem`, z którymi możemy pracować.

## 4. Klasyfikacja zdarzeń

```typescript
type RunEventHandler = (event: any) => void;

const handleEvent: RunEventHandler = (event) => {
  switch (event.type) {
    case "RunMessageOutputItem":
      logLLM(event.rawItem.message);
      break;
    case "RunToolCallItem":
      logTool(event.rawItem.toolCall);
      break;
    case "RunHandoffCallItem":
      logHandoff(event.rawItem.handoff);
      break;
    case "RunReasoningItem":
      logThought(event.rawItem.reasoning);
      break;
    default:
      logGeneric(event);
  }
};
```

Informacje z `RunToolCallItem` warto powiązać z czasem i parametrami – w dashboardzie widać, jak agent łączy się z MCP albo jak często wywołuje konkretne funkcje.

## 5. Wizualizacja postępów

Przykładowy prosty logger:

```typescript
function logTool(toolCall: unknown) {
  console.log("🔧 Tool:", JSON.stringify(toolCall, null, 2));
}

function logThought(reasoning: unknown) {
  console.log("🧠 Reasoning:", JSON.stringify(reasoning, null, 2));
}
```

W aplikacji webowej możesz przekazać zdarzenia do WebSocketów lub SSE. Strona frontowa od razu aktualizuje status (np. pasek postępu, tabela z ostatnimi tool callami, lista handoffów).

## 6. Dostęp do końcowego wyniku

Po zakończeniu iteracji strumienia `resultStream` zawiera `finalResult`, który można odczytać:

```typescript
const final = await resultStream.finalResult;
console.log("✅ Odpowiedź:", final.finalOutput);
```

Uzyskasz również pełny `RunResult` z `newItems`, `interruptions` i `state` – możesz go zapisać lub kontynuować sesję.

## 7. Dobre praktyki

- **Buforuj zdarzenia** – zapisuj je w bazie (np. MongoDB), aby mieć historię.  
- **Oznaczaj etapy** – `RunReasoningItem` świetnie nadaje się do śledzenia kroków w stylu „Plan → Execute → Validate”.  
- **Reaguj na przerwania** – gdy pojawi się prośba o aprobatę (`interruptions`), wyświetl w dashboardzie przycisk do zatwierdzenia i użyj `state.approve(...)`.

Streaming w OpenAI Agents JS pozwala spojrzeć w głąb procesu podejmowania decyzji przez agentów – dzięki temu zespół wsparcia ma pełną widoczność i może szybko reagować na problemy.

## 📚 Dokumentacja i Zasoby

### Oficjalna Dokumentacja
- [OpenAI Agents SDK - JavaScript](https://openai.github.io/openai-agents-js/)
- [OpenAI Agents SDK - Python](https://openai.github.io/openai-agents-python/)
- [Model Context Protocol](https://modelcontextprotocol.io/)

### Powiązane Artykuły
- [OpenAI Agents JS - Orkiestracja](/blog/openai-agents-js-orkiestracja)
- [MCP (Model Context Protocol)](/blog/mcp-model-context-protocol)
