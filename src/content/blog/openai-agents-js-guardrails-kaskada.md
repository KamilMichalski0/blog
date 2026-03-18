---
title: "Guardrails w OpenAI Agents JS: moderacja krok po kroku"
description: Dowiedz się, jak zbudować moderację w OpenAI Agents JS z guardrailami wejścia i wyjścia, obsługą wyjątków oraz ręcznym zatwierdzaniem w TypeScripcie.
pubDate: 2025-10-22
heroImage: ../../assets/blog/heroes/openai-agents-js-guardrails-kaskada.jpg
tags: ["OpenAI Agents","Guardrails","Moderacja","TypeScript"]
draft: false
author: ClaudeCodeLab
readingTime: 2
heroImageAlt: "Ilustracja do artykułu o wielopoziomowych guardrailach w OpenAI Agents JS"
---




## 1. Dlaczego warto łączyć guardraile?

Dokumentacja OpenAI Agents SDK dla JavaScript podkreśla, że strażnicy (guardrails) mogą działać na wejściu, wyjściu oraz w trakcie pracy agenta. W praktyce warto zbudować kaskadę:

1. **InputGuardrail** – filtruje niepożądane tematy jeszcze przed uruchomieniem agenta.  
2. **Output Guardrail** – upewnia się, że odpowiedź spełnia standardy (bez danych wrażliwych, z poprawnym formatem).  
3. **Manual override** – operator może zatwierdzić odrzucone zapytanie poprzez `state.approve(...)`.

## 2. Przygotowanie modeli Zod

```typescript
import { Agent, InputGuardrail, GuardrailFunctionOutput } from "@openai/agents";
import { z } from "zod";

const TopicVerdict = z.object({
  allowed: z.boolean(),
  reason: z.string(),
});

const OutputCheck = z.object({
  safe: z.boolean(),
  redacted: z.boolean(),
});
```

## 3. Agent strażnik i InputGuardrail

```typescript
const guardrailAgent = new Agent({
  name: "Guardrail Triage",
  instructions: "Sprawdź, czy pytanie dotyczy wsparcia produktowego lub billingowego.",
  outputType: TopicVerdict,
});

const inputGuardrail = new InputGuardrail({
  guardrailFunction: async (ctx, agent, input) => {
    const result = await guardrailAgent.run({ input });
    const verdict = result.finalOutput;
    return {
      outputInfo: verdict,
      tripwireTriggered: !verdict?.allowed,
    } satisfies GuardrailFunctionOutput<z.infer<typeof TopicVerdict>>;
  },
});
```

Jeżeli strażnik zablokuje zapytanie, SDK zwróci `InputGuardrailTripwireTriggered`, dzięki czemu możemy wyświetlić użytkownikowi uprzejmy komunikat.

## 4. Dodanie guardraila wyjściowego

```typescript
const outputGuardrailAgent = new Agent({
  name: "Output Auditor",
  instructions: "Sprawdź, czy odpowiedź jest zgodna z polityką, ma poprawny ton i nie zawiera danych wrażliwych.",
  outputType: OutputCheck,
});

const supportAgent = new Agent({
  name: "Support Specialist",
  instructions: "Rozwiązuj zgłoszenia produktowe w jasny, uprzejmy sposób.",
  inputGuardrails: [inputGuardrail],
  outputGuardrails: [
    async (ctx, agent, output) => {
      const audit = await outputGuardrailAgent.run({ input: output });
      return {
        outputInfo: audit.finalOutput,
        tripwireTriggered: !audit.finalOutput?.safe,
      };
    },
  ],
});
```

## 5. Obsługa wyjątków i manualne override

```typescript
import {
  InputGuardrailTripwireTriggered,
  GuardrailExecutionError,
} from "@openai/agents";

async function handleRequest(prompt: string) {
  try {
    const result = await supportAgent.run({ input: prompt });
    return result.finalOutput;
  } catch (error) {
    if (error instanceof InputGuardrailTripwireTriggered) {
      return `Zgłoszenie odrzucone: ${error.message}`;
    }
    if (error instanceof GuardrailExecutionError) {
      console.error("Guardrail error:", error.state);
      return "Wystąpił błąd moderacji. Zgłoś sprawę operatorowi.";
    }
    throw error;
  }
}
```

W przypadku narzędzi oznaczonych `needsApproval: true`, `result.interruptions` będzie zawierało listę oczekujących zgód:

```typescript
const run = await supportAgent.run({ input: "Usuń konto użytkownika" });

for (const approval of run.interruptions ?? []) {
  // logika biznesowa: np. sprawdź uprawnienia operatora
  run.state.approve(approval, { alwaysApprove: false });
}

const continued = await supportAgent.run({ state: run.state });
```

## 6. Dobre praktyki

- **Loguj `outputInfo` strażników** – dane diagnostyczne przydają się do szkoleń i audytów.  
- **Kaskaduj guardraile** – możesz dodać kolejne poziomy (np. sprawdzanie formatu JSON).  
- **Zachowaj spójność** – ten sam model Zod (`TopicVerdict`) wykorzystaj w Node/API, aby walidować override operatora.

Rezultat to wielopoziomowy system moderacji, który automatycznie odrzuca niepożądane pytania, pilnuje jakości odpowiedzi i pozwala ludziom w wyjątkowych przypadkach przejąć kontrolę.

## 📚 Dokumentacja i Zasoby

### Oficjalna Dokumentacja
- [OpenAI Agents SDK - JavaScript](https://openai.github.io/openai-agents-js/)
- [OpenAI Agents SDK - Python](https://openai.github.io/openai-agents-python/)
- [Model Context Protocol](https://modelcontextprotocol.io/)

### Powiązane Artykuły
- [OpenAI Agents JS - Orkiestracja](/blog/openai-agents-js-orkiestracja)
- [MCP (Model Context Protocol)](/blog/mcp-model-context-protocol)
