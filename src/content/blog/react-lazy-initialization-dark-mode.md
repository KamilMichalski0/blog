---
title: "Lazy initialization w React dla przełącznika motywu"
description: Pokazujemy, jak używać lazy initialization w React z uwzględnieniem SSR, cookies, testów A/B i pamięci przeglądarki użytkownika.
pubDate: 2025-10-22
heroImage: ../../assets/blog/heroes/react-lazy-initialization-dark-mode.jpg
tags: ["React","useState","Lazy Initialization","Frontend"]
draft: false
author: ClaudeCodeLab
readingTime: 2
heroImageAlt: "Ilustracja do artykułu o lazy initialization i przełączniku motywu w React"
---




## 1. Dlaczego lazy initialization?

Reactowe `useState` przyjmuje funkcję inicjalizującą, która wykonuje się tylko raz podczas pierwszego renderu. Dokumentacja (`docs/react-useState-lazy-initialization.md`) pokazuje, że to świetny sposób na pobranie motywu z `localStorage` i uniknięcie dodatkowych renderów. Rozszerzmy tę technikę o inne scenariusze.

## 2. Standardowy Dark Mode (localStorage)

```typescript
const [isDark, setIsDark] = useState(() => {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return saved === "dark" || (!saved && prefersDark);
});
```

Pierwszy render od razu zna poprawny motyw, więc nie ma migotania.

## 3. SSR + Hydration

Na serwerze nie mamy `window`. Zabezpiecz się przed tym:

```typescript
const [isDark, setIsDark] = useState(() => {
  if (typeof window === "undefined") {
    return false; // domyślny motyw dla SSR
  }
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return saved === "dark" || (!saved && prefersDark);
});
```

## 4. Cookies (np. multi-device sync)

```typescript
import Cookies from "js-cookie";

const [isDark, setIsDark] = useState(() => {
  if (typeof window === "undefined") return false;
  const cookie = Cookies.get("theme");
  if (cookie) return cookie === "dark";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark;
});

useEffect(() => {
  Cookies.set("theme", isDark ? "dark" : "light", { expires: 365 });
}, [isDark]);
```

Cookie synchronizuje motyw między przeglądarkami i urządzeniami.

## 5. sessionStorage (formularze)

```typescript
const [isDark, setIsDark] = useState(() => {
  if (typeof window === "undefined") return false;
  const saved = sessionStorage.getItem("theme");
  return saved ? saved === "dark" : false;
});

useEffect(() => {
  sessionStorage.setItem("theme", isDark ? "dark" : "light");
}, [isDark]);
```

Przydatne w panelach administracyjnych, gdzie chcesz pamiętać motyw na czas sesji.

## 6. A/B test – przechowywanie wariantu

```typescript
const getVariant = () => {
  if (typeof window === "undefined") return "control";
  const stored = localStorage.getItem("theme_variant");
  if (stored) return stored;
  const variant = Math.random() > 0.5 ? "control" : "experiment";
  localStorage.setItem("theme_variant", variant);
  return variant;
};

const [variant] = useState(getVariant);
const initialDark = variant === "experiment";

const [isDark, setIsDark] = useState(() => {
  if (typeof window === "undefined") return initialDark;
  const saved = localStorage.getItem("theme");
  return saved ? saved === "dark" : initialDark;
});
```

Wariant decyduje o domyślnym motywie, a lazy init gwarantuje, że wylosujesz go tylko raz.

## 7. SSR + klastry CDN (wersja Hermes)

Jeśli odczytujesz dane z `window.__INITIAL_DATA__`, użyj lazy init, by nie dekodować JSON na każdym renderze:

```typescript
const [initialTheme] = useState(() => {
  if (typeof window === "undefined") return "light";
  const data = (window as any).__INITIAL_DATA__;
  return data?.theme ?? "light";
});

const [isDark, setIsDark] = useState(() => initialTheme === "dark");
```

## 8. Podsumowanie

- Zawsze otaczaj kod warunkiem `typeof window !== "undefined"` w środowisku SSR.  
- Lazy initialization zapobiega migotaniu i zbędnym renderom.  
- Zmieniaj storage (`localStorage`, `sessionStorage`, cookies) zależnie od potrzeb biznesowych.  
- Przetwarzanie A/B i danych wstępnych (SSR) to kolejne przypadki, w których funkcja inicjalizująca robi różnicę.

Usprawnione zarządzanie motywem to wyższy komfort użytkownika i mniej pracy nad łagodzeniem efektów ubocznych w interfejsie.

## 📚 Dokumentacja i Zasoby

### Oficjalna Dokumentacja
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code/)
- [Astro Documentation](https://docs.astro.build/)

### Powiązane Artykuły
- [Wprowadzenie do Claude Code](/blog/wprowadzenie-do-claude-code)
- [Zaawansowane Techniki Claude Code](/blog/zaawansowane-techniki-claude-code)
