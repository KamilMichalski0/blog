# Documentation Cache

Ten folder zawiera dokumentację techniczną pobraną z Context7, aby nie trzeba było jej pobierać za każdym razem podczas weryfikacji treści blogowych.

## Zawartość

### Astro Documentation

- **astro-view-transitions.md** - Dokumentacja komponentu ClientRouter (View Transitions API)
  - Jak używać `<ClientRouter />` zamiast przestarzałego `<ViewTransitions />`
  - Konfiguracja fallback dla przeglądarek bez wsparcia View Transitions
  - Dyrektywy transition i custom animations

- **astro-content-collections-images.md** - Obsługa obrazów w Content Collections
  - Użycie `image()` helper zamiast `z.string()` dla pól z obrazami
  - Best practices dla schema definition
  - Integracja z `astro:assets` i komponentem `<Image />`

### React Documentation

- **react-useState-lazy-initialization.md** - Lazy initialization w useState
  - Kiedy i dlaczego używać lazy initialization
  - Przykłady z localStorage, sessionStorage, window APIs
  - Optymalizacja komponentów (unikanie dodatkowych re-renderów)
  - Pattern dla Dark Mode Toggle

## Źródła

Wszystkie dokumentacje pochodzą z oficjalnych źródeł:
- **Astro:** `/withastro/docs` (Context7)
- **React:** `/reactjs/react.dev` (Context7)

## Ostatnia aktualizacja

2025-01-24

## Zastosowanie

Używane do weryfikacji merytorycznej postów blogowych na ClaudeCodeLab.
