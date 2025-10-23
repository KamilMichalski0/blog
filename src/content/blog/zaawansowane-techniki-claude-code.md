---
title: 'Zaawansowane Techniki Claude Code - Extended Thinking i Plan Mode'
description: 'Poznaj zaawansowane funkcje Claude Code: Plan Mode do bezpiecznego planowania, Extended Thinking dla złożonych zadań i Unix pipelines.'
pubDate: 'Jul 22 2022'
heroImage: '/zaawansowane-hero.jpg'
tags: ['Claude Code', 'Zaawansowane', 'Plan Mode', 'Extended Thinking']
---

Po opanowaniu podstaw Claude Code, czas na zaawansowane techniki, które pozwolą Ci wykorzystać pełen potencjał narzędzia. W tym artykule omówię Plan Mode, Extended Thinking, integrację z Unix pipelines i custom slash commands.

## Plan Mode - Bezpieczne Planowanie Zmian

### Czym Jest Plan Mode?

Plan Mode to tryb "read-only", w którym Claude analizuje kod i planuje zmiany **bez faktycznego ich wprowadzania**. To idealne rozwiązanie dla:

- Refactoringu krytycznych części systemu
- Analiz architektonicznych
- Planning sprintów
- Code reviews przed implementacją

### Uruchomienie Plan Mode

```bash
# Rozpocznij sesję w trybie planowania
claude --plan
```

Lub w trakcie sesji:

```bash
claude
> /plan
```

### Przykład: Planning Dużego Refactoringu

```bash
claude --plan
```

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

### Wyjście z Plan Mode i Wykonanie

Po zatwierdzeniu planu:

```
> /execute
```

Lub zakończ planowanie i przełącz się na normalny tryb:

```
> /exit-plan
```

## Extended Thinking - Dla Złożonych Problemów

### Czym Jest Extended Thinking?

Extended Thinking to tryb, w którym Claude poświęca więcej czasu na przemyślenie problemu przed udzieleniem odpowiedzi. Idealny dla:

- Decyzji architektonicznych
- Rozwiązywania złożonych bugów
- Optymalizacji wydajności
- Design patterns selection

### Aktywacja Extended Thinking

```bash
claude --extended-thinking
```

Lub w sesji:

```
> /think
```

### Przykład: Wybór Architektury

```
> /think

Muszę zdecydować: monorepo czy multi-repo dla naszego systemu
mikroser wisów (5 serwisów, 3 zespoły, CI/CD już jest)

[Claude aktywuje Extended Thinking...]

"Analizuję problem z różnych perspektyw...

🤔 Rozważam strukturę teamów:
- 3 zespoły: Frontend, Backend API, DevOps
- Czy zespoły są autonomiczne czy współdzielą kod?
- Historia: czy były problemy z dependency hell?

🤔 Analizuję deployment patterns:
- CI/CD już istnieje - czy wspiera monorepo?
- Jak często deploye? Daily? Weekly?
- Potrzeba atomic deploys cross-service?

🤔 Techniczne rozważania:
- Shared libraries - ile? Jaka częstotliwość zmian?
- Build times - jak długie obecnie?
- Code ownership - czy jasno zdefiniowane?

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
- Cache buildo w
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

Utwórz plik `.claude/commands/review.md` w swoim projekcie:

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

## Unix Pipelines Integration

Claude Code świetnie działa jako część Unix pipelines:

### Code Review Pipeline

```bash
#!/bin/bash
# review-pipeline.sh

# 1. Get diff
git diff main...feature-branch > diff.txt

# 2. Claude review
cat diff.txt | claude "Review this diff for issues" > review.md

# 3. Check if critical issues found
if grep -q "🔴 Critical" review.md; then
  echo "❌ Critical issues found!"
  cat review.md
  exit 1
fi

echo "✅ Review passed"
```

### Automated Commit Messages

```bash
# Smart commit with AI-generated message
git add .
git diff --staged | claude "Generate concise commit message" > /tmp/msg.txt
git commit -F /tmp/msg.txt
```

### Test Generation Pipeline

```bash
#!/bin/bash
# generate-tests.sh

for file in src/**/*.js; do
  echo "Generating tests for $file..."
  claude "Generate unit tests for $file" > "tests/${file%.js}.test.js"
done
```

### Linting Fix Pipeline

```bash
# Fix all linting issues automatically
npm run lint -- --format json | \
  jq '.[] | .filePath' | \
  xargs -I {} claude "Fix all ESLint issues in {}"
```

## Kombinacje Zaawansowanych Technik

### Plan Mode + Extended Thinking

```bash
claude --plan --extended-thinking
```

Najlepsze dla:
- Wielkie refaktoringi
- Decyzje architektoniczne
- Migration planning

### Extended Thinking + Custom Commands

```bash
# W .claude/commands/architect.md
---
name: architect
extended-thinking: true
---

Analyze system architecture and recommend:
- Design patterns
- Scalability improvements
- Security enhancements
```

## Performance Tips

### 1. Cache Pattern

Claude cachuje context w sesji - wykorzystaj to:

```bash
# Źle - każde wywołanie parsuje cały projekt
claude "Fix bug in auth.js"
claude "Fix bug in user.js"

# Dobrze - jedna sesja, shared context
claude
> Fix bug in auth.js
> Fix bug in user.js
```

### 2. Incremental Changes

```bash
# Zamiast dużych zmian:
claude "Refactor entire app to TypeScript"

# Lepiej etapowo:
claude
> Convert utils.js to TypeScript
> Convert types.js to TypeScript
> Continue with remaining files
```

### 3. Scoped Requests

```bash
# Zbyt szerokie:
claude "Find all bugs"

# Precyzyjne:
claude "Analyze auth middleware for security issues"
```

## Debugging Claude

### Problem: Hallucinations

```bash
# Włącz verbose mode
claude --verbose
```

### Problem: Slow Responses

```bash
# Ogranicz scope
claude --files="src/api/**"
```

### Problem: Incorrect Changes

```bash
# Użyj Plan Mode pierwszy
claude --plan
> Plan refactoring
> /review-plan
> /execute
```

## Podsumowanie

Zaawansowane techniki Claude Code:

✅ **Plan Mode** - bezpieczne planowanie bez ryzyka
✅ **Extended Thinking** - głęboka analiza złożonych problemów
✅ **Custom Commands** - automatyzacja repetitywnych zadań
✅ **Unix Pipelines** - integracja z istniejącymi tools
✅ **Smart Caching** - optymalizacja wydajności

### Next Steps

1. Utwórz własne slash commands dla swojego workflow
2. Eksperymentuj z Plan Mode na production code
3. Integruj Claude z CI/CD pipeline
4. Stwórz team-wide best practices

Jakich zaawansowanych technik używasz? Podziel się w komentarzach! 💡
