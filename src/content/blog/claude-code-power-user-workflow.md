---
title: "Zaawansowany workflow w Claude Code: sesje i approvals"
description: "Przewodnik dla zaawansowanych użytkowników Claude Code: jak łączyć rozszerzone tryby myślenia, sesje i mechanizm approvals w złożonych projektach."
pubDate: 2025-10-22
heroImage: ../../assets/blog/heroes/claude-code-power-user-workflow.jpg
tags: ["Claude Code","Extended Thinking","Sessions","Automation"]
draft: false
author: ClaudeCodeLab
readingTime: 2
heroImageAlt: "Ilustracja do artykułu o zaawansowanym workflow w Claude Code"
---




## 1. Extended Thinking Megathink – kiedy warto?

Claude Code obsługuje rozszerzone tryby myślenia (`think`, `think deeply`, `think harder`, `megathink`, `ultrathink`). Jedno naciśnięcie **Tab** plus komenda np. „Think harder...” daje budżet nawet 32 000 tokenów na rozumowanie. Używaj go, gdy:

- planujesz przekrojowy refaktoring,  
- analizujesz zależności między modułami,  
- tworzysz dokumentację techniczną.

Przykład:

```
Think harder and map the architectural dependencies between services, including database access patterns and external integrations.
```

Otrzymasz kompletny raport w jednym kroku, bez edycji kodu (szczególnie jeśli jesteś w Plan Mode).

## 2. Zapisy stanu sesji

Po każdym większym etapie serializuj stan:

```bash
claude
> Save session state to logs/refactor-session.json
```

W trybie CLI otrzymasz JSON ze śladem narzędzi i kontekstu. Dzięki temu możesz:

- wznowić pracę na innym stanowisku (`claude --resume logs/refactor-session.json`),  
- przekazać stan koledze,  
- uruchamiać kilka wątków prac równolegle (np. „refaktoring auth” i „optymalizacja builda”).

Jeżeli używasz SDK JS/Python, analogiczne mechanizmy to `result.state` (JS) lub `Runner.run(..., session=Session())` (Python). W CLI w razie potrzeby poproś:

```
Plan Mode: summarize what is stored in the current session state and highlight outstanding TODOs.
```

## 3. Approvals – bezpieczne operacje

W hookach i narzędziach możesz oznaczyć komendy jako wymagające zatwierdzenia. Przykład hooka, który blokuje deployment:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$TOOL_INPUT_command\" | grep -q 'deploy'; then echo 'Deployment requires approval' >&2 && exit 2; fi",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

W SDK JS możesz zdefiniować narzędzie:

```typescript
const restartService = functionTool({
  name: "restart_service",
  description: "Restartuje krytyczny serwis",
  parameters: z.object({ service: z.string() }),
  needsApproval: true,
  execute: async ({ service }) => /* ... */,
});
```

Gdy agent spróbuje użyć narzędzia, `result.interruptions` zgłosi potrzebę zgody. Z CLI:

```
Pending approval: restart_service on service=payments. Approve? (y/N)
```

## 4. Łączenie elementów w workflow projektu

1. **Plan Mode + Megathink** – generujesz plan migracji (np. Redux→Zustand).  
2. **Zapis stanu** – po każdym etapie zapisujesz snapshot.  
3. **Approvals** – wrażliwe komendy (deploy, kasowanie danych) wymagają manualnego potwierdzenia.  
4. **Hooki** – `PostToolUse` uruchamia testy, coverage, Lighthouse (patrz artykuł o CI light).  
5. **Stop** – końcowy hook tworzy raport do PR.

## 5. Wskazówki eksperckie

- **Wersjonuj snapshoty** – dodaj datę i nazwę zadania (`logs/session-2025-10-22-refactor.json`).  
- **Komentuj approvals** – w CLI wpisz krótką notatkę (np. „Approved by @anna – maintenance window”).  
- **Monitoruj budżet** – dla długich sesji notuj ile razy używasz `megathink`; w razie potrzeby skróć polecenia, by zachować responsywność.

Z takim zestawem narzędzi Claude Code staje się platformą dla power userów: planujesz głębokie zmiany, bezpiecznie je wykonujesz i w każdej chwili możesz przerwać lub wznowić pracę dokładnie tam, gdzie skończyłeś.

## 📚 Dokumentacja i Zasoby

### Oficjalna Dokumentacja
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code/)
- [Astro Documentation](https://docs.astro.build/)

### Powiązane Artykuły
- [Wprowadzenie do Claude Code](/blog/wprowadzenie-do-claude-code)
- [Zaawansowane Techniki Claude Code](/blog/zaawansowane-techniki-claude-code)
