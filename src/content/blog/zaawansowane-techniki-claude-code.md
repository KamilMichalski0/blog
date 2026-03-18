---
title: "Claude Code: Plan Mode i Extended Thinking"
description: "Poznaj zaawansowane funkcje Claude Code: Plan Mode do bezpiecznego planowania, Extended Thinking i pracę z narzędziami w terminalu."
pubDate: Jul 22 2022
heroImage: ../../assets/blog/heroes/zaawansowane-techniki-claude-code.jpg
tags: ['Claude Code', 'Zaawansowane', 'Plan Mode', 'Extended Thinking']
readingTime: 4
heroImageAlt: "Ilustracja do artykułu o zaawansowanych technikach pracy z Claude Code"
---




Gdy podstawy Claude Code są już opanowane, warto przejść do technik, które naprawdę porządkują pracę z większym projektem. W tym artykule pokazuję, jak używać Plan Mode, Extended Thinking, potoków unixowych i własnych komend, aby pracować precyzyjniej i bezpieczniej.

## Plan Mode - Bezpieczne Planowanie Zmian

### Czym jest Plan Mode?

[Plan Mode](https://docs.anthropic.com/en/docs/claude-code/plan-mode) to tryb tylko do odczytu, w którym Claude analizuje kod i planuje zmiany **bez ich wykonywania**. Sprawdza się szczególnie przy:

- Refaktoryzacji krytycznych części systemu
- Analiz architektonicznych
- Planowaniu sprintów
- Przeglądzie zmian przed wdrożeniem

### Uruchomienie Plan Mode

Plan Mode aktywujesz przez naciśnięcie **Shift+Tab dwa razy** w trakcie sesji Claude Code.

```bash
# 1. Uruchom Claude Code
claude

# 2. Naciśnij Shift+Tab dwa razy
# Claude przełączy się w Plan Mode
```

W Plan Mode Claude ma dostęp tylko do narzędzi read-only:
- ✅ Read, Glob, Grep (czytanie i wyszukiwanie)
- ✅ Task, TodoRead/TodoWrite (research i planowanie)
- ❌ Edit, Write, Bash (edycja i wykonywanie)

### Wyjście z Plan Mode

Aby wyjść z Plan Mode i wrócić do normalnego trybu, naciśnij **Shift+Tab** ponownie.

### Przykład: Planning Dużego Refactoringu

```bash
# Uruchom Claude Code
claude

# Naciśnij Shift+Tab dwa razy aby aktywować Plan Mode
```

Teraz poproś o analizę:
```
> Przeanalizuj aplikację i zaplanuj refactoring z Redux na Zustand

Claude rozpocznie głęboką analizę:

"Analizuję architekturę state management...

Znalazłem:
- 12 Redux reducers
- 45 Redux actions
- 23 komponenty używające useSelector
- 18 komponentów używających useDispatch

Plan migracji (etapowy):

### Etap 1: Setup (1 dzień)
1. Zainstaluj Zustand: npm install zustand
2. Utwórz store/index.ts z podstawową konfiguracją
3. Dodaj devtools middleware

### Etap 2: Migracja Store (2-3 dni)
1. Przekonwertuj user reducer → useUserStore
   - actions: login, logout, updateProfile
   - selectors: getCurrentUser, isAuthenticated

2. Przekonwertuj cart reducer → useCartStore
   - actions: addItem, removeItem, updateQuantity
   - selectors: getCartItems, getCartTotal

3. [pozostałe reducers...]

### Etap 3: Migracja Komponentów (3-4 dni)
Priorytet: rozpocznij od leaf components (bez children)

1. Komponenty cart (5 plików)
   - CartItem.tsx
   - CartSummary.tsx
   - CartCheckout.tsx

2. Komponenty user (8 plików)
   - UserProfile.tsx
   - UserSettings.tsx
   [...]

### Etap 4: Cleanup (1 dzień)
1. Usuń Redux dependencies
2. Usuń Provider z App.tsx
3. Update dokumentacji

### Ryzyka:
⚠️ Komponenty z nested subscriptions mogą wymagać optymalizacji
⚠️ Redux middleware (logger, saga) trzeba przepisać na Zustand middleware
⚠️ Testy będą wymagały aktualizacji mock store

### Rekomendacja:
Wykonaj migrację feature-by-feature, nie wszystko naraz.
Zacznij od izolowanych modułów (np. Settings page).

Szacowany czas: 7-9 dni roboczych"
```

### Wykonanie Planu

Po przejrzeniu planu w Plan Mode:

1. Naciśnij **Shift+Tab** aby wyjść z Plan Mode
2. Potwierdź wykonanie planu w normalnym trybie
3. Claude wykona zaplanowane zmiany z możliwością zatwierdzania każdego kroku

## Extended Thinking - Dla Złożonych Problemów

### Czym Jest Extended Thinking?

[Extended Thinking](https://docs.anthropic.com/en/docs/claude-code/extended-thinking) to funkcja, w której Claude **głęboko przemyśla problem przed rozpoczęciem działania**, pokazując swój proces myślowy. Jest zasilany przez Claude 3.7 Sonnet i idealny dla:

- Decyzji architektonicznych
- Rozwiązywania złożonych bugów
- Planowania refactoringu
- Wyboru design patterns

### Aktywacja Extended Thinking

Po prostu poproś Claude aby "pomyślał" w swoim promptcie:

```bash
claude

> Pomyśl głęboko o tym problemie i zaplanuj refactoring z Redux na Zustand
```

Możesz kontrolować intensywność myślenia:
- **"think"** - 4,000 tokenów budżetu myślenia
- **"think hard"** lub **"megathink"** - 10,000 tokenów
- **"ultrathink"** lub **"think harder"** - 32,000 tokenów (najdłuższe)

### Przykład: Wybór Architektury

```
> Think deeply: Muszę zdecydować między monorepo a multi-repo
  dla systemu mikroservisów (5 serwisów, 3 zespoły, CI/CD już jest)

[Claude pokazuje swój proces myślowy...]

<thinking>
Analizuję problem z różnych perspektyw...

Rozważam strukturę teamów:
- 3 zespoły: Frontend, Backend API, DevOps
- Czy zespoły są autonomiczne czy współdzielą kod?
- Historia: czy były problemy z dependency hell?

Analizuję deployment patterns:
- CI/CD już istnieje - czy wspiera monorepo?
- Jak często deploye? Daily? Weekly?
- Potrzeba atomic deploys cross-service?

Techniczne rozważania:
- Shared libraries - ile? Jaka częstotliwość zmian?
- Build times - jak długie obecnie?
- Code ownership - czy jasno zdefiniowane?
</thinking>

📊 REKOMENDACJA: Monorepo z Nx/Turborepo

Uzasadnienie:

✅ PRO Monorepo:
1. Atomic changes - zmiana API + konsument w jednym PR
2. Shared types - TypeScript types między serwisami
3. Prostsze code review - widzisz wszystkie zmiany
4. Tool sharing - wspólne ESLint, Prettier, Tsconfig
5. Refactoring - IDE widzi wszystkie użycia

❌ KONTRA:
1. Build cache jest KLUCZOWY - wymaga Nx lub Turborepo
2. CI musi być sprytny - tylko zmienione części
3. Większy repo size - ale Git sparse checkout pomaga

🏗️ Implementacja:

1. **Wybierz tool**: Turborepo (prostszy) vs Nx (więcej features)
   Rekomendacja: Turborepo - lżejszy, łatwiej zacząć

2. **Struktura**:
```
monorepo/
├── apps/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── user-service/
│   └── frontend/
├── packages/
│   ├── shared-types/
│   ├── shared-utils/
│   └── ui-components/
└── tools/
    └── scripts/
```

3. **Package.json**:
```json
{
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "dev": "turbo run dev --parallel"
  }
}
```

4. **Migracja** (etapowa):
   - Tydzień 1: Setup monorepo structure
   - Tydzień 2: Przenieś shared code
   - Tydzień 3-5: Migruj serwisy (jeden per tydzień)
   - Tydzień 6: Cleanup i dokumentacja

⚡ KLUCZOWA ZASADA:
Dodaj `turbo.json` z dependency graph - to zapewni:
- Cache buildów
- Selective testing
- Parallel execution

Alternatywa do rozważenia:
Multi-repo TYLKO jeśli:
- Zespoły są całkowicie autonomiczne
- Deployment są niezależne (różne release cycles)
- Brak shared code między serwisami

Twoje 3 zespoły współpracują = monorepo jest lepszą opcją."
```

## Custom Slash Commands - Automatyzacja Workflow

### Tworzenie Custom Commands

Utwórz plik [`.claude/commands/review.md`](https://docs.anthropic.com/en/docs/claude-code/slash-commands) w swoim projekcie:

```markdown
---
name: review
description: Code review with security focus
---

Review the provided code for:
1. Security vulnerabilities (SQL injection, XSS, etc.)
2. Performance issues
3. Best practices violations
4. Potential bugs

Format output as:
- 🔴 Critical issues
- 🟡 Warnings
- 🟢 Suggestions
```

### Użycie:

```bash
claude
> /review src/api/user-controller.js
```

### Przykład: Release Notes Generator

`.claude/commands/release-notes.md`:

```markdown
---
name: release-notes
description: Generate release notes from git commits
---

Analyze git commits since last release and generate:

## 🎉 New Features
[List new features]

## 🐛 Bug Fixes
[List fixes]

## ⚡ Performance
[List optimizations]

## 📚 Documentation
[List doc updates]

## ⚠️ Breaking Changes
[List breaking changes]

Group by category and use commit messages as base.
```

Użycie:

```bash
git log --since="2 weeks ago" > commits.txt
claude "/release-notes commits.txt"
```

## Automatyzacja z Hooks

Claude Code oferuje system **hooków** do automatyzacji pracy. Są to skrypty uruchamiane w odpowiedzi na określone zdarzenia.

### Przykład: Pre-commit Hook

Możesz skonfigurować hook, który automatycznie sprawdza kod przed commitem:

1. Utwórz plik `.claude/hooks/pre-commit.sh`
2. Skonfiguruj w `.claude/settings.json`:

```json
{
  "hooks": {
    "pre-commit": {
      "command": "bash .claude/hooks/pre-commit.sh",
      "blocking": true
    }
  }
}
```

### Automatyczny przegląd zmian

Własne komendy slash mogą pomóc zautomatyzować przegląd zmian:

```markdown
# .claude/commands/review-pr.md
---
name: review-pr
description: Review current branch changes
---

Review all changes in the current branch compared to main.
Focus on:
- Security vulnerabilities
- Performance issues
- Best practices
```

Użycie:
```bash
claude
> /review-pr
```

## Kombinacje Zaawansowanych Technik

### Plan Mode + Extended Thinking

Możesz łączyć Plan Mode z Extended Thinking:

1. Naciśnij **Shift+Tab dwa razy** aby aktywować Plan Mode
2. W swoim promptcie użyj słów kluczowych aktywujących myślenie: "think deeply", "ultrathink", itp.

```
> Think deeply and plan the migration from Redux to Zustand
```

Najlepiej sprawdza się to przy:
- Dużych refaktoryzacjach
- Decyzje architektoniczne
- Planowaniu migracji

### Extended Thinking + własne komendy

Własne komendy slash mogą sugerować użycie Extended Thinking w opisie:

```markdown
# W .claude/commands/architect.md
---
name: architect
description: Deep architectural analysis (uses extended thinking)
---

Think deeply about the system architecture and recommend:
- Design patterns
- Scalability improvements
- Security enhancements
```

## Wskazówki dotyczące pracy

### 1. Używaj Pojedynczej Sesji

Claude zachowuje kontekst w ramach sesji, więc warto to wykorzystać:

```bash
# Źle - wielokrotne uruchomienia
claude
> Fix bug in auth.js
# Zamknij
claude
> Fix bug in user.js
# Zamknij

# Dobrze - jedna sesja, wspólny kontekst
claude
> Fix bug in auth.js
> Fix bug in user.js
> Continue with related tasks
```

### 2. Zmiany Etapowe

```bash
# Zamiast dużych zmian na raz:
claude
> Refactor entire app to TypeScript

# Lepiej etapowo:
claude
> Convert utils.js to TypeScript
# Po zakończeniu:
> Now convert types.js to TypeScript
# Po zakończeniu:
> Continue with remaining files
```

### 3. Precyzyjne zadania

```bash
# Zbyt szerokie zadanie:
claude
> Find all bugs

# Precyzyjne i osiągalne:
claude
> Analyze the auth middleware in src/api/auth.js for security issues
```

## Rozwiązywanie Problemów

### Problem: Nieprawidłowe Sugestie

Jeśli Claude generuje nieprawidłowy kod:

1. **Użyj Plan Mode** - Naciśnij Shift+Tab dwa razy, aby najpierw zaplanować zmiany bez ich wykonywania
2. **Przejrzyj plan** i zatwierdź lub odrzuć
3. **Wyjdź z Plan Mode** (Shift+Tab) i wykonaj zatwierdzone zmiany

### Problem: Wolne Odpowiedzi

Ogranicz zakres pracy Claude:

```bash
claude
> Analyze only the auth middleware in src/api/auth.js for security issues
```

Zamiast:
```bash
> Find all bugs in the entire codebase  # Zbyt szerokie
```

## Dokumentacja i zasoby

### Oficjalna Dokumentacja
- [Claude Code - Plan Mode](https://docs.anthropic.com/en/docs/claude-code/plan-mode)
- [Claude Code - Extended Thinking](https://docs.anthropic.com/en/docs/claude-code/extended-thinking)
- [Claude Code - Slash Commands](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
- [Claude Code - Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks)

### Powiązane Artykuły
- [Plan Mode + Extended Thinking](/blog/plan-mode-extended-thinking-refaktoryzacja)
- [Custom Plugins dla Claude Code](/blog/custom-plugins-claude-code)
- [Hooks i Event-Driven Automation](/blog/hooks-event-automation)
- [7 Scenariuszy Użycia Claude Code](/blog/7-scenariuszy-uzycia-claude-code)

## Podsumowanie

Najważniejsze zaawansowane techniki w Claude Code sprowadzają się do czterech obszarów: planowania, głębszej analizy, automatyzacji powtarzalnych działań i lepszego wykorzystania kontekstu sesji. To właśnie one najbardziej wpływają na jakość pracy przy większych zadaniach.

Jeśli chcesz zacząć rozsądnie, najpierw przetestuj Plan Mode przy refaktoryzacji jednego modułu, potem dodaj jedną własną komendę slash, a dopiero na końcu buduj automatyzację z hookami i integracją z CI/CD. Taka kolejność daje najlepszy efekt bez zbędnego chaosu.
