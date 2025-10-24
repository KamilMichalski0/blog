---
title: "OpenAI Agents SDK w JavaScript: Orkiestracja Agentów Krok po Kroku"
description: "Dowiedz się, jak zbudować skalowalny system agentów w TypeScripcie z handoffami, guardrailami, MCP oraz kontrolą narzędzi."
pubDate: "2025-02-15"
heroImage: "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?q=80&w=1200&auto=format&fit=crop"
tags: ["OpenAI Agents", "JavaScript", "TypeScript", "AI Orchestration"]
draft: false
author: "ClaudeCodeLab"
---

## Dlaczego warto sięgnąć po SDK Agents?

JavaScriptowe SDK OpenAI Agents dostarcza typowany interfejs do budowania wieloagentowych workflowów. Zamiast ręcznie sterować promptami, definiujesz agentów z instrukcjami, narzędziami i strażnikami, a następnie pozwalasz runtime’owi koordynować ich interakcje. Poniżej pokazuję, jak na bazie oficjalnej dokumentacji ułożyć kompletną orkiestrację dla zespołu wsparcia technicznego.

## Fundamenty: Agent, Runner i Handoffs

Najprostszy agent to obiekt z nazwą oraz instrukcjami:

```typescript
import { Agent } from "@openai/agents";

const assistant = new Agent({
  name: "Support Assistant",
  instructions: "Pomagaj użytkownikom, odpowiadaj jasno i rzeczowo.",
});
```

Do uruchomienia sesji wykorzystasz `agent.run()` albo `Runner.run(...)`:

```typescript
const result = await assistant.run({ input: "Jak zresetować hasło?" });
console.log(result.finalOutput);
```

Strategię multi-agentową budujesz przez handoffy. Agent triage przekazuje rozmowę specjalistom, którzy dziedziczą historię konwersacji:

```typescript
const billing = new Agent({
  name: "Billing Specialist",
  handoffDescription: "Obsługuje rozliczenia i faktury",
  instructions: "Diagnozuj problemy finansowe, potwierdzaj płatności.",
});

const triage = new Agent({
  name: "Triage Agent",
  instructions: "Przekieruj zgłoszenie do odpowiedniego specjalisty.",
  handoffs: [billing],
});
```

Gdy triage wywoła `transfer_to_billing`, kontrola dialogu przejdzie do nowego agenta.

## Guardrails: weryfikuj zanim odpowiesz

SDK wspiera strażników wejściowych i wyjściowych. Możesz uruchomić pomocniczego agenta walidującego intencję użytkownika i zablokować dalszą konwersację, jeśli nie spełnia kryteriów:

```typescript
import { z } from "zod";
import { InputGuardrail } from "@openai/agents";

const SafetyCheck = z.object({
  allowed: z.boolean(),
  reason: z.string(),
});

const guardrailAgent = new Agent({
  name: "Guardrail Check",
  instructions: "Sprawdź, czy rozmowa dotyczy wsparcia technicznego.",
  outputType: SafetyCheck,
});

const safetyGuardrail = new InputGuardrail({
  guardrailFunction: async (ctx, agent, input) => {
    const response = await guardrailAgent.run({ input });
    const verdict = response.finalOutput;
    return {
      outputInfo: verdict,
      tripwireTriggered: !verdict?.allowed,
    };
  },
});

const secureTriage = new Agent({
  name: "Secure Triage",
  instructions: "Obsługuj tylko zgłoszenia wsparcia.",
  handoffs: [billing],
  inputGuardrails: [safetyGuardrail],
});
```

Wyjątek `InputGuardrailTripwireTriggered` daje Ci szansę na własne flow (np. automatyczną odpowiedź, że temat jest spoza zakresu).

## Narzędzia i agent jako tool

Agent może wywoływać funkcje dzięki `functionTool`, a także używać innych agentów jako narzędzi bez pełnego przejęcia sesji:

