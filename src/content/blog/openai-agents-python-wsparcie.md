---
title: "Pythonowy workflow agentowy dla działu wsparcia z OpenAI Agents SDK"
description: "Jak użyć Pydantic, InputGuardrails i Sessions w Pythonie, by zbudować agenta wsparcia zapamiętującego kontekst i filtrującego niepożądane zgłoszenia."
pubDate: "2025-10-21"
heroImage: "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=1200&auto=format&fit=crop"
tags: ["OpenAI Agents", "Python", "Guardrails", "Sessions"]
draft: false
author: "ClaudeCodeLab"
---

## 1. Instalacja i szkic projektu

Z dokumentacji SDK wynika, że najwygodniej korzystać z wersji asynchronicznej. Zainstaluj pakiet:

```bash
pip install openai-agents
```

Utwórz plik `support_agent.py` i zaimportuj podstawowe klasy:

```python
from agents import Agent, Runner, InputGuardrail
from agents.exceptions import InputGuardrailTripwireTriggered
from pydantic import BaseModel
```

## 2. Definicja agentów i modelu danych

Główny agent będzie odpowiadał na pytania klientów, ale chcemy też strażnika, który odfiltruje zgłoszenia spoza naszego zakresu. Pydantic pozwala nam jasno opisać strukturę odpowiedzi:

```python
class SupportVerdict(BaseModel):
    allowed: bool
    reason: str

guardrail_agent = Agent(
    name="Guardrail",
    instructions="Sprawdź, czy użytkownik pyta o wsparcie produktowe.",
    output_type=SupportVerdict,
)

support_agent = Agent(
    name="Support Frontline",
    instructions="Rozwiązuj pytania o produkt, podawaj kroki i zachowuj uprzejmy ton.",
)
```

## 3. Guardrail wejściowy

Korzystając z przykładu w dokumentacji, tworzymy funkcję strażnika:

```python
async def support_guardrail(ctx, agent, input_data):
    result = await Runner.run(guardrail_agent, input_data, context=ctx.context)
    verdict = result.final_output_as(SupportVerdict)
    return dict(output_info=verdict, tripwire_triggered=not verdict.allowed)

support_agent = Agent(
    name="Support Frontline",
    instructions="Pomagaj w sprawach produktowych.",
    input_guardrails=[InputGuardrail(guardrail_function=support_guardrail)],
)
```

Jeżeli użytkownik poprosi o coś spoza zakresu, SDK rzuci `InputGuardrailTripwireTriggered`. Obsłużymy to w kodzie:

```python
async def handle_query(message: str):
    try:
        return await Runner.run(support_agent, message)
    except InputGuardrailTripwireTriggered as exc:
        return f"Przepraszam, nie mogę pomóc: {exc}"
```

## 4. Sesje i zapamiętywanie kontekstu

Aby agent pamiętał poprzednie rozmowy, skorzystaj z `Session`:

```python
from agents import Session

session = Session()

async def chat_with_support(messages: list[str]):
    responses = []
    for message in messages:
        try:
            result = await Runner.run(
                support_agent,
                message,
                session=session
            )
            responses.append(result.final_output)
        except InputGuardrailTripwireTriggered as exc:
            responses.append(f"Zgłoszenie odrzucone: {exc}")
    return responses
```

W dokumentacji pokazano, że `Session` automatycznie przechowuje historię – agent zapamięta np. imię klienta.

## 5. Dodanie narzędzi (opcjonalnie)

Możesz rozszerzyć agenta o funkcje narzędziowe:

```python
from agents import function_tool

@function_tool(description_override="Sprawdź status zgłoszenia w systemie CRM")
async def get_ticket_status(ticket_id: str) -> str:
    # tu normalnie wywołanie API
    return f"Zgłoszenie {ticket_id} jest w trakcie realizacji."

support_agent = Agent(
    name="Support Frontline",
    instructions="Pomagaj, korzystając z narzędzi CRM.",
    tools=[get_ticket_status],
    input_guardrails=[InputGuardrail(guardrail_function=support_guardrail)],
)
```

## 6. Uruchomienie i dalsze kroki

```python
import asyncio

async def main():
    conversation = [
        "Cześć, moje konto się nie synchronizuje.",
        "Jak mogę zgłosić błąd do zespołu dev?",
    ]
    replies = await chat_with_support(conversation)
    for reply in replies:
        print(reply)

asyncio.run(main())
```

### Dobre praktyki z dokumentacji

- Ustaw `max_turns` w `Runner.run`, aby uniknąć nieskończonych pętli.  
- Gdy strażnik blokuje zgłoszenie, zwróć jasny komunikat użytkownikowi.  
- Model Pydantic (`SupportVerdict`) przechowuj w jednym miejscu, by w razie zmian mieć centralne źródło prawdy.  
- Używaj `Runner.run_streamed`, jeśli chcesz na żywo pokazywać odpowiedzi w interfejsie.

Gotowe – masz Pythona agenta wsparcia, który filtruje niepożądane sprawy, pamięta kontekst i może korzystać z narzędzi systemowych.
