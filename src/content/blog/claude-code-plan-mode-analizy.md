---
title: "Autonomiczne analizy kodu z Claude Code: Plan Mode, Extended Thinking i hooki"
description: Jak połączyć tryb tylko-do-odczytu, głębokie myślenie oraz hook PostToolUse, by agent AI zaplanował refaktoring, zrealizował go etapowo i zebrał metryki testów.
pubDate: 2025-10-21
heroImage: /blog/heroes/claude-code-plan-mode-analizy.jpg
tags: ["Claude Code","Plan Mode","Extended Thinking","Automation"]
draft: false
author: ClaudeCodeLab
readingTime: 3
heroImageAlt: "Przewodnik: Claude Code - Autonomiczne analizy kodu Claude"
---




## 1. Aktywacja Plan Mode i Extended Thinking

[Plan Mode](https://docs.anthropic.com/en/docs/claude-code/plan-mode) w Claude Code pozwala analizować repozytorium bez zmian w plikach. Wystarczy w trakcie sesji nacisnąć **Shift+Tab**, aby przełączyć się w tryb tylko-do-odczytu; powrót następuje po ponownym naciśnięciu tej kombinacji. Teraz poproś agenta o głęboką analizę ([Extended Thinking](https://docs.anthropic.com/en/docs/claude-code/extended-thinking) włącza się pojedynczym naciśnięciem **Tab** i słowami kluczowymi `think deeply`, `ultrathink`), np.:

```
Think deeply and map the areas most coupled with our Redux store.
```

Claude przygotuje listę modułów, zależności i potencjalnych kolizji – bez edycji kodu. Zanotuj wnioski w osobnym pliku planu.

## 2. Tworzenie planu refaktoringu

W tym samym trybie poproś o harmonogram:

```
Think harder and propose a step-by-step refactor plan for migrating Redux to Zustand.
```

Plan Mode rozbije pracę na etapy (np. setup store’ów Zustand, migracja selektorów, aktualizacja testów, cleanup). Zachowaj listę działań i ryzyk – w Plan Mode agent nie wprowadzi zmian, dzięki czemu możesz ją spokojnie zaakceptować.

## 3. Hooki automatyzujące kontrole jakości

Gdy zaakceptujesz plan, wyjdź z Plan Mode i skonfiguruj [hook](https://docs.anthropic.com/en/docs/claude-code/hooks) `PostToolUse`, aby po każdej edycji plików agent uruchamiał testy oraz formatowanie:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$TOOL_INPUT_file_path\"",
            "timeout": 30
          },
          {
            "type": "command",
            "command": "npm run astro check",
            "timeout": 120
          },
          {
            "type": "command",
            "command": "npm run build",
            "timeout": 180
          }
        ]
      }
    ]
  }
}
```

Hooki wykonywane są równolegle i deduplikowane. Dzięki temu każda zmiana przechodzi automatyczną walidację.

## 4. Wykonanie planu krok po kroku

Wyłącz Plan Mode, a następnie wydaj polecenia realizujące plan kolejno:

```
Execute Step 1 from the approved plan: scaffold Zustand store and migrate auth reducer.
```

Po każdym etapie uruchom ponownie Plan Mode, aby zdobyć raport postępu:

```
Plan Mode: summarize what has changed after Step 1 and list remaining risks.
```

Extended Thinking zapewni szczegółową analizę (np. wskazanie komponentów, które jeszcze importują `useSelector`).

## 5. Zbieranie metryk i raport końcowy

W hooks możesz dodać dodatkowe polecenie generujące raport testów:

```json
{
  "type": "command",
  "command": "npm run test -- --coverage && echo \"Coverage report ready\"",
  "timeout": 240
}
```

Po finalnym kroku ponownie aktywuj Plan Mode i poproś o podsumowanie:

```
Think deeply and prepare a migration summary, remaining TODOs, and documentation updates.
```

Otrzymasz listę działań pokontrolnych (aktualizacja README, usunięcie paczek, checklisty QA). Dzięki hookom masz już wyniki buildów i testów, które możesz dołączyć do raportu.

## 📚 Dokumentacja i Zasoby

### Oficjalna Dokumentacja
- [Claude Code - Plan Mode](https://docs.anthropic.com/en/docs/claude-code/plan-mode)
- [Claude Code - Extended Thinking](https://docs.anthropic.com/en/docs/claude-code/extended-thinking)
- [Claude Code - Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks)

### Powiązane Artykuły
- [Plan Mode + Extended Thinking](/blog/plan-mode-extended-thinking-refaktoryzacja)
- [Hooks i Event-Driven Automation](/blog/hooks-event-automation)
- [Zaawansowane Techniki Claude Code](/blog/zaawansowane-techniki-claude-code)
- [AI w pipeline frontendu](/blog/claude-code-frontend-pipeline-ai)

## 6. Najlepsze praktyki

- **Plan najpierw** – zawsze rozpoczynaj w Plan Mode, aby agent nie dotknął kodu zanim zatwierdzisz strategię.  
- **Extended Thinking selektywnie** – używaj zwrotów `think deeply` tylko, gdy potrzebujesz pełnej diagnozy; skraca to czas odpowiedzi w prostszych zadaniach.  
- **Hooki z walidacją** – waliduj ścieżki (`$TOOL_INPUT_file_path`), aby unikać edycji plików spoza projektu.  
- **Etapowe wykonanie** – po każdym kroku wracaj do Plan Mode i weryfikuj efekty, zanim przejdziesz dalej.  
- **Automatyczne raporty** – generuj coverage i logi w hookach, by mieć komplet danych do PR.

Tak skoordynowany proces pozwala agentowi AI nie tylko zaplanować kompleksowy refaktoring, ale również wykonać go w kontrolowany sposób i dostarczyć pełną dokumentację jakości.
