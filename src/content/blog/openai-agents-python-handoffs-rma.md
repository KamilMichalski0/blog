---
title: "Handoffs w Pythonie: wsparcie i analizy RMA"
description: Budujemy przepływ pracy w OpenAI Agents SDK dla Pythona z wieloma agentami, guardrailami o różnych priorytetach i logowaniem sesji.
pubDate: 2025-10-22
heroImage: ../../assets/blog/heroes/openai-agents-python-handoffs-rma.jpg
tags: ["OpenAI Agents","Python","Handoffs","Support"]
draft: false
author: ClaudeCodeLab
readingTime: 2
heroImageAlt: "Ilustracja do artykułu o handoffach i orkiestracji zgłoszeń w Pythonie"
---




## 1. Scenariusz biznesowy

Zespół wsparcia potrzebuje automatycznego triage’u, który:

1. Rozpoznaje zgłoszenia produktowe vs. reklamacyjne (RMA).  
2. W zależności od priorytetu przekazuje rozmowę do odpowiedniego agenta.  
3. Loguje przebieg do sesji, aby operatorzy mieli wgląd w historię.

OpenAI Agents SDK dla Pythonu dostarcza wszystkie klocki: `Agent`, `handoff`, `InputGuardrail`, `Session`.

## 2. Definicja modeli Pydantic

```python
from pydantic import BaseModel

class TicketInfo(BaseModel):
    ticket_id: str
    priority: str  # "low", "medium", "high"
    category: str  # "product", "rma"

class GuardrailVerdict(BaseModel):
    allowed: bool
    reason: str
```

## 3. Strażnik priorytetów

```python
from agents import Agent, InputGuardrail, GuardrailFunctionOutput, Runner

guardrail_agent = Agent(
    name="Priority Guardrail",
    instructions="Potwierdź, że zgłoszenie dotyczy wsparcia i wyznacz priorytet.",
    output_type=TicketInfo,
)

async def priority_guardrail(ctx, agent, input_data):
    result = await Runner.run(guardrail_agent, input_data, context=ctx.context)
    info = result.final_output_as(TicketInfo)
    allowed = info.category in {"product", "rma"}
    return GuardrailFunctionOutput(
        output_info=info,
        tripwire_triggered=not allowed,
    )
```

## 4. Specjalistyczni agenci

```python
product_agent = Agent(
    name="Product Specialist",
    handoff_description="Obsługuje zgłoszenia produktowe i pytania o funkcje.",
    instructions="Diagnozuj problemy z UI, udzielaj instrukcji krok po kroku.",
)

rma_agent = Agent(
    name="RMA Analyst",
    handoff_description="Zajmuje się zwrotami, reklamacjami i raportami RMA.",
    instructions="Przeanalizuj historię napraw i w razie potrzeby eskaluj.",
)
```

## 5. Agent główny z handoffami

```python
from agents import handoff, Session

triage_agent = Agent(
    name="Support Triage",
    instructions="Oceń zgłoszenie i przekaż je do właściwego specjalisty.",
    handoffs=[product_agent, rma_agent],
    input_guardrails=[InputGuardrail(guardrail_function=priority_guardrail)],
)
```

Możesz doprecyzować handoff wykorzystując `handoff(...)` z parametrami (np. przekazać priorytet w `input_type`), ale w prostym scenariuszu wystarczy powyższy zapis.

## 6. Logowanie do sesji

```python
session = Session()

async def handle_messages(messages: list[str]):
  responses = []
  for message in messages:
    result = await Runner.run(
        triage_agent,
        message,
        session=session
    )
    responses.append(result.final_output)
  return responses
```

`Session` przechowuje historię, więc gdy w kolejnym kroku użytkownik zapyta „Jaki jest status mojego RMA?”, agent pamięta wcześniejsze dane.

## 7. Zarządzanie priorytetem w handoffie

Wynik guardraila przechowamy w `ctx.context`. Aby dostęp był łatwy, dodaj strukturę kontekstu:

```python
class SupportContext(BaseModel):
    ticket: TicketInfo | None = None

context = SupportContext()

result = await Runner.run(
    triage_agent,
    "Mam problem ze sprzętem, nie działa ekran.",
    context=context,
)
```

Specjalista (np. `product_agent`) może odczytać `ctx.context.ticket.priority` i zdecydować, czy potrzebna jest eskalacja.

## 8. Rejestr wyjątków

```python
from agents.exceptions import InputGuardrailTripwireTriggered, ModelBehaviorError

try:
    result = await Runner.run(triage_agent, "Chcę kupić nowy produkt")
except InputGuardrailTripwireTriggered as exc:
    print("Zgłoszenie odrzucone:", exc)
except ModelBehaviorError as exc:
    print("Błąd modelu:", exc)
```

Możesz zapisać takie incydenty do bazy CRM.

## 9. Co dalej?

- Dodaj narzędzia (`as_tool`) w specjalistach, np. `check_inventory` lub `open_rma_ticket`.  
- Użyj `RunHooks`, by logować start/zakończenie agentów i budować wykres SLA.  
- Integruj `Runner.run_streamed`, jeśli chcesz śledzić progres na dashboardzie (patrz drugi artykuł w tej serii).

Z takim setupem Pythonowe SDK staje się orkiestratorem działu wsparcia – kładzie nacisk na właściwy routing, pilnuje priorytetów i zapewnia pełny zapis konwersacji.

## 📚 Dokumentacja i Zasoby

### Oficjalna Dokumentacja
- [OpenAI Agents SDK - JavaScript](https://openai.github.io/openai-agents-js/)
- [OpenAI Agents SDK - Python](https://openai.github.io/openai-agents-python/)
- [Model Context Protocol](https://modelcontextprotocol.io/)

### Powiązane Artykuły
- [OpenAI Agents JS - Orkiestracja](/blog/openai-agents-js-orkiestracja)
- [MCP (Model Context Protocol)](/blog/mcp-model-context-protocol)