```typescript
import { functionTool } from "@openai/agents";

const lookupInvoice = functionTool({
  name: "lookup_invoice",
  description: "Znajdź status faktury po numerze",
  parameters: z.object({ invoiceId: z.string() }),
  execute: async ({ invoiceId }) => getInvoiceStatus(invoiceId),
});

const billingToolbox = billing.asTool({
  toolName: "billing_advisor",
  toolDescription: "Analizuje problemy z płatnościami",
  runConfig: { maxTurns: 4 },
});

const frontline = new Agent({
  name: "Frontline Support",
  instructions: "Rozwiązuj typowe zgłoszenia, eskaluj trudniejsze przypadki.",
  tools: [lookupInvoice, billingToolbox],
});
```

`asTool` pozostawia kontrolę głównemu agentowi, ale umożliwia wykorzystanie wiedzy wyspecjalizowanego partnera.

## MCP: wpięcie zewnętrznych systemów

Jeżeli agent ma korzystać z API lub bazy danych, dołącz MCP server:

```typescript
import { MCPServerStreamableHttp } from "@openai/agents";

const githubMcp = new MCPServerStreamableHttp({
  name: "github-support",
  url: "https://mcp.github.com",
  cacheToolsList: true,
});

const devOps = new Agent({
  name: "DevOps Specialist",
  instructions: "Diagnozuj awarie i sprawdzaj status PR-ów.",
  mcpServers: [githubMcp],
});
```

Możesz filtrować dostępne narzędzia (`createMCPToolStaticFilter`) lub odświeżać cache, gdy serwer udostępnia nowe funkcje.

## Pełny przepływ i sterowanie stanem

Po uruchomieniu `agent.run()` otrzymujesz `RunResult`. Zawiera on finalną odpowiedź, listę wywołań narzędzi, przerwania (approval workflow) oraz serializowalny `state`, który wykorzystasz do wznowienia konwersacji:

```typescript
const result = await frontline.run({ input: "Potrzebuję faktury #INV-2025" });

if (result.interruptions?.length) {
  for (const approval of result.interruptions) {
    // ręczna akceptacja wrażliwego narzędzia
    result.state.approve(approval);
  }

  const continued = await frontline.run({ state: result.state });
  console.log(continued.finalOutput);
}
```

`Runner.run(...)` lub streaming `agent.run({ stream: true })` przydają się, gdy chcesz budować UI reagujące na kolejne zdarzenia (`RunMessageOutputItem`, `RunToolCallItem`, itd.).

## Najlepsze praktyki z dokumentacji

- **Instrukcje per agent** – twórz konkretną listę oczekiwań („Wyjaśniaj krok po kroku”, „Zadawaj pytania doprecyzowujące”), zamiast ogólnych opisów.  
- **Zod po stronie TypeScriptu** – wymuszaj strukturę odpowiedzi agentów i narzędzi, co ułatwia walidację i serializację.  
- **Guardrails przed wykonaniem** – blokuj niepożądane przypadki zanim przejdą dalej; traktuj wyjątek `InputGuardrailTripwireTriggered` jako sygnał do manualnej interwencji.  
- **MCP z filtrami** – ograniczaj narzędzia tylko do tych, które agent naprawdę potrzebuje, oraz czyść cache, gdy integracje się zmieniają.  
- **Kontrola narzędzi** – `toolUseBehavior` pozwala zatrzymywać run po pierwszym narzędziu, specyficznych narzędziach lub własnej funkcji agregującej wyniki.

## Podsumowanie

SDK OpenAI Agents w JavaScript przenosi nas z poziomu „prompt + odpowiedź” na poziom orkiestracji zespołu wysoko specjalizowanych agentów. Dzięki handoffom, guardrailom, narzędziom oraz integracjom MCP możesz odwzorować realny proces wsparcia, a jednocześnie utrzymać przewidywalność wyników. Zacznij od triage + specjalistów, dołóż walidację wejścia, a następnie rozszerzaj system o kolejne narzędzia – kod utrzymany w TypeScripcie pozostanie czytelny i bezpieczny.
