---
title: "Hooki Claude Code jako lekkie CI dla frontendu"
description: Budujemy zestaw hooków PostToolUse i Stop, które po każdej zmianie formatują kod, uruchamiają testy i przygotowują raport jakości.
pubDate: 2025-10-22
heroImage: ../../assets/blog/heroes/claude-code-hooki-ci-light.jpg
tags: ["Claude Code","Automation","CI/CD","Frontend"]
draft: false
author: ClaudeCodeLab
readingTime: 2
heroImageAlt: "Ilustracja do artykułu o hookach Claude Code używanych jako lekkie CI"
---




## 1. Pomysł na CI light

Zamiast czekać na pipeline serwerowy, możesz użyć hooków Claude Code, by natychmiast po każdej edycji uzyskać:

- formatowanie (`prettier`),  
- `npm run astro check`,  
- `npm run test -- --coverage`,  
- Lighthouse CI (`lhci autorun`),  
- podsumowanie na końcu sesji.

## 2. Hook PostToolUse

W pliku `.claude/settings.json` zdefiniuj:

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
            "command": "npm run test -- --coverage",
            "timeout": 300
          },
          {
            "type": "command",
            "command": "npx lhci autorun --upload.target=temporary-public-storage",
            "timeout": 420
          }
        ]
      }
    ]
  }
}
```

Hooki wykonują się równolegle. W razie błędu Claude pokaże logi (lint, testy, Lighthouse). Warto przekierować „głośne” wyjście do plików log:

```json
{
  "command": "npm run test -- --coverage > .claude/logs/tests.log",
  "timeout": 300
}
```

## 3. Hook Stop – podsumowanie

Dodaj raport na zakończenie sesji:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "tail -n 20 .claude/logs/tests.log && tail -n 20 .lighthouseci/cli-latest-run.json",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

`Stop` uruchamia się, gdy główny agent kończy odpowiedź – idealny moment na syntetyczne podsumowanie.

## 4. Walidacja bezpieczeństwa

Aby uniknąć zmian w wrażliwych plikach:

```json
{
  "type": "command",
  "command": "if echo \"$TOOL_INPUT_file_path\" | grep -q '\\.env'; then echo 'Blocked secret file' >&2 && exit 2; fi",
  "timeout": 5
}
```

`exit 2` blokuje dalszy ciąg operacji i wyświetla komunikat w sesji.

## 5. Workflow pracy

1. **Plan Mode** – zaplanuj zadania (np. refaktoring).  
2. **Wyjdź z Plan Mode** – wydaj polecenie wprowadzające zmiany.  
3. **Hook PostToolUse** – automatycznie formatowanie, lint, testy i Lighthouse.  
4. **Manual review** – agent prezentuje logi, Ty decydujesz.  
5. **Stop hook** – sesja kończy się raportem z testów i audytu dostępności.

## 6. Rady praktyczne

- **Przekieruj logi do katalogu `.claude/logs/`** – łatwo się do nich odwołać w konwersacji.  
- **Limituj timeouty** – `lhci autorun` może trwać dłużej; dostosuj w zależności od projektu.  
- **Dodaj guardraile** – np. `npm run test -- --coverage` tylko, gdy zmieniono pliki `.test.ts`.  
- **Sync z CI** – w docelowym pipeline korzystaj z tych samych komend, aby uniknąć rozjazdów.

Taki zestaw hooków zamienia Claude Code w narzędzie Continuous Integration light – masz natychmiastowy feedback jakościowy bez opuszczania sesji AI.

## 📚 Dokumentacja i Zasoby

### Oficjalna Dokumentacja
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code/)
- [Astro Documentation](https://docs.astro.build/)

### Powiązane Artykuły
- [Wprowadzenie do Claude Code](/blog/wprowadzenie-do-claude-code)
- [Zaawansowane Techniki Claude Code](/blog/zaawansowane-techniki-claude-code)
