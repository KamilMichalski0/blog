---
title: "Automatyzacja frontendu: Plan Mode i hook PostToolUse"
description: "Sprawdź, jak skonfigurować Claude Code, aby planował zmiany, formatował kod, uruchamiał `astro check` i wskazywał brakujące testy."
pubDate: 2025-10-21
heroImage: ../../assets/blog/heroes/claude-code-frontend-pipeline-ai.jpg
tags: ["Claude Code","Automation","Frontend","Astro"]
draft: false
author: ClaudeCodeLab
readingTime: 2
heroImageAlt: "Ilustracja do artykułu o automatyzacji frontendu z Plan Mode i hookami"
---




## 1. Plan Mode jako pierwsza linia bezpieczeństwa

Zaczynaj każdą sesję od przełączenia w [Plan Mode](https://docs.anthropic.com/en/docs/claude-code/plan-mode) (**Shift+Tab**). Agent pracuje wtedy tylko w trybie odczytu i może bezpiecznie ocenić zmiany:

```
Plan Mode: think deeply and review the components touched in the last commit.
```

[Extended Thinking](https://docs.anthropic.com/en/docs/claude-code/extended-thinking) (uruchamiane pojedynczym **Tab** razem ze zwrotem `think deeply`) pozwala zebrać pełen kontekst – np. listę komponentów, klas Tailwind i zależności, które wymagają testów E2E.

## 2. Hook PostToolUse dla formatowania i kontroli jakości

Po opuszczeniu Plan Mode dodaj do `.claude/settings.json` [hook](https://docs.anthropic.com/en/docs/claude-code/hooks), który reaguje na każdą edycję:

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

Hooki uruchamiają się równolegle, więc formatowanie, `astro check` i build zakończą się zanim agent przejdzie dalej. Jeśli którykolwiek krok zwróci błąd, Claude przekaże logi w konwersacji.

## 3. Automatyczne wskazówki testowe

Po wykonaniu hooków poproś agenta, aby wskazał brakujące testy, korzystając z Extended Thinking:

```
Think harder and list missing unit or integration tests for updated components.
```

AI przeanalizuje ostatnie edycje i wskaże scenariusze, które warto dopisać (np. walidację formularzy, edge cases dla dynamicznych tras Astro).

## 4. Uspójnienie planowania i wykonania

Przykładowy cykl pracy:

1. **Plan Mode** – ocena zmian i lista działań.  
2. **Wyjście z Plan Mode** – polecenie wykonania zadania (np. „Zrefaktoruj komponent hero z Tailwind”).  
3. **Hook PostToolUse** – automatyczne formatowanie i testy po każdej edycji.  
4. **Extended Thinking** – analityczny raport testowy i TODO.  
5. **Plan Mode** – szybka weryfikacja wyników przed commitem.

## 5. Walidacja i bezpieczeństwo

Aby uniknąć przypadkowych edycji, dodaj guardrail w hooku:

```json
{
  "type": "command",
  "command": "if echo \"$TOOL_INPUT_file_path\" | grep -q '\\.env'; then echo 'Blocked secret file' >&2 && exit 2; fi",
  "timeout": 5
}
```

`exit 2` zatrzyma dalsze działania, dzięki czemu agent nie dotknie wrażliwych plików. Pamiętaj też, aby w Plan Mode regularnie monitorować wyniki testów:

```
Plan Mode: summarize the last build and test outputs from the hook logs.
```

## 📚 Dokumentacja i Zasoby

### Oficjalna Dokumentacja
- [Claude Code - Plan Mode](https://docs.anthropic.com/en/docs/claude-code/plan-mode)
- [Claude Code - Extended Thinking](https://docs.anthropic.com/en/docs/claude-code/extended-thinking)
- [Claude Code - Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [Astro Documentation](https://docs.astro.build/)

### Powiązane Artykuły
- [Plan Mode + Extended Thinking](/blog/plan-mode-extended-thinking-refaktoryzacja)
- [Hooks i Event-Driven Automation](/blog/hooks-event-automation)
- [Zaawansowane Techniki Claude Code](/blog/zaawansowane-techniki-claude-code)

## 6. Co dalej?

- Dodaj hook `SessionEnd`, który wyśle podsumowanie do Slacka albo zapisze log w repozytorium.
- Rozszerz pipeline o `npm run test -- --coverage`, aby raporty pokrycia były generowane automatycznie.
- Połącz te kroki z CI (np. GitHub Actions), aby każdy commit przechodził te same kontrole.

Dzięki takiemu podejściu agent AI staje się integralną częścią pipeline'u frontendu: planuje, wykonuje, testuje i raportuje zmiany, a Ty wchodzisz do gry dopiero przy przeglądzie wyników.
