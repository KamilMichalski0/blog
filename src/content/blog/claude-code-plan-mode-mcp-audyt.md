---
title: "Audyt infrastruktury z Plan Mode i MCP"
description: Claude Code analizuje repozytorium w trybie tylko do odczytu i używa MCP do sprawdzenia GitHuba oraz Postgresa, tworząc listę kontroli.
pubDate: 2025-10-22
heroImage: ../../assets/blog/heroes/claude-code-plan-mode-mcp-audyt.jpg
tags: ["Claude Code","Plan Mode","MCP","DevOps"]
draft: false
author: ClaudeCodeLab
readingTime: 2
heroImageAlt: "Ilustracja do artykułu o audycie infrastruktury z Plan Mode i MCP"
---




## 1. Etap planowania w Plan Mode

Zgodnie z dokumentacją Claude Code, Plan Mode (aktywowany **Shift+Tab**) uruchamia sesję w trybie read-only. Na starcie poproś agenta:

```
Plan Mode: think deeply and map the current DevOps configuration, including CI pipelines and infrastructure scripts.
```

Extended Thinking (pojedyncze **Tab** + zwrot `think deeply`) zapewni wnikliwy raport: lokalizację plików CI (`.github/workflows`), skrypty deploy (`scripts/deploy.sh`), definicje Terraform itp. Notuj wszystkie uwagi – Plan Mode nie zmienia kodu.

## 2. Przygotowanie checklisty audytowej

W tym samym trybie poproś o listę kontrolną:

```
Think harder and create an audit checklist covering CI status, pending PRs and database migration history.
```

Otrzymasz plan: np. „sprawdź status ostatniego workflow GitHub Actions”, „zweryfikuj otwarte PR-y związane z infrastrukturą”, „przejrzyj ostatnie wpisy w tabeli `deploy_events`”. Po zaakceptowaniu planu wyjdź z Plan Mode (**Shift+Tab**).

## 3. Konfiguracja MCP dla GitHuba i Postgresa

Skorzystaj z dokumentacji Model Context Protocol (`docs/openai-agents-javascript.md`) i dodaj serwery MCP:

```json
{
  "mcpServers": {
    "github-audit": {
      "transport": "http",
      "url": "https://mcp.github.com",
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres-audit": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "postgres-mcp-server"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

W Claude Code serwery staną się narzędziami dostępnych przez MCP.

## 4. Realizacja checklisty poza Plan Mode

Teraz poleć agentowi wykonać zadania:

1. **Status workflow**  
   ```
   Use MCP github-audit to list the last run of .github/workflows/deploy.yml.
   ```
2. **Otwarte PR-y**  
   ```
   Query github-audit for pull requests labeled "infrastructure".
   ```
3. **Historia migracji**  
   ```
   Query postgres-audit with:
   SELECT * FROM deploy_events ORDER BY created_at DESC LIMIT 10;
   ```

Claude Code wywoła odpowiednie narzędzia MCP i zaprezentuje wyniki w konsoli – wiesz, które pipeline’y zakończyły się sukcesem, jakie PR-y czekają na review i czy ostatnie deploye przeszły pomyślnie.

## 5. Generowanie raportu końcowego

Po zebraniu danych wróć do Plan Mode i poproś o podsumowanie:

```
Plan Mode: summarize the audit results and list follow-up actions for DevOps.
```

Extended Thinking wygeneruje raport z wnioskami (np. „PR #245 wymaga review przed deployem”, „Tabela `deploy_events` wskazuje brak deployu w weekend”). Możesz go zapisać do `docs/devops-audit-YYYY-MM-DD.md`.

## 6. Dobre praktyki

- **Filtruj narzędzia MCP** – ogranicz dostęp do koniecznych endpointów (np. tylko odczyt PR).  
- **Dodaj hooki PostToolUse** – każdorazowo po sukcesie narzędzia uruchamiaj `npm run astro check`, aby mieć pewność, że audyt nie psuje builda.  
- **Archiwizuj raporty** – wyniki Plan Mode zapisuj w repo, aby śledzić trend w czasie.

Dzięki połączeniu Plan Mode i MCP agent AI staje się pełnoprawnym audytorem DevOps, który najpierw planuje zadania, potem zbiera dane z realnych systemów i dostarcza gotową checklistę działań.

## 📚 Dokumentacja i Zasoby

### Oficjalna Dokumentacja
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code/)
- [Astro Documentation](https://docs.astro.build/)

### Powiązane Artykuły
- [Wprowadzenie do Claude Code](/blog/wprowadzenie-do-claude-code)
- [Zaawansowane Techniki Claude Code](/blog/zaawansowane-techniki-claude-code)
