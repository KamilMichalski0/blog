---
title: "Budowa zespołu agentów pomocowych w TypeScripcie z OpenAI Agents SDK"
description: "Przewodnik od podstaw: triage, wyspecjalizowane handoffy, guardraile, approvals i zarządzanie stanem w OpenAI Agents dla JavaScript."
pubDate: "2025-10-21"
heroImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop"
tags: ["OpenAI Agents", "TypeScript", "AI Workflow", "Guardrails"]
draft: false
author: "ClaudeCodeLab"
---

## 1. Przygotowanie środowiska

Zainstaluj pakiet [`@openai/agents`](https://openai.github.io/openai-agents-js/) i utwórz plik TypeScript, w którym będziesz konfigurować system:

```bash
npm install @openai/agents zod
```

W dokumentacji SDK agent to obiekt z nazwą i instrukcjami. Zacznijmy od agenta triage:

```typescript
import { Agent } from "@openai/agents";

const triage = new Agent({
  name: "Triage Agent",
  instructions: "Rozpoznawaj temat zgłoszenia i przekazuj je do odpowiedniego specjalisty.",
});
```

## 2. Dodanie wyspecjalizowanych handoffów

Zgodnie z dokumentacją, handoffs przenoszą sterowanie do innego agenta, który otrzymuje pełną historię rozmowy. Zdefiniujmy dwóch specjalistów:

```typescript
const billing = new Agent({
  name: "Billing Specialist",
  handoffDescription: "Obsługuje kwest ie płatności i faktur.",
  instructions: "Diagnozuj i rozwiązuj problemy finansowe krok po kroku.",
});

const product = new Agent({
  name: "Product Specialist",
  handoffDescription: "Rozwiązuje zagadnienia funkcjonalne w aplikacji.",
  instructions: "Analizuj pytania o funkcje i przygotowuj instrukcje krok po kroku.",
});
```

Następnie przypisz specjalistów do triage:

```typescript
triage.update({ handoffs: [billing, product] });
```

Gdy triage wykryje, że sprawę powinien przejąć np. billing, wywoła `transfer_to_billing`, a rozmowa zostanie przekazana.

## 3. Guardraile i zatwierdzanie wrażliwych narzędzi

SDK udostępnia guardraile wejściowe (`InputGuardrail`), które decydują, czy agent ma kontynuować pracę. W dokumentacji znajdziesz przykład z walidacją „czy to zadanie domowe?”. My zastosujemy go do odfiltrowania próśb niezwiązanych ze wsparciem:

```typescript
import { InputGuardrail } from "@openai/agents";
import { z } from "zod";

const SupportCheck = z.object({
  allowed: z.boolean(),
  reason: z.string(),
});

const guardrailAgent = new Agent({
  name: "Guardrail",
  instructions: "Sprawdź, czy użytkownik prosi o wsparcie produktowe lub billingowe.",
  outputType: SupportCheck,
});

const supportGuardrail = new InputGuardrail({
  guardrailFunction: async (ctx, agent, input) => {
    const verdict = await guardrailAgent.run({ input });
    const info = verdict.finalOutput;
    return { outputInfo: info, tripwireTriggered: !info?.allowed };
  },
});

triage.update({ inputGuardrails: [supportGuardrail] });
```

Chcesz wymagać zgody człowieka na wrażliwe operacje? Oznacz narzędzie flagą `needsApproval`:

```typescript
import { functionTool } from "@openai/agents";

const deleteAccount = functionTool({
  name: "delete_account",
  description: "Usuń konto klienta po potwierdzeniu.",
  parameters: z.object({ userId: z.string() }),
  needsApproval: true,
  execute: async ({ userId }) => {
    // ... implementacja
    return `Konto ${userId} usunięte`;
  },
});

billing.update({ tools: [deleteAccount] });
```

Podczas rozmowy `result.interruptions` poinformuje Cię, że narzędzie wymaga potwierdzenia:

```typescript
const run = await triage.run({ input: "Usuń moje konto" });
for (const approval of run.interruptions ?? []) {
  run.state.approve(approval); // lub reject
}
```

## 4. Wykonanie i sterowanie stanem sesji

`Runner.run(...)` upraszcza wywołanie i zarządza limitami tur:

```typescript
import { Runner } from "@openai/agents";

const result = await Runner.run(triage, "Mam problem z płatnością");
console.log(result.finalOutput);
```

Każdy `RunResult` zawiera serializowalny `state`. Możesz go zachować i wznowić konwersację:

```typescript
const savedState = JSON.stringify(result.state);
const continued = await triage.run({
  state: JSON.parse(savedState),
  input: "Czy faktura została już opłacona?",
});
```

W ten sposób tworzysz pełny zespół agentów: triage filtruje zgłoszenia i przekazuje je do wyspecjalizowanych partnerów, guardraile dbają o bezpieczeństwo, a approvals chronią wrażliwe operacje.

## 📚 Dokumentacja i Zasoby

### Oficjalna Dokumentacja
- [OpenAI Agents SDK - JavaScript](https://openai.github.io/openai-agents-js/)
- [OpenAI Agents - Getting Started](https://platform.openai.com/docs/guides/agents)
- [OpenAI Agents - Handoffs](https://openai.github.io/openai-agents-js/concepts/handoffs)
- [OpenAI Agents - Guardrails](https://openai.github.io/openai-agents-js/concepts/guardrails)

### Powiązane Artykuły
- [OpenAI Agents JS - Orkiestracja](/blog/openai-agents-js-orkiestracja)
- [OpenAI Agents MCP - Integracje](/blog/openai-agents-mcp-integracje)

## 5. Dalsze rekomendacje

- Dodaj `toolUseBehavior`, aby zatrzymać run po pierwszym wywołaniu krytycznego narzędzia.  
- Korzystaj z `stream: true`, jeśli chcesz w UI pokazywać postęp analizy w czasie rzeczywistym.  
- Definiuj `handoffDescription` precyzyjnie (np. „Problemy z subskrypcją i fakturami”), aby triage wiedział, kiedy wykonać przekazanie.

Po wdrożeniu powyższych kroków masz skalowalny, typowany i kontrolowany proces obsługi zgłoszeń oparty o dokumentowane funkcje OpenAI Agents SDK dla JavaScript.
