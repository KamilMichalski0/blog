---
title: "View Transitions w Astro i Claude Code: AI, które pilnuje animacji"
description: "Agent w Plan Mode analizuje layouty Astro, proponuje dyrektywy transition:animate i generuje fallback CSS dla przeglądarek bez wsparcia."
pubDate: "2025-10-22"
heroImage: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop"
tags: ["Astro", "View Transitions", "Claude Code", "Automation"]
draft: false
author: "ClaudeCodeLab"
---

## 1. Podstawy View Transitions w Astro

Z dokumentacji `docs/astro-view-transitions.md` wynika, że aktualny sposób na animacje stron to komponent `<ClientRouter />` importowany z `astro:transitions`. Dodaj go do shared layoutu:

```astro
---
import { ClientRouter } from "astro:transitions";
---
<html lang="pl" transition:name="root">
  <head>
    <ClientRouter fallback="swap" />
    <slot name="head" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

`fallback="swap"` zapewnia natychmiastową zamianę treści tam, gdzie View Transitions API nie jest dostępne.

## 2. Dyrektywy transition:animate

W layoutach możesz dodać dyrektywy, które sterują animacją:

```astro
<main transition:animate="slide">
  <slot />
</main>
```

Lub zdefiniować własną animację w CSS:

```astro
<style is:global>
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  [transition:animate="fade-up"] {
    animation: fade-in-up 0.3s ease-out;
  }
</style>
```

## 3. Analiza layoutów z pomocą Claude Code

Uruchom Claude Code i przejdź w Plan Mode (**Shift+Tab**). Poproś agenta:

```
Plan Mode: think deeply and review which Astro layouts would benefit from view transitions.
```

Extended Thinking (pojedynczy **Tab**) wyszuka sekcje, gdzie przejścia mają sens (np. `src/layouts/BlogLayout.astro`, `src/components/Nav.astro`). Agent wskaże elementy, które warto oznaczyć dyrektywami.

## 4. Generowanie propozycji dyrektyw i fallbacków

W Plan Mode poproś o konkretne sugestie:

```
Think harder and propose transition:animate directives and custom CSS for highlighted layouts. Include fallback for browsers without View Transitions.
```

Claude zaproponuje np. `transition:animate="slide"` dla `main`, `transition:animate="fade-up"` dla hero oraz snippet CSS, który używa `@keyframes`. Ponieważ w Plan Mode agent niczego nie zmienia, możesz spokojnie przejrzeć cechy animacji.

## 5. Wprowadzenie zmian i testy

Wyjdź z Plan Mode, zaakceptuj plan i poproś Claude Code o aplikację zmian:

```
Apply the approved transition directives to BlogLayout.astro, then run npm run build.
```

Jeśli masz skonfigurowane hooki `PostToolUse` (prettier, `astro check`, build), formatowanie i testy uruchomią się automatycznie. W razie błędów agent wyświetli logi.

## 6. Kontrola dostępności

Po wdrożeniu poproś w Plan Mode:

```
Plan Mode: review the updated layout and confirm fallback behavior for browsers without View Transitions.
```

Agent sprawdzi, czy `ClientRouter fallback="swap"` znajduje się w `<head>` i zasugeruje ewentualne poprawki (np. dodatkowe `prefers-reduced-motion` w CSS).

## 7. Najlepsze praktyki

- **Dodawaj `ClientRouter` w jednym miejscu** – unikasz duplikacji.  
- **Plan Mode przed zmianami** – analiza jest bezpieczna i szczegółowa.  
- **Extended Thinking** – generuje kompletne listy dyrektyw i ryzyk (np. konflikty z Tailwind).  
- **Hooki jakości** – `npm run build` + `npm run astro check` po każdej edycji.

Takie połączenie Astro i Claude Code daje CI pipeline, w którym AI nie tylko sugeruje animacje, ale także dba o ich wdrożenie z testami i fallbackami.

## 📚 Dokumentacja i Zasoby

### Oficjalna Dokumentacja
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code/)
- [Astro Documentation](https://docs.astro.build/)

### Powiązane Artykuły
- [Wprowadzenie do Claude Code](/blog/wprowadzenie-do-claude-code)
- [Zaawansowane Techniki Claude Code](/blog/zaawansowane-techniki-claude-code)
