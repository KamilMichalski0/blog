# 🚀 ClaudeCodeLab Blog & Changelog - Ultra-Szczegółowa Checklist Implementacji

> **Cel**: Implementacja aplikacji blog + changelog według specyfikacji z readme.md
> **Czas realizacji**: 4-6 godzin
> **Poziom szczegółowości**: Atomowe, weryfikowalne kroki
> **Format każdego kroku**: Akcja → Komenda → Weryfikacja → Git commit

---

## 📊 Progress Tracker

| Faza | Nazwa | Kroków | Status | Czas |
|------|-------|--------|--------|------|
| 0 | Pre-Implementation | 10 | ⬜ | 15 min |
| 1 | Inicjalizacja Projektu | 25 | ⬜ | 25 min |
| 2 | Konfiguracje | 30 | ⬜ | 30 min |
| 3 | Styles & Design System | 20 | ⬜ | 25 min |
| 4 | Content Collections Schema | 15 | ⬜ | 20 min |
| 5 | BaseLayout Component | 25 | ⬜ | 35 min |
| 6 | Pozostałe Komponenty | 30 | ⬜ | 40 min |
| 7 | Pages - Blog | 25 | ⬜ | 35 min |
| 8 | Pages - Changelog & Landing | 25 | ⬜ | 30 min |
| 9 | RSS Feed | 10 | ⬜ | 15 min |
| 10 | CLI Scripts | 20 | ⬜ | 25 min |
| 11 | SEO & Analytics | 18 | ⬜ | 25 min |
| 12 | Content Creation | 15 | ⬜ | 30 min |
| 13 | Testing & QA | 40 | ⬜ | 45 min |
| 14 | Deployment | 25 | ⬜ | 30 min |
| **TOTAL** | | **333** | **0%** | **~425 min** |

---

## 📋 PHASE 0: Pre-Implementation (15 min)

**Cel**: Przygotowanie środowiska deweloperskiego i weryfikacja dependencies

### 0.1 Weryfikacja Node.js

- [ ] **[P0.1]** Sprawdź wersję Node.js
  - **Komenda**: `node --version`
  - **Oczekiwany rezultat**: `v18.0.0` lub wyższy
  - **Akcja jeśli fail**: Zainstaluj Node.js z https://nodejs.org
  - **Czas**: 1 min

### 0.2 Weryfikacja npm

- [ ] **[P0.2]** Sprawdź wersję npm
  - **Komenda**: `npm --version`
  - **Oczekiwany rezultat**: `9.0.0` lub wyższy
  - **Akcja jeśli fail**: `npm install -g npm@latest`
  - **Czas**: 1 min

### 0.3 Weryfikacja Git

- [ ] **[P0.3]** Sprawdź wersję Git
  - **Komenda**: `git --version`
  - **Oczekiwany rezultat**: `git version 2.x.x`
  - **Akcja jeśli fail**: Zainstaluj Git z https://git-scm.com
  - **Czas**: 1 min

### 0.4 Git Configuration

- [ ] **[P0.4]** Sprawdź git user.name
  - **Komenda**: `git config --global user.name`
  - **Akcja jeśli puste**: `git config --global user.name "Twoje Imię"`
  - **Czas**: 1 min

- [ ] **[P0.5]** Sprawdź git user.email
  - **Komenda**: `git config --global user.email`
  - **Akcja jeśli puste**: `git config --global user.email "twoj@email.com"`
  - **Czas**: 1 min

### 0.5 VS Code Extensions (opcjonalnie ale zalecane)

- [ ] **[P0.6]** Zainstaluj Astro Extension
  - **VS Code Command**: Extensions → Search "Astro" → Install (astro-build.astro-vscode)
  - **Weryfikacja**: Otwórz Command Palette (Ctrl+Shift+P) → wpisz "Astro" → powinny być komendy
  - **Czas**: 2 min

- [ ] **[P0.7]** Zainstaluj ESLint Extension
  - **VS Code**: Extensions → "ESLint" (dbaeumer.vscode-eslint)
  - **Czas**: 1 min

- [ ] **[P0.8]** Zainstaluj Prettier Extension
  - **VS Code**: Extensions → "Prettier" (esbenp.prettier-vscode)
  - **Czas**: 1 min

- [ ] **[P0.9]** Zainstaluj Tailwind CSS IntelliSense
  - **VS Code**: Extensions → "Tailwind CSS IntelliSense" (bradlc.vscode-tailwindcss)
  - **Czas**: 1 min

### 0.6 Przygotowanie katalogu

- [ ] **[P0.10]** Weryfikacja lokalizacji
  - **Komenda**: `pwd` (Linux/Mac) lub `cd` (Windows)
  - **Oczekiwany rezultat**: `/mnt/c/data/projekty/bonus`
  - **Akcja**: Jeśli w złej lokalizacji: `cd /mnt/c/data/projekty/bonus`
  - **Czas**: 1 min

- [ ] **[P0.11]** Backup istniejącego readme.md
  - **Komenda**: `cp readme.md readme.md.backup`
  - **Weryfikacja**: `ls -la | grep readme`
  - **Czas**: 1 min

- [ ] **[P0.12]** Sprawdź zawartość katalogu
  - **Komenda**: `ls -la`
  - **Oczekiwany rezultat**: Powinien być readme.md, IMPLEMENTATION_CHECKLIST.md
  - **Czas**: 1 min

---

## 🎬 PHASE 1: Inicjalizacja Projektu (25 min)

**Cel**: Utworzenie projektu Astro z blog template, instalacja dependencies, pierwsza weryfikacja

### 1.1 Inicjalizacja Astro

- [ ] **[P1.1]** Utwórz projekt Astro z blog template
  - **Komenda**: `npm create astro@latest . -- --template blog --typescript strict --git --yes`
  - **Uwaga**: Kropka (`.`) oznacza bieżący katalog
  - **Oczekiwany rezultat**: Pytanie o nadpisanie plików → wybierz "Yes, overwrite"
  - **Czas**: 3 min
  - **Weryfikacja**: `ls -la` powinno pokazać `package.json`, `src/`, `public/`

### 1.2 Weryfikacja package.json

- [ ] **[P1.2]** Otwórz i sprawdź package.json
  - **Komenda**: `cat package.json` lub otwórz w edytorze
  - **Weryfikacja**: Powinny być dependencies: `astro`, `@astrojs/check`, `typescript`
  - **Czas**: 1 min

### 1.3 Instalacja dependencies

- [ ] **[P1.3]** Zainstaluj podstawowe dependencies
  - **Komenda**: `npm install`
  - **Oczekiwany rezultat**: `added X packages`, bez błędów
  - **Weryfikacja**: `node_modules/` powinien istnieć
  - **Czas**: 2 min

### 1.4 Weryfikacja integralności

- [ ] **[P1.4]** Sprawdź czy nie ma vulnerability
  - **Komenda**: `npm audit`
  - **Akcja jeśli Critical/High vulnerabilities**: `npm audit fix`
  - **Czas**: 1 min

### 1.5 Dodanie integracji Tailwind

- [ ] **[P1.5]** Dodaj Tailwind CSS
  - **Komenda**: `npx astro add tailwind --yes`
  - **Oczekiwany rezultat**: `✔ Tailwind CSS integration added`
  - **Weryfikacja**: `package.json` powinien zawierać `@astrojs/tailwind`, `tailwindcss`
  - **Weryfikacja**: Powinien pojawić się `tailwind.config.mjs`
  - **Czas**: 2 min

### 1.6 Dodanie integracji MDX

- [ ] **[P1.6]** Dodaj MDX support
  - **Komenda**: `npx astro add mdx --yes`
  - **Oczekiwany rezultat**: `✔ MDX integration added`
  - **Weryfikacja**: `package.json` powinien zawierać `@astrojs/mdx`
  - **Czas**: 2 min

### 1.7 Dodanie integracji Sitemap

- [ ] **[P1.7]** Dodaj sitemap generation
  - **Komenda**: `npx astro add sitemap --yes`
  - **Oczekiwany rezultat**: `✔ Sitemap integration added`
  - **Weryfikacja**: `package.json` powinien zawierać `@astrojs/sitemap`
  - **Czas**: 2 min

### 1.8 Dodanie RSS i Typography

- [ ] **[P1.8]** Zainstaluj dodatkowe pakiety
  - **Komenda**: `npm install -D @astrojs/rss @tailwindcss/typography`
  - **Oczekiwany rezultat**: `added 2 packages`
  - **Weryfikacja**: Sprawdź `package.json` devDependencies
  - **Czas**: 2 min

### 1.9 Dodanie types dla Node

- [ ] **[P1.9]** Zainstaluj @types/node
  - **Komenda**: `npm install -D @types/node`
  - **Oczekiwany rezultat**: `added 1 package`
  - **Czas**: 1 min

### 1.10 Test build

- [ ] **[P1.10]** Wykonaj testowy build
  - **Komenda**: `npm run build`
  - **Oczekiwany rezultat**: `✓ Completed in XXXms` bez błędów
  - **Weryfikacja**: Katalog `dist/` powinien zostać utworzony
  - **Czas**: 2 min

### 1.11 Test dev server

- [ ] **[P1.11]** Uruchom dev server
  - **Komenda**: `npm run dev`
  - **Oczekiwany rezultat**: `🚀 astro dev ready in XXXms`
  - **URL**: http://localhost:4321
  - **Weryfikacja**: Otwórz w przeglądarce → powinna być strona startowa Astro
  - **Akcja**: Zatrzymaj server (Ctrl+C)
  - **Czas**: 2 min

### 1.12 Git initialization

- [ ] **[P1.12]** Sprawdź czy git został zainicjalizowany
  - **Komenda**: `git status`
  - **Oczekiwany rezultat**: Powinno pokazać status (może być "nothing to commit" lub lista plików)
  - **Akcja jeśli błąd**: `git init`
  - **Czas**: 1 min

### 1.13 Pierwszy commit

- [ ] **[P1.13]** Dodaj wszystkie pliki do staging
  - **Komenda**: `git add .`
  - **Weryfikacja**: `git status` → pliki w staging area
  - **Czas**: 1 min

- [ ] **[P1.14]** Utwórz pierwszy commit
  - **Komenda**:
    ```bash
    git commit -m "chore: initialize Astro project with blog template

- Astro 4.x with TypeScript strict mode
- Integrations: Tailwind, MDX, Sitemap
- Additional: @astrojs/rss, @tailwindcss/typography
- Initial build and dev server verified"
    ```
  - **Weryfikacja**: `git log` → powinien być commit
  - **Czas**: 1 min

### 1.14 Code Review Checkpoint #1

- [ ] **[P1.15]** Review: Czy wszystkie dependencies są zainstalowane?
  - **Sprawdź**: `package.json` dependencies i devDependencies
  - **Sprawdź**: `node_modules/` istnieje i ma >100 folderów
  - **Sprawdź**: Build działa bez warnings
  - **Czas**: 2 min

---

## ⚙️ PHASE 2: Konfiguracje (30 min)

**Cel**: Konfiguracja Astro, Tailwind, TypeScript, linting, formatting

### 2.1 Konfiguracja Astro

- [ ] **[P2.1]** Backup istniejącego astro.config.mjs
  - **Komenda**: `cp astro.config.mjs astro.config.mjs.backup`
  - **Czas**: 1 min

- [ ] **[P2.2]** Otwórz astro.config.mjs w edytorze
  - **Edytor**: VS Code, Vim, lub inny
  - **Czas**: 1 min

- [ ] **[P2.3]** Dodaj/zaktualizuj import statements
  - **Kod**:
    ```javascript
    import { defineConfig } from 'astro/config';
    import mdx from '@astrojs/mdx';
    import sitemap from '@astrojs/sitemap';
    import tailwind from '@astrojs/tailwind';
    ```
  - **Weryfikacja**: Brak czerwonych podkreśleń w VS Code
  - **Czas**: 1 min

- [ ] **[P2.4]** Ustaw site URL
  - **Kod**: `site: 'https://claudecodelab.com',` (lub swoją domenę)
  - **Uwaga**: Będziesz mógł to zmienić później
  - **Czas**: 1 min

- [ ] **[P2.5]** Skonfiguruj integrations
  - **Kod**:
    ```javascript
    integrations: [
      mdx(),
      sitemap(),
      tailwind({
        applyBaseStyles: false, // Używamy własnego global.css
      }),
    ],
    ```
  - **Czas**: 2 min

- [ ] **[P2.6]** Skonfiguruj markdown (syntax highlighting)
  - **Kod**:
    ```javascript
    markdown: {
      shikiConfig: {
        theme: 'github-dark',
        wrap: true,
      },
    },
    ```
  - **Czas**: 1 min

- [ ] **[P2.7]** Ustaw output type
  - **Kod**: `output: 'static',`
  - **Czas**: 1 min

- [ ] **[P2.8]** Skonfiguruj build options
  - **Kod**:
    ```javascript
    build: {
      inlineStylesheets: 'auto',
    },
    ```
  - **Czas**: 1 min

- [ ] **[P2.9]** Weryfikacja syntaxu astro.config.mjs
  - **Komenda**: `npm run build`
  - **Oczekiwany rezultat**: Build sukces
  - **Czas**: 1 min

- [ ] **[P2.10]** Git commit: astro config
  - **Komenda**: `git add astro.config.mjs && git commit -m "feat: configure Astro with site URL and integrations"`
  - **Czas**: 1 min

### 2.2 Konfiguracja Tailwind

- [ ] **[P2.11]** Backup tailwind.config.mjs
  - **Komenda**: `cp tailwind.config.mjs tailwind.config.mjs.backup`
  - **Czas**: 1 min

- [ ] **[P2.12]** Otwórz tailwind.config.mjs
  - **Akcja**: Otwórz w edytorze
  - **Czas**: 1 min

- [ ] **[P2.13]** Ustaw content paths
  - **Kod**: `content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],`
  - **Weryfikacja**: Sprawdź czy ścieżka pokrywa wszystkie pliki
  - **Czas**: 1 min

- [ ] **[P2.14]** Włącz dark mode
  - **Kod**: `darkMode: 'class',`
  - **Uwaga**: To pozwoli na dark mode z klasą .dark na <html>
  - **Czas**: 1 min

- [ ] **[P2.15]** Rozszerz kolory - primary palette
  - **Kod**:
    ```javascript
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#fef2f2',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
          },
        },
      },
    },
    ```
  - **Czas**: 2 min

- [ ] **[P2.16]** Dodaj typography plugin configuration
  - **Kod** (wewnątrz extend):
    ```javascript
    typography: (theme) => ({
      DEFAULT: {
        css: {
          maxWidth: '65ch',
          color: theme('colors.gray.700'),
          a: {
            color: theme('colors.primary.600'),
            '&:hover': {
              color: theme('colors.primary.700'),
            },
          },
        },
      },
      dark: {
        css: {
          color: theme('colors.gray.300'),
          a: {
            color: theme('colors.primary.400'),
            '&:hover': {
              color: theme('colors.primary.300'),
            },
          },
          h1: { color: theme('colors.gray.100') },
          h2: { color: theme('colors.gray.100') },
          h3: { color: theme('colors.gray.100') },
          h4: { color: theme('colors.gray.100') },
          strong: { color: theme('colors.gray.100') },
          code: { color: theme('colors.gray.100') },
        },
      },
    }),
    ```
  - **Czas**: 3 min

- [ ] **[P2.17]** Dodaj typography plugin do plugins array
  - **Kod**: `plugins: [require('@tailwindcss/typography')],`
  - **Czas**: 1 min

- [ ] **[P2.18]** Weryfikacja Tailwind config
  - **Komenda**: `npm run dev` → otwórz localhost:4321
  - **Akcja**: Inspect element → sprawdź czy Tailwind classes się aplikują
  - **Zatrzymaj**: Ctrl+C
  - **Czas**: 2 min

- [ ] **[P2.19]** Git commit: Tailwind config
  - **Komenda**: `git add tailwind.config.mjs && git commit -m "feat: configure Tailwind with dark mode and typography"`
  - **Czas**: 1 min

### 2.3 TypeScript Configuration

- [ ] **[P2.20]** Sprawdź czy tsconfig.json istnieje
  - **Komenda**: `ls -la tsconfig.json`
  - **Oczekiwany rezultat**: Plik istnieje (utworzony przez Astro)
  - **Czas**: 1 min

- [ ] **[P2.21]** Otwórz tsconfig.json
  - **Akcja**: Otwórz w edytorze
  - **Sprawdź**: Czy jest `"strict": true` (powinno być dzięki --typescript strict)
  - **Czas**: 1 min

- [ ] **[P2.22]** (Opcjonalne) Dodaj paths alias
  - **Kod** (jeśli chcesz używać @/ zamiast ../../../):
    ```json
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"]
      }
    }
    ```
  - **Uwaga**: To opcjonalne, ale ułatwia imports
  - **Czas**: 2 min

- [ ] **[P2.23]** Weryfikacja TypeScript
  - **Komenda**: `npx astro check`
  - **Oczekiwany rezultat**: `0 errors found`
  - **Czas**: 1 min

### 2.4 Prettier Configuration

- [ ] **[P2.24]** Utwórz .prettierrc
  - **Komenda**: `touch .prettierrc` (Linux/Mac) lub `New-Item .prettierrc` (PowerShell)
  - **Czas**: 1 min

- [ ] **[P2.25]** Skonfiguruj Prettier
  - **Kod** (w .prettierrc):
    ```json
    {
      "semi": true,
      "singleQuote": true,
      "tabWidth": 2,
      "trailingComma": "es5",
      "printWidth": 100,
      "plugins": ["prettier-plugin-astro"],
      "overrides": [
        {
          "files": "*.astro",
          "options": {
            "parser": "astro"
          }
        }
      ]
    }
    ```
  - **Czas**: 2 min

- [ ] **[P2.26]** Zainstaluj prettier-plugin-astro
  - **Komenda**: `npm install -D prettier prettier-plugin-astro`
  - **Czas**: 1 min

### 2.5 .gitignore Enhancement

- [ ] **[P2.27]** Otwórz .gitignore
  - **Akcja**: Powinien już istnieć (utworzony przez Astro)
  - **Sprawdź**: Czy zawiera `node_modules/`, `dist/`, `.env`
  - **Czas**: 1 min

- [ ] **[P2.28]** Dodaj dodatkowe reguły (jeśli brakuje)
  - **Kod** (na końcu .gitignore):
    ```
    # Editor
    .vscode/
    .idea/
    *.swp
    *.swo
    *~

    # OS
    .DS_Store
    Thumbs.db

    # Backup files
    *.backup
    *.bak

    # Logs
    *.log
    npm-debug.log*

    # Temporary
    .temp/
    .cache/
    ```
  - **Czas**: 2 min

### 2.6 Code Review Checkpoint #2

- [ ] **[P2.29]** Review: Wszystkie konfiguracje kompletne?
  - **Sprawdź**: astro.config.mjs ma site, integrations, markdown, output, build
  - **Sprawdź**: tailwind.config.mjs ma content, darkMode, theme.extend, plugins
  - **Sprawdź**: tsconfig.json ma strict: true
  - **Sprawdź**: .prettierrc istnieje
  - **Sprawdź**: .gitignore jest kompletny
  - **Czas**: 2 min

- [ ] **[P2.30]** Git commit: All configs
  - **Komenda**:
    ```bash
    git add .
    git commit -m "chore: add TypeScript, Prettier, and enhanced .gitignore

- TypeScript strict mode with path aliases
- Prettier with Astro plugin support
- Enhanced .gitignore for editor, OS, logs"
    ```
  - **Czas**: 1 min

---

## 🎨 PHASE 3: Styles & Design System (25 min)

**Cel**: Utworzenie global styles, CSS variables, utility classes, design tokens

### 3.1 Utworzenie global.css

- [ ] **[P3.1]** Utwórz katalog styles
  - **Komenda**: `mkdir -p src/styles`
  - **Weryfikacja**: `ls src/` → powinien być folder styles
  - **Czas**: 1 min

- [ ] **[P3.2]** Utwórz global.css
  - **Komenda**: `touch src/styles/global.css`
  - **Czas**: 1 min

### 3.2 Tailwind Directives

- [ ] **[P3.3]** Dodaj Tailwind directives
  - **Kod** (na początku global.css):
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```
  - **Uwaga**: To musi być na początku pliku
  - **Czas**: 1 min

### 3.3 CSS Variables (Design Tokens)

- [ ] **[P3.4]** Dodaj CSS variables layer
  - **Kod**:
    ```css
    @layer base {
      :root {
        --color-bg: 250 250 250;
        --color-text: 23 23 23;
      }

      .dark {
        --color-bg: 23 23 23;
        --color-text: 250 250 250;
      }

      body {
        @apply bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text))] transition-colors;
      }
    }
    ```
  - **Czas**: 3 min

- [ ] **[P3.5]** Weryfikacja CSS variables
  - **Akcja**: Otwórz DevTools → Computed → sprawdź --color-bg i --color-text
  - **Komenda**: `npm run dev` → localhost:4321
  - **Zatrzymaj**: Ctrl+C po weryfikacji
  - **Czas**: 2 min

### 3.4 Component Utilities

- [ ] **[P3.6]** Dodaj .btn-primary utility
  - **Kod** (w @layer components):
    ```css
    @layer components {
      .btn-primary {
        @apply px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg
               hover:bg-primary-700 transition-colors duration-200
               focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
      }
    }
    ```
  - **Czas**: 2 min

- [ ] **[P3.7]** Dodaj .btn-secondary utility
  - **Kod** (w tym samym @layer components):
    ```css
    .btn-secondary {
      @apply px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100
             font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600
             transition-colors duration-200;
    }
    ```
  - **Czas**: 2 min

- [ ] **[P3.8]** Dodaj .card utility
  - **Kod** (w tym samym @layer components):
    ```css
    .card {
      @apply bg-white dark:bg-gray-800 rounded-xl shadow-md
             border border-gray-200 dark:border-gray-700
             transition-all duration-200 hover:shadow-lg;
    }
    ```
  - **Czas**: 2 min

### 3.5 Accessibility Check

- [ ] **[P3.9]** Weryfikacja contrast ratio dla .btn-primary
  - **Tool**: https://webaim.org/resources/contrastchecker/
  - **Sprawdź**: `#dc2626` (primary-600) na białym tle
  - **Target**: ≥ 4.5:1 dla tekstu normalnego, ≥ 3:1 dla large text
  - **Akcja jeśli fail**: Dostosuj kolory w tailwind.config.mjs
  - **Czas**: 2 min

- [ ] **[P3.10]** Weryfikacja contrast ratio dla dark mode
  - **Sprawdź**: `#ef4444` (primary-400) na ciemnym tle `#171717` (gray-900)
  - **Target**: ≥ 4.5:1
  - **Czas**: 2 min

### 3.6 Test Design System

- [ ] **[P3.11]** Utwórz test page dla design system
  - **Komenda**: `touch src/pages/design-system.astro`
  - **Kod** (prosty test):
    ```astro
    ---
    import '../styles/global.css';
    ---
    <html lang="pl" class="dark">
      <head>
        <meta charset="utf-8" />
        <title>Design System Test</title>
      </head>
      <body class="p-8">
        <h1 class="text-4xl font-bold mb-4">Design System Test</h1>

        <div class="space-y-4">
          <button class="btn-primary">Primary Button</button>
          <button class="btn-secondary">Secondary Button</button>
          <div class="card p-4">Card Component</div>
        </div>

        <script>
          // Toggle dark mode
          document.addEventListener('keydown', (e) => {
            if (e.key === 'd') {
              document.documentElement.classList.toggle('dark');
            }
          });
        </script>
      </body>
    </html>
    ```
  - **Czas**: 3 min

- [ ] **[P3.12]** Test design system w przeglądarce
  - **Komenda**: `npm run dev`
  - **URL**: http://localhost:4321/design-system
  - **Test**: Naciśnij 'd' na klawiaturze → powinien przełączać dark mode
  - **Sprawdź**: Czy btn-primary, btn-secondary, card renderują się poprawnie
  - **Zatrzymaj**: Ctrl+C
  - **Czas**: 3 min

- [ ] **[P3.13]** Usuń test page (lub zostaw na później)
  - **Komenda**: `rm src/pages/design-system.astro` (opcjonalne)
  - **Uwaga**: Możesz zostawić dla późniejszych testów
  - **Czas**: 1 min

### 3.7 Git Commit

- [ ] **[P3.14]** Commit: Design system i global styles
  - **Komenda**:
    ```bash
    git add src/styles/
    git commit -m "feat: add design system with global styles and utilities

- CSS variables for light/dark mode
- Utility classes: btn-primary, btn-secondary, card
- WCAG AA compliant color contrast
- Tailwind @layer structure for better organization"
    ```
  - **Czas**: 1 min

### 3.8 Code Review Checkpoint #3

- [ ] **[P3.15]** Review: Design system kompletny?
  - **Sprawdź**: global.css zawiera @tailwind directives
  - **Sprawdź**: CSS variables dla light/dark mode
  - **Sprawdź**: 3 utility classes (.btn-primary, .btn-secondary, .card)
  - **Sprawdź**: Contrast ratios ≥ 4.5:1
  - **Sprawdź**: Dark mode działa (toggle test)
  - **Czas**: 2 min

---

## 📦 PHASE 4: Content Collections Schema (20 min)

**Cel**: Definicja type-safe schematów dla blog i changelog collections

### 4.1 Utworzenie config.ts

- [ ] **[P4.1]** Utwórz katalog content
  - **Komenda**: `mkdir -p src/content`
  - **Weryfikacja**: `ls src/` → powinien być content/
  - **Czas**: 1 min

- [ ] **[P4.2]** Utwórz config.ts
  - **Komenda**: `touch src/content/config.ts`
  - **Czas**: 1 min

### 4.2 Import dependencies

- [ ] **[P4.3]** Dodaj imports do config.ts
  - **Kod**:
    ```typescript
    import { defineCollection, z } from 'astro:content';
    ```
  - **Czas**: 1 min

### 4.3 Blog Collection Schema

- [ ] **[P4.4]** Zdefiniuj blog collection
  - **Kod**:
    ```typescript
    const blog = defineCollection({
      type: 'content',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        publishDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        heroImage: z.string().optional(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
        author: z.string().default('ClaudeCodeLab'),
      }),
    });
    ```
  - **Uwaga**: `z.coerce.date()` automatycznie konwertuje string na Date
  - **Czas**: 3 min

### 4.4 Changelog Collection Schema

- [ ] **[P4.5]** Zdefiniuj changelog collection
  - **Kod**:
    ```typescript
    const changelog = defineCollection({
      type: 'content',
      schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        type: z.enum(['feat', 'fix', 'docs', 'perf', 'other']),
        highlights: z.array(z.string()),
        version: z.string().optional(),
      }),
    });
    ```
  - **Czas**: 2 min

### 4.5 Export collections

- [ ] **[P4.6]** Exportuj collections
  - **Kod**:
    ```typescript
    export const collections = { blog, changelog };
    ```
  - **Czas**: 1 min

### 4.6 Utworzenie przykładowych contentów

- [ ] **[P4.7]** Utwórz katalog blog
  - **Komenda**: `mkdir -p src/content/blog`
  - **Czas**: 1 min

- [ ] **[P4.8]** Utwórz przykładowy post
  - **Komenda**: `touch src/content/blog/example-post.mdx`
  - **Kod**:
    ```mdx
    ---
    title: "Example Blog Post"
    description: "This is a test post to verify Content Collections schema"
    publishDate: "2025-10-22"
    tags: ["test", "example"]
    draft: true
    ---

    # Hello World

    This is a **test post** to verify that Content Collections are working correctly.

    ## Features Tested
    - Frontmatter validation
    - MDX rendering
    - Type safety

    ```typescript
    const greeting = "Hello from Content Collections!";
    console.log(greeting);
    ```

    [Back to blog](/blog)
    ```
  - **Czas**: 3 min

- [ ] **[P4.9]** Utwórz katalog changelog
  - **Komenda**: `mkdir -p src/content/changelog`
  - **Czas**: 1 min

- [ ] **[P4.10]** Utwórz przykładowy changelog entry
  - **Komenda**: `touch src/content/changelog/2025-10-22-test-entry.mdx`
  - **Kod**:
    ```mdx
    ---
    title: "Test Changelog Entry"
    date: "2025-10-22T10:00:00+02:00"
    type: "feat"
    highlights:
      - Content Collections schema implemented
      - Blog and changelog structures defined
      - Type safety with Zod validation
    version: "0.1.0"
    ---

    Initial setup of Content Collections with Zod schemas for type-safe content management.
    ```
  - **Czas**: 2 min

### 4.7 Weryfikacja Schema

- [ ] **[P4.11]** Test: TypeScript check
  - **Komenda**: `npx astro check`
  - **Oczekiwany rezultat**: `0 errors found` lub tylko informacje o Content Collections
  - **Czas**: 1 min

- [ ] **[P4.12]** Test: Build z Content Collections
  - **Komenda**: `npm run build`
  - **Oczekiwany rezultat**: Build sukces
  - **Weryfikacja**: Powinny być komunikaty o content collections: "Content collections built"
  - **Czas**: 2 min

- [ ] **[P4.13]** Weryfikacja types generation
  - **Komenda**: `ls .astro/` → sprawdź czy są wygenerowane typy
  - **Alternatywnie**: Otwórz VS Code → powinien podpowiadać typy dla getCollection('blog')
  - **Czas**: 1 min

### 4.8 Git Commit

- [ ] **[P4.14]** Commit: Content Collections
  - **Komenda**:
    ```bash
    git add src/content/
    git commit -m "feat: add Content Collections schemas for blog and changelog

- Blog schema: title, description, publishDate, updatedDate, heroImage, tags, draft, author
- Changelog schema: title, date, type (feat/fix/docs/perf/other), highlights, version
- Example content files for testing
- Zod validation for type-safe content management"
    ```
  - **Czas**: 1 min

### 4.9 Code Review Checkpoint #4

- [ ] **[P4.15]** Review: Content Collections kompletne?
  - **Sprawdź**: src/content/config.ts istnieje
  - **Sprawdź**: Blog schema ma 8 pól
  - **Sprawdź**: Changelog schema ma 5 pól
  - **Sprawdź**: Example files istnieją w blog/ i changelog/
  - **Sprawdź**: Build działa bez błędów schema validation
  - **Sprawdź**: TypeScript types są generowane (.astro/)
  - **Czas**: 2 min

---

## 🧩 PHASE 5: BaseLayout Component (35 min)

**Cel**: Utworzenie master layoutu z SEO, OG tags, navigation, footer, StickyCTA

### 5.1 Utworzenie layouts directory

- [ ] **[P5.1]** Utwórz katalog layouts
  - **Komenda**: `mkdir -p src/layouts`
  - **Czas**: 1 min

- [ ] **[P5.2]** Utwórz BaseLayout.astro
  - **Komenda**: `touch src/layouts/BaseLayout.astro`
  - **Czas**: 1 min

### 5.2 Props Interface

- [ ] **[P5.3]** Dodaj frontmatter i Props interface
  - **Kod**:
    ```astro
    ---
    import '../styles/global.css';

    interface Props {
      title: string;
      description?: string;
      image?: string;
      publishDate?: Date;
      type?: 'website' | 'article';
    }

    const {
      title,
      description = 'ClaudeCodeLab - Naucz się programować z Claude Code',
      image = '/og-image.jpg',
      publishDate,
      type = 'website',
    } = Astro.props;

    const canonicalURL = new URL(Astro.url.pathname, Astro.site);
    const socialImageURL = new URL(image, Astro.site);
    ---
    ```
  - **Czas**: 3 min

### 5.3 HTML Structure

- [ ] **[P5.4]** Dodaj podstawową strukturę HTML
  - **Kod**:
    ```astro
    <!doctype html>
    <html lang="pl" class="dark">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="generator" content={Astro.generator} />
      </head>
      <body>
        <!-- Content will go here -->
      </body>
    </html>
    ```
  - **Czas**: 2 min

### 5.4 SEO Meta Tags

- [ ] **[P5.5]** Dodaj podstawowe SEO meta tags w <head>
  - **Kod**:
    ```astro
    <!-- SEO -->
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />
    ```
  - **Czas**: 2 min

### 5.5 Open Graph Meta Tags

- [ ] **[P5.6]** Dodaj Open Graph meta tags
  - **Kod**:
    ```astro
    <!-- Open Graph -->
    <meta property="og:type" content={type} />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={socialImageURL} />
    <meta property="og:site_name" content="ClaudeCodeLab" />
    <meta property="og:locale" content="pl_PL" />
    {publishDate && <meta property="article:published_time" content={publishDate.toISOString()} />}
    ```
  - **Czas**: 3 min

### 5.6 Twitter Card Meta Tags

- [ ] **[P5.7]** Dodaj Twitter Card meta tags
  - **Kod**:
    ```astro
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content={canonicalURL} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={socialImageURL} />
    ```
  - **Czas**: 2 min

### 5.7 RSS Link

- [ ] **[P5.8]** Dodaj link do RSS feed
  - **Kod**:
    ```astro
    <!-- RSS -->
    <link rel="alternate" type="application/rss+xml" title="Blog RSS" href="/rss.xml" />
    ```
  - **Czas**: 1 min

### 5.8 Top Banner (Promo Bar)

- [ ] **[P5.9]** Dodaj promo banner w <body>
  - **Kod**:
    ```astro
    <body>
      <!-- Top banner (optional) -->
      <div class="bg-primary-600 text-white text-center py-2 text-sm">
        🎁 <strong>Nowy odcinek bonusowy:</strong> Planowanie z Claude Code
        <a href="/bonus-planowanie" class="underline font-semibold ml-1">Zobacz teraz »</a>
      </div>
    ```
  - **Czas**: 2 min

### 5.9 Navigation

- [ ] **[P5.10]** Dodaj główną nawigację
  - **Kod**:
    ```astro
    <!-- Main navigation -->
    <nav class="border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" class="text-xl font-bold">ClaudeCodeLab</a>
        <div class="flex gap-6">
          <a href="/blog" class="hover:text-primary-600 transition-colors">Blog</a>
          <a href="/changelog" class="hover:text-primary-600 transition-colors">Changelog</a>
          <a href="/kup" class="btn-primary px-4 py-2 text-sm">Kup kurs</a>
        </div>
      </div>
    </nav>
    ```
  - **Czas**: 3 min

### 5.10 Main Content Area

- [ ] **[P5.11]** Dodaj main content z slot
  - **Kod**:
    ```astro
    <!-- Main content -->
    <main class="max-w-4xl mx-auto px-4 py-12">
      <slot />
    </main>
    ```
  - **Uwaga**: `<slot />` to miejsce gdzie będzie wstawiana treść strony
  - **Czas**: 2 min

### 5.11 Footer

- [ ] **[P5.12]** Dodaj footer
  - **Kod**:
    ```astro
    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800 mt-20">
      <div class="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} ClaudeCodeLab. Wszystkie prawa zastrzeżone.</p>
        <p class="mt-2">
          <a href="/blog" class="hover:text-primary-600">Blog</a> ·
          <a href="/changelog" class="hover:text-primary-600 ml-2">Changelog</a> ·
          <a href="/kup" class="hover:text-primary-600 ml-2">Kup kurs</a>
        </p>
      </div>
    </footer>
    ```
  - **Czas**: 2 min

### 5.12 StickyCTA Placeholder

- [ ] **[P5.13]** Dodaj placeholder dla StickyCTA (stworzysz komponent później)
  - **Kod**:
    ```astro
    <!-- Sticky CTA -->
    <!-- <StickyCTA /> -->

    <!-- Analytics (optional) -->
    <!-- <script src="/analytics.js" defer></script> -->
    </body>
    ```
  - **Uwaga**: Zakomentowane, odkomentujesz po stworzeniu komponentu
  - **Czas**: 1 min

### 5.13 Accessibility Check

- [ ] **[P5.14]** Weryfikacja semantic HTML
  - **Sprawdź**: Czy są `<nav>`, `<main>`, `<footer>` (landmarks)
  - **Sprawdź**: Czy linki mają dostępny tekst (nie tylko ikony)
  - **Sprawdź**: Czy nie ma pustych href
  - **Czas**: 2 min

- [ ] **[P5.15]** Weryfikacja keyboard navigation
  - **Test**: Naciśnij Tab → powinieneś móc przejść przez wszystkie linki
  - **Test**: Naciśnij Enter na linku → powinien działać
  - **Czas**: 2 min

### 5.14 Test BaseLayout

- [ ] **[P5.16]** Utwórz test page używającą BaseLayout
  - **Komenda**: `touch src/pages/test-layout.astro`
  - **Kod**:
    ```astro
    ---
    import BaseLayout from '../layouts/BaseLayout.astro';
    ---

    <BaseLayout title="Test Layout Page">
      <h1 class="text-4xl font-bold mb-4">Layout Test</h1>
      <p class="text-lg">This is a test page to verify BaseLayout works correctly.</p>
      <div class="card p-6 mt-4">
        <h2 class="text-2xl font-bold mb-2">Card Component</h2>
        <p>This should be styled with the .card utility class.</p>
      </div>
    </BaseLayout>
    ```
  - **Czas**: 2 min

- [ ] **[P5.17]** Test w przeglądarce
  - **Komenda**: `npm run dev`
  - **URL**: http://localhost:4321/test-layout
  - **Sprawdź**: Navigation, content, footer są widoczne
  - **Sprawdź**: Dark mode (klasa .dark na <html>)
  - **Sprawdź**: Meta tags (View Source → <head>)
  - **Zatrzymaj**: Ctrl+C
  - **Czas**: 3 min

- [ ] **[P5.18]** Usuń test page
  - **Komenda**: `rm src/pages/test-layout.astro`
  - **Czas**: 1 min

### 5.15 Git Commit

- [ ] **[P5.19]** Commit: BaseLayout
  - **Komenda**:
    ```bash
    git add src/layouts/
    git commit -m "feat: add BaseLayout with comprehensive SEO and structure

- Full SEO meta tags (title, description, canonical)
- Open Graph tags for social media sharing
- Twitter Card meta tags
- RSS feed link
- Top promo banner
- Main navigation with CTA button
- Semantic HTML (nav, main, footer)
- Keyboard accessible
- Dark mode ready"
    ```
  - **Czas**: 1 min

### 5.16 Code Review Checkpoint #5

- [ ] **[P5.20]** Review: BaseLayout kompletny?
  - **Sprawdź**: Props interface ma 5 pól (title, description, image, publishDate, type)
  - **Sprawdź**: SEO meta tags (min 3: title, description, canonical)
  - **Sprawdź**: Open Graph (min 7 tagów)
  - **Sprawdź**: Twitter Card (min 5 tagów)
  - **Sprawdź**: Navigation działa (linki aktywne)
  - **Sprawdź**: Footer ma copyright + linki
  - **Sprawdź**: Semantic HTML (<nav>, <main>, <footer>)
  - **Sprawdź**: Accessibility (keyboard navigation działa)
  - **Czas**: 3 min

---

---

## 🎨 PHASE 6: Pozostałe Komponenty (40 min)

**Cel**: Utworzenie StickyCTA, BlogCard, ChangelogEntry, VideoEmbed

### 6.1 StickyCTA Component

- [ ] **[P6.1]** Utwórz katalog components
  - **Komenda**: `mkdir -p src/components`
  - **Czas**: 1 min

- [ ] **[P6.2]** Utwórz StickyCTA.astro
  - **Komenda**: `touch src/components/StickyCTA.astro`
  - **Czas**: 1 min

- [ ] **[P6.3]** Dodaj HTML structure dla StickyCTA
  - **Kod**:
    ```astro
    ---
    // Sticky floating CTA button
    ---

    <div class="fixed bottom-6 right-6 z-50">
      <a
        href="/kup"
        class="block px-8 py-4 bg-primary-600 text-white font-bold rounded-full
               shadow-2xl hover:bg-primary-700 hover:scale-105
               transition-all duration-300 animate-pulse"
      >
        🚀 Kup kurs teraz
      </a>
    </div>

    <style>
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.9;
        }
      }

      .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
    </style>
    ```
  - **Czas**: 3 min

- [ ] **[P6.4]** Dodaj StickyCTA do BaseLayout
  - **Akcja**: Otwórz src/layouts/BaseLayout.astro
  - **Znajdź**: `<!-- <StickyCTA /> -->`
  - **Zamień na**:
    ```astro
    ---
    import StickyCTA from '../components/StickyCTA.astro';
    // ... reszta imports
    ---

    <!-- ... w body przed </body> -->
    <StickyCTA />
    ```
  - **Czas**: 2 min

- [ ] **[P6.5]** Test StickyCTA
  - **Komenda**: `npm run dev`
  - **URL**: http://localhost:4321
  - **Sprawdź**: Czy CTA button jest widoczny w prawym dolnym rogu
  - **Sprawdź**: Czy hover działa (scale + color change)
  - **Sprawdź**: Czy animation pulse działa
  - **Sprawdź**: Czy mobilny (zmień szerokość okna) - button powinien być widoczny
  - **Zatrzymaj**: Ctrl+C
  - **Czas**: 3 min

### 6.2 BlogCard Component

- [ ] **[P6.6]** Utwórz BlogCard.astro
  - **Komenda**: `touch src/components/BlogCard.astro`
  - **Czas**: 1 min

- [ ] **[P6.7]** Dodaj Props interface
  - **Kod**:
    ```astro
    ---
    interface Props {
      title: string;
      description?: string;
      publishDate: Date;
      slug: string;
      tags: string[];
    }

    const { title, description, publishDate, slug, tags } = Astro.props;

    const formattedDate = new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(publishDate);
    ---
    ```
  - **Czas**: 3 min

- [ ] **[P6.8]** Dodaj HTML structure dla BlogCard
  - **Kod**:
    ```astro
    <article class="card p-6 hover:scale-[1.02] transition-transform">
      <a href={`/blog/${slug}`} class="block">
        <h2 class="text-2xl font-bold mb-2 hover:text-primary-600 transition-colors">
          {title}
        </h2>
        <time class="text-sm text-gray-600 dark:text-gray-400 block mb-3">
          {formattedDate}
        </time>
        {description && (
          <p class="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
            {description}
          </p>
        )}
        {tags.length > 0 && (
          <div class="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span class="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700
                           text-gray-700 dark:text-gray-300 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </a>
    </article>
    ```
  - **Czas**: 4 min

- [ ] **[P6.9]** Git commit: StickyCTA i BlogCard
  - **Komenda**:
    ```bash
    git add src/components/StickyCTA.astro src/components/BlogCard.astro src/layouts/BaseLayout.astro
    git commit -m "feat: add StickyCTA and BlogCard components

- StickyCTA: fixed floating button with pulse animation
- BlogCard: blog post preview card with title, date, description, tags
- Responsive and accessible design
- Integrated StickyCTA into BaseLayout"
    ```
  - **Czas**: 1 min

### 6.3 ChangelogEntry Component

- [ ] **[P6.10]** Utwórz ChangelogEntry.astro
  - **Komenda**: `touch src/components/ChangelogEntry.astro`
  - **Czas**: 1 min

- [ ] **[P6.11]** Dodaj Props interface i typeConfig
  - **Kod**:
    ```astro
    ---
    interface Props {
      title: string;
      date: Date;
      type: 'feat' | 'fix' | 'docs' | 'perf' | 'other';
      highlights: string[];
      version?: string;
    }

    const { title, date, type, highlights, version } = Astro.props;

    const typeConfig = {
      feat: { label: 'Feature', color: 'bg-green-500' },
      fix: { label: 'Fix', color: 'bg-red-500' },
      docs: { label: 'Docs', color: 'bg-blue-500' },
      perf: { label: 'Performance', color: 'bg-yellow-500' },
      other: { label: 'Other', color: 'bg-gray-500' },
    };

    const config = typeConfig[type];

    const formattedDate = new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
    ---
    ```
  - **Czas**: 3 min

- [ ] **[P6.12]** Dodaj HTML structure dla ChangelogEntry
  - **Kod**:
    ```astro
    <article class="card p-6 mb-6">
      <div class="flex items-start gap-4">
        <span class={`${config.color} text-white text-xs font-bold px-3 py-1 rounded-full uppercase`}>
          {config.label}
        </span>
        {version && (
          <span class="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
            v{version}
          </span>
        )}
      </div>

      <h3 class="text-xl font-bold mt-4 mb-2">{title}</h3>
      <time class="text-sm text-gray-600 dark:text-gray-400 block mb-4">
        {formattedDate}
      </time>

      {highlights.length > 0 && (
        <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
          {highlights.map((highlight) => (
            <li>{highlight}</li>
          ))}
        </ul>
      )}
    </article>
    ```
  - **Czas**: 3 min

### 6.4 VideoEmbed Component

- [ ] **[P6.13]** Utwórz VideoEmbed.astro
  - **Komenda**: `touch src/components/VideoEmbed.astro`
  - **Czas**: 1 min

- [ ] **[P6.14]** Dodaj Props i embed URL logic
  - **Kod**:
    ```astro
    ---
    interface Props {
      videoId: string;
      platform?: 'youtube' | 'vimeo';
      title?: string;
    }

    const { videoId, platform = 'youtube', title = 'Video' } = Astro.props;

    const embedUrl = platform === 'youtube'
      ? `https://www.youtube.com/embed/${videoId}`
      : `https://player.vimeo.com/video/${videoId}`;
    ---

    <div class="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
      <iframe
        src={embedUrl}
        title={title}
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
        class="w-full h-full"
      ></iframe>
    </div>
    ```
  - **Czas**: 3 min

- [ ] **[P6.15]** Git commit: ChangelogEntry i VideoEmbed
  - **Komenda**:
    ```bash
    git add src/components/
    git commit -m "feat: add ChangelogEntry and VideoEmbed components

- ChangelogEntry: colored type badges, version display, highlights list
- VideoEmbed: YouTube/Vimeo support with lazy loading
- Responsive design with aspect-ratio utility"
    ```
  - **Czas**: 1 min

### 6.5 Component Testing

- [ ] **[P6.16]** Utwórz test page dla wszystkich komponentów
  - **Komenda**: `touch src/pages/test-components.astro`
  - **Kod**:
    ```astro
    ---
    import BaseLayout from '../layouts/BaseLayout.astro';
    import BlogCard from '../components/BlogCard.astro';
    import ChangelogEntry from '../components/ChangelogEntry.astro';
    import VideoEmbed from '../components/VideoEmbed.astro';

    const testDate = new Date('2025-10-22');
    ---

    <BaseLayout title="Test Components">
      <h1 class="text-4xl font-bold mb-8">Component Tests</h1>

      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4">BlogCard</h2>
        <BlogCard
          title="Test Blog Post"
          description="This is a test description for the blog card component."
          publishDate={testDate}
          slug="test-post"
          tags={["test", "components"]}
        />
      </section>

      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4">ChangelogEntry</h2>
        <ChangelogEntry
          title="Test Feature Added"
          date={testDate}
          type="feat"
          highlights={[
            "First highlight item",
            "Second highlight item",
            "Third highlight item"
          ]}
          version="1.0.0"
        />
      </section>

      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4">VideoEmbed</h2>
        <VideoEmbed
          videoId="dQw4w9WgXcQ"
          platform="youtube"
          title="Test Video"
        />
      </section>
    </BaseLayout>
    ```
  - **Czas**: 4 min

- [ ] **[P6.17]** Test wszystkich komponentów
  - **Komenda**: `npm run dev`
  - **URL**: http://localhost:4321/test-components
  - **Sprawdź**: BlogCard - czy title, date, description, tags są widoczne i styled
  - **Sprawdź**: ChangelogEntry - czy badge (feat = zielony), highlights list działa
  - **Sprawdź**: VideoEmbed - czy iframe renderuje (może nie załadować video bez internetu)
  - **Sprawdź**: StickyCTA - czy jest widoczny i działa
  - **Sprawdź**: Responsive - zmień szerokość okna
  - **Zatrzymaj**: Ctrl+C
  - **Czas**: 5 min

- [ ] **[P6.18]** Usuń test page
  - **Komenda**: `rm src/pages/test-components.astro`
  - **Czas**: 1 min

### 6.6 Code Review Checkpoint #6

- [ ] **[P6.19]** Review: Wszystkie komponenty kompletne?
  - **Sprawdź**: StickyCTA - fixed position, animation, działa na mobile
  - **Sprawdź**: BlogCard - Props (5 pól), conditional rendering description/tags
  - **Sprawdź**: ChangelogEntry - typeConfig (5 typów), colored badges
  - **Sprawdź**: VideoEmbed - platform detection (youtube/vimeo), lazy loading
  - **Sprawdź**: Wszystkie komponenty mają proper TypeScript interfaces
  - **Sprawdź**: Accessibility - semantic HTML, keyboard accessible links
  - **Czas**: 3 min

---

## 📄 PHASE 7: Blog Pages (35 min)

**Cel**: Implementacja blog listing (/blog) i dynamic post route (/blog/[slug])

### 7.1 Blog Index Page

- [ ] **[P7.1]** Utwórz katalog blog w pages
  - **Komenda**: `mkdir -p src/pages/blog`
  - **Czas**: 1 min

- [ ] **[P7.2]** Utwórz index.astro
  - **Komenda**: `touch src/pages/blog/index.astro`
  - **Czas**: 1 min

- [ ] **[P7.3]** Dodaj imports
  - **Kod**:
    ```astro
    ---
    import { getCollection } from 'astro:content';
    import BaseLayout from '../../layouts/BaseLayout.astro';
    import BlogCard from '../../components/BlogCard.astro';
    ```
  - **Czas**: 1 min

- [ ] **[P7.4]** Fetch i filter blog posts
  - **Kod**:
    ```astro
    const allPosts = await getCollection('blog', ({ data }) => {
      return import.meta.env.PROD ? data.draft !== true : true;
    });
    ```
  - **Uwaga**: W dev mode pokazuje draft, w prod ukrywa
  - **Czas**: 2 min

- [ ] **[P7.5]** Sortowanie po publishDate
  - **Kod**:
    ```astro
    const sortedPosts = allPosts.sort(
      (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
    );
    ---
    ```
  - **Czas**: 1 min

- [ ] **[P7.6]** Dodaj HTML structure
  - **Kod**:
    ```astro
    <BaseLayout
      title="Blog - ClaudeCodeLab"
      description="Artykuły, tutoriale i porady dotyczące programowania z Claude Code"
    >
      <h1 class="text-4xl font-bold mb-8">Blog</h1>

      {sortedPosts.length === 0 ? (
        <p class="text-gray-600 dark:text-gray-400">
          Brak postów. Wkrótce się pojawią!
        </p>
      ) : (
        <div class="grid gap-6">
          {sortedPosts.map((post) => (
            <BlogCard
              title={post.data.title}
              description={post.data.description}
              publishDate={post.data.publishDate}
              slug={post.slug}
              tags={post.data.tags}
            />
          ))}
        </div>
      )}
    </BaseLayout>
    ```
  - **Czas**: 3 min

- [ ] **[P7.7]** Test blog index
  - **Komenda**: `npm run dev`
  - **URL**: http://localhost:4321/blog
  - **Sprawdź**: Czy "example-post" jest widoczny
  - **Sprawdź**: Czy empty state działa (usuń example-post tymczasowo)
  - **Sprawdź**: Czy sortowanie działa (dodaj drugi post z różną datą)
  - **Zatrzymaj**: Ctrl+C
  - **Czas**: 3 min

### 7.2 Blog Post Dynamic Route

- [ ] **[P7.8]** Utwórz [...slug].astro
  - **Komenda**: `touch src/pages/blog/[...slug].astro`
  - **Czas**: 1 min

- [ ] **[P7.9]** Dodaj imports
  - **Kod**:
    ```astro
    ---
    import { getCollection } from 'astro:content';
    import BaseLayout from '../../layouts/BaseLayout.astro';
    ```
  - **Czas**: 1 min

- [ ] **[P7.10]** Implementuj getStaticPaths
  - **Kod**:
    ```astro
    export async function getStaticPaths() {
      const posts = await getCollection('blog');
      return posts.map((post) => ({
        params: { slug: post.slug },
        props: post,
      }));
    }

    const post = Astro.props;
    const { Content } = await post.render();
    ```
  - **Czas**: 2 min

- [ ] **[P7.11]** Dodaj date formatting
  - **Kod**:
    ```astro
    const formattedDate = new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(post.data.publishDate);
    ---
    ```
  - **Czas**: 1 min

- [ ] **[P7.12]** Dodaj HTML structure - header
  - **Kod**:
    ```astro
    <BaseLayout
      title={post.data.title}
      description={post.data.description}
      image={post.data.heroImage}
      publishDate={post.data.publishDate}
      type="article"
    >
      <article>
        <header class="mb-8">
          {post.data.heroImage && (
            <img
              src={post.data.heroImage}
              alt={post.data.title}
              class="w-full h-64 object-cover rounded-xl mb-6"
            />
          )}
          <h1 class="text-4xl font-bold mb-3">{post.data.title}</h1>
          <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <time>{formattedDate}</time>
            {post.data.updatedDate && (
              <span>
                · Zaktualizowano {new Intl.DateTimeFormat('pl-PL').format(post.data.updatedDate)}
              </span>
            )}
          </div>
          {post.data.tags.length > 0 && (
            <div class="flex flex-wrap gap-2 mt-4">
              {post.data.tags.map((tag) => (
                <span class="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
    ```
  - **Czas**: 4 min

- [ ] **[P7.13]** Dodaj MDX content area
  - **Kod**:
    ```astro
        <div class="prose prose-lg dark:prose-dark max-w-none">
          <Content />
        </div>
      </article>
    ```
  - **Czas**: 1 min

- [ ] **[P7.14]** Dodaj back to blog link
  - **Kod**:
    ```astro
      <!-- Back to blog link -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <a href="/blog" class="text-primary-600 hover:text-primary-700 font-medium">
          ← Wróć do bloga
        </a>
      </div>
    </BaseLayout>
    ```
  - **Czas**: 2 min

- [ ] **[P7.15]** Test blog post page
  - **Komenda**: `npm run dev`
  - **URL**: http://localhost:4321/blog/example-post
  - **Sprawdź**: Czy title, date, content są widoczne
  - **Sprawdź**: Czy MDX rendering działa (bold, code blocks)
  - **Sprawdź**: Czy heroImage działa (dodaj do example-post.mdx)
  - **Sprawdź**: Czy tags są widoczne
  - **Sprawdź**: Czy "Wróć do bloga" link działa
  - **Sprawdź**: Czy typography plugin działa (prose classes)
  - **Zatrzymaj**: Ctrl+C
  - **Czas**: 5 min

- [ ] **[P7.16]** Git commit: Blog pages
  - **Komenda**:
    ```bash
    git add src/pages/blog/
    git commit -m "feat: add blog listing and dynamic post pages

- Blog index: filtered, sorted post listing with BlogCard
- Dynamic [slug] route: MDX rendering with full metadata
- Conditional rendering: heroImage, updatedDate, tags
- Typography plugin for content styling
- Back navigation link
- Empty state handling"
    ```
  - **Czas**: 1 min

### 7.3 Code Review Checkpoint #7

- [ ] **[P7.17]** Review: Blog pages kompletne?
  - **Sprawdź**: /blog - lista postów, sortowanie, empty state
  - **Sprawdź**: /blog/[slug] - title, date, content, tags, heroImage (conditional)
  - **Sprawdź**: getStaticPaths generuje routes dla wszystkich postów
  - **Sprawdź**: Draft posts są ukryte w PROD mode
  - **Sprawdź**: MDX rendering działa (headings, code, bold, links)
  - **Sprawdź**: Typography (@tailwindcss/typography) działa
  - **Sprawdź**: Meta tags (OG, Twitter) są poprawne dla article type
  - **Czas**: 3 min

---

## 📝 PHASE 8: Changelog & Landing Pages (30 min)

**Cel**: Implementacja /changelog, /bonus-planowanie, /kup

### 8.1 Changelog Page

- [ ] **[P8.1]** Utwórz changelog.astro
  - **Komenda**: `touch src/pages/changelog.astro`
  - **Czas**: 1 min

- [ ] **[P8.2]** Dodaj imports i fetch
  - **Kod**:
    ```astro
    ---
    import { getCollection } from 'astro:content';
    import BaseLayout from '../layouts/BaseLayout.astro';
    import ChangelogEntry from '../components/ChangelogEntry.astro';

    const allChanges = await getCollection('changelog');
    const sortedChanges = allChanges.sort(
      (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
    );
    ---
    ```
  - **Czas**: 2 min

- [ ] **[P8.3]** Dodaj HTML structure
  - **Kod**:
    ```astro
    <BaseLayout
      title="Changelog - ClaudeCodeLab"
      description="Historia zmian i aktualizacji kursu ClaudeCodeLab"
    >
      <h1 class="text-4xl font-bold mb-8">Changelog</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-12">
        Wszystkie zmiany, nowe funkcje i ulepszenia kursu w jednym miejscu.
      </p>

      {sortedChanges.length === 0 ? (
        <p class="text-gray-600 dark:text-gray-400">
          Brak wpisów w changelogu.
        </p>
      ) : (
        <div>
          {sortedChanges.map((change) => (
            <ChangelogEntry
              title={change.data.title}
              date={change.data.date}
              type={change.data.type}
              highlights={change.data.highlights}
              version={change.data.version}
            />
          ))}
        </div>
      )}
    </BaseLayout>
    ```
  - **Czas**: 3 min

- [ ] **[P8.4]** Test changelog page
  - **Komenda**: `npm run dev`
  - **URL**: http://localhost:4321/changelog
  - **Sprawdź**: Czy example changelog entry jest widoczny
  - **Sprawdź**: Czy colored badge działa (feat = zielony)
  - **Sprawdź**: Czy highlights list jest widoczny
  - **Zatrzymaj**: Ctrl+C
  - **Czas**: 2 min

### 8.2 Bonus Planowanie Landing Page

- [ ] **[P8.5]** Utwórz bonus-planowanie.astro
  - **Komenda**: `touch src/pages/bonus-planowanie.astro`
  - **Czas**: 1 min

- [ ] **[P8.6]** Dodaj imports
  - **Kod**:
    ```astro
    ---
    import BaseLayout from '../layouts/BaseLayout.astro';
    import VideoEmbed from '../components/VideoEmbed.astro';
    ---
    ```
  - **Czas**: 1 min

- [ ] **[P8.7]** Dodaj HTML structure - hero i video
  - **Kod**:
    ```astro
    <BaseLayout
      title="Bonus: Planowanie z Claude Code - ClaudeCodeLab"
      description="Darmowy odcinek bonusowy kursu - naucz się planować projekty z Claude Code"
    >
      <div class="max-w-3xl mx-auto">
        <h1 class="text-4xl font-bold mb-4">🎁 Odcinek bonusowy: Planowanie z Claude Code</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Dowiedz się, jak efektywnie planować sesje kodowania używając Claude Code
        </p>

        <!-- Video -->
        <VideoEmbed
          videoId="dQw4w9WgXcQ"
          platform="youtube"
          title="Planowanie z Claude Code"
        />
    ```
  - **Czas**: 2 min

- [ ] **[P8.8]** Dodaj content sections
  - **Kod**:
    ```astro
        <!-- Content -->
        <div class="mt-12 prose prose-lg dark:prose-dark max-w-none">
          <h2>Co zobaczysz w tym odcinku?</h2>
          <ul>
            <li>Jak przygotować brief przed sesją z Claude</li>
            <li>Jak definiować zakres i cel projektu</li>
            <li>Jak używać TodoWrite do strukturyzowania zadań</li>
            <li>Jak iterować nad planem w trakcie implementacji</li>
            <li>Najczęstsze błędy w planowaniu i jak ich unikać</li>
          </ul>

          <h2>Dla kogo jest ten odcinek?</h2>
          <p>
            Ten bonus jest idealny dla programistów, którzy chcą maksymalnie wykorzystać
            potencjał Claude Code. Pokażę Ci workflow, który sam stosuję przy tworzeniu
            aplikacji - od specyfikacji po deployment.
          </p>

          <h2>Co dalej?</h2>
          <p>
            Jeśli podobał Ci się ten odcinek, sprawdź pełny kurs <strong>ClaudeCodeLab</strong>.
            Dostaniesz:
          </p>
          <ul>
            <li>40+ godzin nagrań video (HD)</li>
            <li>12 projektów od podstaw do wdrożenia</li>
            <li>Dostęp do repozytorium z kodem</li>
            <li>Certyfikat ukończenia</li>
            <li><strong>Gwarancja 30 dni zwrotu pieniędzy</strong></li>
          </ul>

          <div class="not-prose mt-8 text-center">
            <a href="/kup" class="btn-primary text-lg px-12 py-4 inline-block">
              🚀 Kup kurs ze zniżką 30%
            </a>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Użyj kodu <code class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">LISTA30</code> przy zakupie
            </p>
          </div>
        </div>
      </div>
    </BaseLayout>
    ```
  - **Czas**: 4 min

### 8.3 Kup (Purchase) Page

- [ ] **[P8.9]** Utwórz kup.astro
  - **Komenda**: `touch src/pages/kup.astro`
  - **Czas**: 1 min

- [ ] **[P8.10]** Dodaj checkout URL constant
  - **Kod**:
    ```astro
    ---
    import BaseLayout from '../layouts/BaseLayout.astro';

    // Przykładowy URL do checkoutu (podmień na właściwy)
    const checkoutUrl = 'https://checkout.example.com/claudecodelab?coupon=LISTA30';
    ---
    ```
  - **Uwaga**: To będzie trzeba zmienić na real checkout URL
  - **Czas**: 1 min

- [ ] **[P8.11]** Dodaj hero i pricing card
  - **Kod**:
    ```astro
    <BaseLayout
      title="Kup kurs ClaudeCodeLab - Specjalna zniżka 30%"
      description="Dołącz do ClaudeCodeLab i naucz się programować z Claude Code. 30 dni gwarancji zwrotu pieniędzy."
    >
      <div class="max-w-2xl mx-auto text-center">
        <h1 class="text-5xl font-bold mb-6">Dołącz do ClaudeCodeLab</h1>
        <p class="text-2xl text-gray-600 dark:text-gray-400 mb-12">
          Naucz się programować z Claude Code i buduj aplikacje 10x szybciej
        </p>

        <!-- Pricing card -->
        <div class="card p-8 mb-8">
          <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">Specjalna oferta</div>
          <div class="text-5xl font-bold mb-4">
            <span class="line-through text-gray-400">1499 zł</span>
            <span class="text-primary-600 ml-4">1049 zł</span>
          </div>
          <div class="text-lg text-green-600 font-semibold mb-6">
            Oszczędzasz 450 zł (30% zniżki)
          </div>
    ```
  - **Czas**: 3 min

-[ ] **[P8.12]** Dodaj features list z SVG icons
  - **Kod** (kontynuacja):
    ```astro
          <ul class="text-left space-y-3 mb-8">
            <li class="flex items-start">
              <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>40+ godzin materiałów video w HD</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>12 kompleksowych projektów (kod źródłowy)</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Dożywotni dostęp + wszystkie przyszłe aktualizacje</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Certyfikat ukończenia kursu</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span><strong>Gwarancja 30 dni zwrotu pieniędzy</strong></span>
            </li>
          </ul>
    ```
  - **Czas**: 3 min

- [ ] **[P8.13]** Dodaj CTA button i guarantee section
  - **Kod**:
    ```astro
          <a href={checkoutUrl} class="btn-primary text-lg px-12 py-4 inline-block w-full">
            🚀 Kup teraz ze zniżką 30%
          </a>

          <p class="text-xs text-gray-600 dark:text-gray-400 mt-4">
            Kupon <code class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">LISTA30</code>
            zostanie automatycznie zastosowany
          </p>
        </div>

        <!-- Money-back guarantee -->
        <div class="mt-12 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <h3 class="text-xl font-bold mb-2">💚 Gwarancja 30 dni zwrotu pieniędzy</h3>
          <p class="text-gray-700 dark:text-gray-300">
            Jeśli w ciągu 30 dni uznasz, że kurs nie jest dla Ciebie - po prostu napisz,
            a my zwrócimy Ci 100% wpłaconej kwoty. Bez pytań.
          </p>
        </div>
      </div>
    </BaseLayout>
    ```
  - **Czas**: 2 min

### 8.4 Test All Pages

- [ ] **[P8.14]** Test changelog
  - **Komenda**: `npm run dev`
  - **URL**: http://localhost:4321/changelog
  - **Sprawdź**: Entry jest widoczny, badge kolorowy
  - **Czas**: 1 min

- [ ] **[P8.15]** Test bonus-planowanie
  - **URL**: http://localhost:4321/bonus-planowanie
  - **Sprawdź**: Video embed, content sections, CTA button
  - **Czas**: 2 min

- [ ] **[P8.16]** Test kup
  - **URL**: http://localhost:4321/kup
  - **Sprawdź**: Pricing, features list with icons, CTA, guarantee section
  - **Sprawdź**: Responsive (zmień szerokość okna)
  - **Zatrzymaj**: Ctrl+C
  - **Czas**: 2 min

- [ ] **[P8.17]** Git commit: Changelog & Landing pages
  - **Komenda**:
    ```bash
    git add src/pages/
    git commit -m "feat: add changelog, bonus, and purchase pages

- Changelog: sorted entries with colored type badges
- Bonus landing: video embed, content sections, CTA
- Purchase page: pricing card, features list, guarantee section
- All pages responsive and accessible"
    ```
  - **Czas**: 1 min

### 8.5 Code Review Checkpoint #8

- [ ] **[P8.18]** Review: Wszystkie pages kompletne?
  - **Sprawdź**: /changelog - sortowanie, ChangelogEntry rendering
  - **Sprawdź**: /bonus-planowanie - video, content, CTA
  - **Sprawdź**: /kup - pricing, features (5 items), guarantee
  - **Sprawdź**: Wszystkie strony używają BaseLayout
  - **Sprawdź**: SEO meta tags są poprawne
  - **Sprawdź**: Responsive design działa
  - **Czas**: 2 min

---

## 📡 PHASE 9: RSS Feed (15 min)

**Cel**: Implementacja RSS feed dla blog posts

### 9.1 Utworzenie RSS endpoint

- [ ] **[P9.1]** Utwórz rss.xml.js
  - **Komenda**: `touch src/pages/rss.xml.js`
  - **Uwaga**: Extension .js (nie .ts) bo to server endpoint
  - **Czas**: 1 min

### 9.2 Imports i GET function

- [ ] **[P9.2]** Dodaj imports
  - **Kod**:
    ```javascript
    import rss from '@astrojs/rss';
    import { getCollection } from 'astro:content';
    ```
  - **Czas**: 1 min

- [ ] **[P9.3]** Dodaj GET function
  - **Kod**:
    ```javascript
    export async function GET(context) {
      const posts = await getCollection('blog', ({ data }) => {
        return data.draft !== true;
      });
    ```
  - **Uwaga**: Filtrujemy draft posts (jak w blog index)
  - **Czas**: 2 min

### 9.3 Sortowanie i RSS config

- [ ] **[P9.4]** Dodaj sortowanie
  - **Kod**:
    ```javascript
      const sortedPosts = posts.sort(
        (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
      );
    ```
  - **Czas**: 1 min

- [ ] **[P9.5]** Skonfiguruj RSS output
  - **Kod**:
    ```javascript
      return rss({
        title: 'ClaudeCodeLab Blog',
        description: 'Artykuły, tutoriale i porady dotyczące programowania z Claude Code',
        site: context.site,
        items: sortedPosts.map((post) => ({
          title: post.data.title,
          description: post.data.description,
          pubDate: post.data.publishDate,
          link: `/blog/${post.slug}/`,
          author: post.data.author || 'ClaudeCodeLab',
        })),
        customData: '<language>pl-PL</language>',
        stylesheet: '/rss-styles.xsl', // Optional
      });
    }
    ```
  - **Czas**: 3 min

### 9.4 Test RSS Feed

- [ ] **[P9.6]** Test w przeglądarce
  - **Komenda**: `npm run dev`
  - **URL**: http://localhost:4321/rss.xml
  - **Sprawdź**: Czy XML się generuje
  - **Sprawdź**: Czy jest `<?xml version="1.0"?>` na początku
  - **Sprawdź**: Czy są `<item>` elementy dla postów
  - **Zatrzymaj**: Ctrl+C
  - **Czas**: 2 min

- [ ] **[P9.7]** Test z curl
  - **Komenda**: `curl http://localhost:4321/rss.xml` (w nowym terminalu podczas dev server)
  - **Alternatywnie**: Po build: `cat dist/rss.xml`
  - **Sprawdź**: Valid XML structure
  - **Czas**: 1 min

### 9.5 Walidacja RSS

- [ ] **[P9.8]** Walidacja RSS XML
  - **Komenda**: `npm run build`
  - **Sprawdź**: `dist/rss.xml` został utworzony
  - **Online validator**: Skopiuj zawartość dist/rss.xml do https://validator.w3.org/feed/
  - **Oczekiwany rezultat**: "This is a valid RSS feed"
  - **Czas**: 2 min

### 9.6 Git Commit

- [ ] **[P9.9]** Commit: RSS feed
  - **Komenda**:
    ```bash
    git add src/pages/rss.xml.js
    git commit -m "feat: add RSS feed for blog posts

- RSS 2.0 compliant feed
- Filters out draft posts
- Sorted by publishDate descending
- Custom language metadata (pl-PL)
- Author field support"
    ```
  - **Czas**: 1 min

### 9.7 Code Review Checkpoint #9

- [ ] **[P9.10]** Review: RSS feed kompletny?
  - **Sprawdź**: rss.xml.js istnieje w src/pages/
  - **Sprawdź**: GET function exportowana
  - **Sprawdź**: Draft posts są filtrowane
  - **Sprawdź**: Items mają wszystkie pola (title, description, pubDate, link, author)
  - **Sprawdź**: RSS validation passes (W3C validator)
  - **Sprawdź**: Feed działa w RSS readers (Feedly, Inoreader - opcjonalnie)
  - **Czas**: 1 min

---

## 🛠️ PHASE 10: CLI Scripts (25 min)

**Cel**: Stworzenie CLI scripts do tworzenia blog posts i changelog entries

### 10.1 Utworzenie scripts directory

- [ ] **[P10.1]** Utwórz katalog scripts
  - **Komenda**: `mkdir -p scripts`
  - **Weryfikacja**: `ls -la` → scripts/ powinien być widoczny
  - **Czas**: 1 min

### 10.2 new-post.mjs Script

- [ ] **[P10.2]** Utwórz new-post.mjs
  - **Komenda**: `touch scripts/new-post.mjs`
  - **Czas**: 1 min

- [ ] **[P10.3]** Dodaj shebang i imports
  - **Kod**:
    ```javascript
    #!/usr/bin/env node

    import fs from 'fs/promises';
    import path from 'path';
    ```
  - **Czas**: 1 min

- [ ] **[P10.4]** Dodaj argument parsing
  - **Kod**:
    ```javascript
    const args = process.argv.slice(2);
    const title = args[0];

    if (!title) {
      console.error('❌ Błąd: Musisz podać tytuł posta');
      console.log('Użycie: node scripts/new-post.mjs "Tytuł posta"');
      process.exit(1);
    }
    ```
  - **Czas**: 2 min

- [ ] **[P10.5]** Dodaj slug generation
  - **Kod**:
    ```javascript
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const date = new Date().toISOString().split('T')[0];
    const filename = `${date}-${slug}.mdx`;
    const filepath = path.join(process.cwd(), 'src', 'content', 'blog', filename);
    ```
  - **Czas**: 2 min

- [ ] **[P10.6]** Dodaj template string
  - **Kod**:
    ```javascript
    const template = `---
    title: "${title}"
    description: ""
    publishDate: "${date}"
    tags: []
    draft: true
    ---

    Treść posta...

    ## Nagłówek H2

    Paragraf z **bold** i *italic*.

    \`\`\`typescript
    // Przykład kodu
    const hello = "world";
    \`\`\`

    ## Podsumowanie

    [Zobacz bonus »](/bonus-planowanie)
    `;
    ```
  - **Czas**: 2 min

- [ ] **[P10.7]** Dodaj file write logic
  - **Kod**:
    ```javascript
    try {
      // Ensure directory exists
      await fs.mkdir(path.dirname(filepath), { recursive: true });

      // Check if file already exists
      try {
        await fs.access(filepath);
        console.error(`❌ Plik już istnieje: ${filename}`);
        process.exit(1);
      } catch {
        // File doesn't exist, proceed
      }

      await fs.writeFile(filepath, template, 'utf-8');
      console.log(`✅ Utworzono nowy post: ${filename}`);
      console.log(`📝 Edytuj plik: src/content/blog/${filename}`);
    } catch (error) {
      console.error('❌ Błąd podczas tworzenia pliku:', error.message);
      process.exit(1);
    }
    ```
  - **Czas**: 3 min

- [ ] **[P10.8]** Ustaw executable permissions
  - **Komenda**: `chmod +x scripts/new-post.mjs`
  - **Weryfikacja**: `ls -la scripts/` → powinno być `-rwxr-xr-x` lub similar
  - **Czas**: 1 min

### 10.3 new-changelog.mjs Script

- [ ] **[P10.9]** Utwórz new-changelog.mjs
  - **Komenda**: `touch scripts/new-changelog.mjs`
  - **Czas**: 1 min

- [ ] **[P10.10]** Dodaj całą implementację new-changelog.mjs
  - **Kod**:
    ```javascript
    #!/usr/bin/env node

    import fs from 'fs/promises';
    import path from 'path';

    const args = process.argv.slice(2);
    const title = args[0];
    const type = args[1] || 'feat';

    if (!title) {
      console.error('❌ Błąd: Musisz podać tytuł wpisu');
      console.log('Użycie: node scripts/new-changelog.mjs "Tytuł" [type]');
      console.log('Typy: feat, fix, docs, perf, other');
      process.exit(1);
    }

    const validTypes = ['feat', 'fix', 'docs', 'perf', 'other'];
    if (!validTypes.includes(type)) {
      console.error(`❌ Błąd: Nieprawidłowy typ "${type}"`);
      console.log(`Dostępne typy: ${validTypes.join(', ')}`);
      process.exit(1);
    }

    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const timestamp = now.toISOString();

    // Generate filename
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const filename = `${date}-${slug}.mdx`;
    const filepath = path.join(process.cwd(), 'src', 'content', 'changelog', filename);

    const template = `---
    title: "${title}"
    date: "${timestamp}"
    type: "${type}"
    highlights:
      - Pierwsza zmiana
      - Druga zmiana
      - Trzecia zmiana
    version: ""
    ---

    Opcjonalny opis zmian...
    `;

    try {
      await fs.mkdir(path.dirname(filepath), { recursive: true });

      try {
        await fs.access(filepath);
        console.error(`❌ Plik już istnieje: ${filename}`);
        process.exit(1);
      } catch {
        // File doesn't exist, proceed
      }

      await fs.writeFile(filepath, template, 'utf-8');
      console.log(`✅ Utworzono nowy wpis changelog: ${filename}`);
      console.log(`📝 Edytuj plik: src/content/changelog/${filename}`);
    } catch (error) {
      console.error('❌ Błąd podczas tworzenia pliku:', error.message);
      process.exit(1);
    }
    ```
  - **Czas**: 3 min

- [ ] **[P10.11]** Ustaw executable permissions
  - **Komenda**: `chmod +x scripts/new-changelog.mjs`
  - **Czas**: 1 min

### 10.4 package.json Scripts

- [ ] **[P10.12]** Otwórz package.json
  - **Akcja**: Otwórz w edytorze
  - **Czas**: 1 min

- [ ] **[P10.13]** Dodaj npm scripts
  - **Znajdź**: Sekcję `"scripts": {`
  - **Dodaj** (jeśli nie ma):
    ```json
    "new:post": "node scripts/new-post.mjs",
    "new:changelog": "node scripts/new-changelog.mjs"
    ```
  - **Pełny przykład**:
    ```json
    {
      "scripts": {
        "dev": "astro dev",
        "start": "astro dev",
        "build": "astro build",
        "preview": "astro preview",
        "astro": "astro",
        "new:post": "node scripts/new-post.mjs",
        "new:changelog": "node scripts/new-changelog.mjs"
      }
    }
    ```
  - **Czas**: 2 min

### 10.5 Testing CLI Scripts

- [ ] **[P10.14]** Test new:post script
  - **Komenda**: `npm run new:post "Test CLI Post"`
  - **Oczekiwany rezultat**: `✅ Utworzono nowy post: 2025-10-22-test-cli-post.mdx`
  - **Weryfikacja**: `ls src/content/blog/` → plik powinien istnieć
  - **Sprawdź zawartość**: `cat src/content/blog/2025-10-22-test-cli-post.mdx`
  - **Czas**: 2 min

- [ ] **[P10.15]** Test new:changelog script
  - **Komenda**: `npm run new:changelog "Test CLI Changelog" feat`
  - **Oczekiwany rezultat**: `✅ Utworzono nowy wpis changelog: 2025-10-22-test-cli-changelog.mdx`
  - **Weryfikacja**: `ls src/content/changelog/`
  - **Sprawdź zawartość**: `cat src/content/changelog/2025-10-22-test-cli-changelog.mdx`
  - **Czas**: 2 min

- [ ] **[P10.16]** Test error handling - bez argumentu
  - **Komenda**: `npm run new:post`
  - **Oczekiwany rezultat**: `❌ Błąd: Musisz podać tytuł posta`
  - **Czas**: 1 min

- [ ] **[P10.17]** Test error handling - duplikat
  - **Komenda**: `npm run new:post "Test CLI Post"` (ponownie)
  - **Oczekiwany rezultat**: `❌ Plik już istnieje: ...`
  - **Czas**: 1 min

- [ ] **[P10.18]** Cleanup test files
  - **Komenda**:
    ```bash
    rm src/content/blog/2025-10-22-test-cli-post.mdx
    rm src/content/changelog/2025-10-22-test-cli-changelog.mdx
    ```
  - **Czas**: 1 min

### 10.6 Git Commit

- [ ] **[P10.19]** Commit: CLI scripts
  - **Komenda**:
    ```bash
    git add scripts/ package.json
    git commit -m "feat: add CLI scripts for content creation

- new-post.mjs: create blog posts with frontmatter template
- new-changelog.mjs: create changelog entries with type validation
- Slug generation from titles
- File existence checks to prevent overwrites
- npm scripts: new:post and new:changelog
- Error handling and user-friendly messages"
    ```
  - **Czas**: 1 min

### 10.7 Code Review Checkpoint #10

- [ ] **[P10.20]** Review: CLI scripts kompletne?
  - **Sprawdź**: scripts/new-post.mjs istnieje i ma +x permissions
  - **Sprawdź**: scripts/new-changelog.mjs istnieje i ma +x permissions
  - **Sprawdź**: package.json ma new:post i new:changelog scripts
  - **Sprawdź**: Testy przeszły (tworzenie plików działa)
  - **Sprawdź**: Error handling działa (bez args, duplikaty)
  - **Sprawdź**: Slug generation działa (spacje → hyphens, lowercase)
  - **Czas**: 2 min

---

## 🔍 PHASE 11: SEO & Analytics (25 min)

**Cel**: Dodanie robots.txt, OG image, analytics tracking

### 11.1 robots.txt

- [ ] **[P11.1]** Utwórz robots.txt
  - **Komenda**: `touch public/robots.txt`
  - **Czas**: 1 min

- [ ] **[P11.2]** Dodaj robots.txt content
  - **Kod**:
    ```
    User-agent: *
    Allow: /

    Sitemap: https://claudecodelab.com/sitemap-index.xml
    ```
  - **Uwaga**: Zmień URL na swoją domenę
  - **Czas**: 1 min

- [ ] **[P11.3]** Test robots.txt
  - **Komenda**: `npm run build && cat dist/robots.txt`
  - **Weryfikacja**: Plik skopiowany do dist/
  - **Czas**: 1 min

### 11.2 OG Image (Social Media Sharing)

- [ ] **[P11.4]** Przygotuj OG image
  - **Opcja A**: Utwórz w Figma/Canva (1200x630px)
  - **Opcja B**: Użyj placeholder z https://via.placeholder.com/1200x630.png?text=ClaudeCodeLab
  - **Opcja C**: Wygeneruj z AI (Midjourney, DALL-E)
  - **Wymagania**: 1200x630px, <200KB, JPG/PNG
  - **Czas**: 5 min (lub skip jeśli masz gotowy)

- [ ] **[P11.5]** Dodaj OG image do public/
  - **Komenda**: `cp /path/to/your/image.jpg public/og-image.jpg`
  - **Alternatywnie**: `curl https://via.placeholder.com/1200x630.png -o public/og-image.jpg`
  - **Weryfikacja**: `ls public/og-image.jpg`
  - **Czas**: 1 min

- [ ] **[P11.6]** Test OG image
  - **Komenda**: `npm run dev`
  - **URL**: http://localhost:4321/og-image.jpg
  - **Sprawdź**: Image się ładuje
  - **Zatrzymaj**: Ctrl+C
  - **Czas**: 1 min

- [ ] **[P11.7]** Test OG meta tags
  - **Online tool**: https://www.opengraph.xyz/
  - **URL**: Wklej swój local URL (po deploy) lub test na localhost
  - **Sprawdź**: Title, description, image preview
  - **Czas**: 2 min

### 11.3 Analytics Setup

- [ ] **[P11.8]** Utwórz analytics.js
  - **Komenda**: `touch public/analytics.js`
  - **Czas**: 1 min

- [ ] **[P11.9]** Dodaj Google Analytics 4 script
  - **Kod**:
    ```javascript
    // Google Analytics 4
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX'); // ZMIEŃ NA SWÓJ ID

    // Auto-track pageviews
    gtag('event', 'page_view', {
      page_path: window.location.pathname,
    });
    ```
  - **Uwaga**: Zmień `G-XXXXXXXXXX` na swój Google Analytics ID
  - **Czas**: 2 min

- [ ] **[P11.10]** (Opcjonalnie) Dodaj Twitter/X Pixel
  - **Kod** (dodaj do analytics.js):
    ```javascript
    // Twitter/X Pixel (opcjonalnie)
    !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
    },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
    a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
    twq('config','XXXXXXXXX'); // ZMIEŃ NA SWÓJ ID
    ```
  - **Uwaga**: To tylko jeśli masz Twitter Ads account
  - **Czas**: 2 min

- [ ] **[P11.11]** Dodaj custom event functions
  - **Kod** (dodaj do analytics.js):
    ```javascript
    // Custom events
    function trackCTAClick(location) {
      gtag('event', 'cta_click', {
        event_category: 'engagement',
        event_label: location,
      });
      // twq('event', 'tw-xxxxxx-xxxxxx', {}); // Uncomment if using Twitter Pixel
    }

    // Export for use in components
    window.trackCTAClick = trackCTAClick;
    ```
  - **Czas**: 2 min

### 11.4 Integracja Analytics w BaseLayout

- [ ] **[P11.12]** Otwórz BaseLayout.astro
  - **Akcja**: Znajdź `<!-- <script src="/analytics.js" defer></script> -->`
  - **Czas**: 1 min

- [ ] **[P11.13]** Odkomentuj analytics script
  - **Znajdź**: `<!-- <script src="/analytics.js" defer></script> -->`
  - **Zamień na**: `<script is:inline src="/analytics.js"></script>`
  - **Uwaga**: `is:inline` zapobiega bundlowaniu przez Astro
  - **Miejsce**: Przed zamykającym `</body>`
  - **Czas**: 1 min

- [ ] **[P11.14]** (Opcjonalnie) Dodaj CTA tracking do StickyCTA
  - **Otwórz**: src/components/StickyCTA.astro
  - **Znajdź**: `<a href="/kup"`
  - **Dodaj**: `onclick="window.trackCTAClick('sticky_button')"`
  - **Przykład**:
    ```astro
    <a
      href="/kup"
      onclick="window.trackCTAClick && window.trackCTAClick('sticky_button')"
      class="..."
    >
    ```
  - **Czas**: 2 min

### 11.5 Testing Analytics

- [ ] **[P11.15]** Test analytics loading
  - **Komenda**: `npm run dev`
  - **URL**: http://localhost:4321
  - **DevTools**: Console → sprawdź czy nie ma błędów
  - **DevTools**: Network → sprawdź czy analytics.js się ładuje
  - **Zatrzymaj**: Ctrl+C
  - **Czas**: 2 min

- [ ] **[P11.16]** (Opcjonalnie) Test z Google Tag Assistant
  - **Extension**: Zainstaluj Google Tag Assistant (Chrome)
  - **URL**: http://localhost:4321
  - **Sprawdź**: Czy wykrywa GA4 tag (jeśli masz realny ID)
  - **Czas**: 2 min (skip jeśli nie masz GA4)

### 11.6 Git Commit

- [ ] **[P11.17]** Commit: SEO & Analytics
  - **Komenda**:
    ```bash
    git add public/ src/layouts/BaseLayout.astro src/components/StickyCTA.astro
    git commit -m "feat: add SEO assets and analytics tracking

- robots.txt with sitemap reference
- OG image (1200x630px) for social sharing
- Google Analytics 4 implementation
- Custom event tracking (CTA clicks)
- Twitter/X Pixel support (optional)
- Integrated analytics into BaseLayout"
    ```
  - **Czas**: 1 min

### 11.7 Code Review Checkpoint #11

- [ ] **[P11.18]** Review: SEO & Analytics kompletne?
  - **Sprawdź**: public/robots.txt istnieje i ma correct sitemap URL
  - **Sprawdź**: public/og-image.jpg istnieje (1200x630px, <200KB)
  - **Sprawdź**: public/analytics.js istnieje z GA4 config
  - **Sprawdź**: BaseLayout ma analytics script (is:inline)
  - **Sprawdź**: OG preview działa (opengraph.xyz test)
  - **Sprawdź**: Analytics loading works (no console errors)
  - **Czas**: 2 min

---

## ✍️ PHASE 12: Content Creation (30 min)

**Cel**: Stworzenie pierwszego realnego blog posta i changelog entry

### 12.1 Pierwszy Blog Post - Research

- [ ] **[P12.1]** Zdecyduj o temacie pierwszego posta
  - **Sugestie**:
    - "Jak zainstalować i skonfigurować Claude Code"
    - "5 najlepszych praktyk pracy z Claude Code"
    - "Od pomysłu do deploy - workflow z Claude Code"
  - **Wybierz temat**: _________________________
  - **Czas**: 3 min

- [ ] **[P12.2]** Utwórz post używając CLI
  - **Komenda**: `npm run new:post "Twój Wybrany Tytuł"`
  - **Przykład**: `npm run new:post "5 praktyk pracy z Claude Code"`
  - **Weryfikacja**: Plik utworzony w src/content/blog/
  - **Czas**: 1 min

- [ ] **[P12.3]** Otwórz post w edytorze
  - **Akcja**: Otwórz utworzony plik .mdx
  - **Czas**: 1 min

### 12.2 Frontmatter

- [ ] **[P12.4]** Uzupełnij description
  - **Przykład**: `description: "Poznaj 5 sprawdzonych technik które pomogą Ci maksymalnie wykorzystać potencjał Claude Code w codziennej pracy."`
  - **Długość**: 120-160 znaków (SEO optimal)
  - **Czas**: 2 min

- [ ] **[P12.5]** Dodaj tags
  - **Przykład**: `tags: ["claude-code", "best-practices", "workflow", "productivity"]`
  - **Ile**: 3-5 tagów
  - **Czas**: 1 min

- [ ] **[P12.6]** (Opcjonalnie) Dodaj heroImage
  - **Jeśli masz**: `heroImage: "/images/claude-code-hero.jpg"`
  - **Jeśli nie**: Zostaw pusty string lub usuń linię
  - **Czas**: 1 min

- [ ] **[P12.7]** Zmień draft na false (gdy gotowy)
  - **Na razie**: Zostaw `draft: true` (zmienisz przed deploy)
  - **Czas**: 1 min

### 12.3 Content Writing

- [ ] **[P12.8]** Napisz wprowadzenie (intro)
  - **Długość**: 2-3 paragrafy
  - **Zawartość**: Problem, rozwiązanie, co czytelnik zyska
  - **Przykład**:
    ```markdown
    Claude Code rewolucjonizuje sposób w jaki programiści piszą kod. Ale jak wykorzystać go maksymalnie efektywnie?

    W tym artykule podzielę się 5 sprawdzonymi praktykami, które zmieniły mój workflow. Od planowania przez implementację po deployment.

    Niezależnie czy dopiero zaczynasz czy jesteś zaawansowanym użytkownikiem - te techniki pomogą Ci pracować szybciej i mądrzej.
    ```
  - **Czas**: 5 min

- [ ] **[P12.9]** Napisz główną treść (3-5 sekcji)
  - **Struktura**:
    - Nagłówek H2 dla każdej praktyki/sekcji
    - 2-4 paragrafy wyjaśnienia
    - Przykład kodu (jeśli applicable)
    - Tip/Note box (opcjonalnie)
  - **Przykład sekcji**:
    ```markdown
    ## 1. Zacznij od szczegółowego planu

    Przed napisaniem pierwszej linii kodu, zdefiniuj dokładnie co chcesz osiągnąć. Claude Code najlepiej działa gdy ma jasny kontekst.

    **Dobre praktyki:**
    - Napisz brief w formie markdown
    - Określ strukturę plików
    - Wypisz kluczowe funkcjonalności

    ```typescript
    // Przykład: Dobry brief dla Claude Code
    /*
    Cel: System autentykacji użytkownika
    Stack: Next.js, Prisma, JWT
    Features: login, register, password reset
    */
    ```

    Dzięki temu Claude Code od razu wie w jakim kontekście pracuje i może proponować bardziej trafne rozwiązania.
    ```
  - **Czas**: 10 min

- [ ] **[P12.10]** Napisz podsumowanie (conclusion)
  - **Zawartość**: Recap głównych punktów, CTA, next steps
  - **Przykład**:
    ```markdown
    ## Podsumowanie

    Te 5 praktyk pomogły mi zwiększyć produktywność o 50%. Kluczowe wnioski:

    1. Planuj szczegółowo przed kodowaniem
    2. Używaj TodoWrite do śledzenia postępów
    3. Commituj małymi krokami
    4. Testuj na bieżąco
    5. Dokumentuj decyzje w komentarzach

    Chcesz dowiedzieć się więcej? Sprawdź [nasz odcinek bonusowy o planowaniu](/bonus-planowanie) gdzie pokazuję cały proces w praktyce.
    ```
  - **Czas**: 3 min

- [ ] **[P12.11]** Proofreading
  - **Sprawdź**: Ortografia, gramatyka
  - **Sprawdź**: Code examples są poprawne
  - **Sprawdź**: Linki działają
  - **Tool**: Grammarly, LanguageTool, lub manual review
  - **Czas**: 3 min

### 12.4 Pierwszy Changelog Entry

- [ ] **[P12.12]** Utwórz changelog entry
  - **Komenda**: `npm run new:changelog "Dodano pierwszy post bloga" feat`
  - **Weryfikacja**: Plik utworzony
  - **Czas**: 1 min

- [ ] **[P12.13]** Edytuj changelog entry
  - **Otwórz**: Utworzony plik w src/content/changelog/
  - **Zmień highlights**:
    ```yaml
    highlights:
      - Pierwszy post bloga: "5 praktyk pracy z Claude Code"
      - Uzupełniona specyfikacja projektu w README
      - Dodane przykłady kodu w MDX
    ```
  - **Dodaj version** (opcjonalnie): `version: "1.0.0"`
  - **Czas**: 2 min

### 12.5 Preview Content

- [ ] **[P12.14]** Test blog post preview
  - **Komenda**: `npm run dev`
  - **URL**: http://localhost:4321/blog
  - **Sprawdź**: Czy nowy post jest widoczny (draft:true powinno pokazywać w dev)
  - **Kliknij**: Na post card → sprawdź czy pełna treść renderuje
  - **Sprawdź**: MDX rendering (headings, bold, code, links)
  - **Zatrzymaj**: Ctrl+C
  - **Czas**: 2 min

- [ ] **[P12.15]** Test changelog preview
  - **URL**: http://localhost:4321/changelog
  - **Sprawdź**: Czy nowy entry jest widoczny
  - **Sprawdź**: Czy badge "feat" jest zielony
  - **Sprawdź**: Czy highlights się wyświetlają
  - **Czas**: 1 min

### 12.6 Git Commit

- [ ] **[P12.16]** Commit: Initial content
  - **Komenda**:
    ```bash
    git add src/content/
    git commit -m "content: add first blog post and changelog entry

- Blog post: 5 praktyk pracy z Claude Code (draft)
- Changelog: Initial content creation milestone
- Full MDX with code examples and best practices
- SEO optimized description and tags"
    ```
  - **Czas**: 1 min

### 12.7 Code Review Checkpoint #12

- [ ] **[P12.17]** Review: Content kompletny?
  - **Sprawdź**: Blog post ma 800+ słów (good SEO length)
  - **Sprawdź**: Description 120-160 znaków
  - **Sprawdź**: Tags (3-5 sztuk)
  - **Sprawdź**: Intro + 3-5 sekcji + podsumowanie
  - **Sprawdź**: Code examples poprawne
  - **Sprawdź**: Changelog entry z highlights
  - **Sprawdź**: Preview w przeglądarce wygląda dobrze
  - **Czas**: 2 min

---

## 🧪 PHASE 13: Testing & QA (45 min)

**Cel**: Comprehensive testing przed deployment

### 13.1 Build Testing

- [ ] **[P13.1]** Clean build
  - **Komenda**: `rm -rf dist/ .astro/` (cleanup previous builds)
  - **Czas**: 1 min

- [ ] **[P13.2]** Full build test
  - **Komenda**: `npm run build`
  - **Oczekiwany rezultat**: `✓ Completed in XXXms`, zero errors
  - **Sprawdź output**:
    - Content collections built
    - X pages generated
    - Sitemap generated
    - No warnings (lub tylko minor)
  - **Czas**: 2 min

- [ ] **[P13.3]** Weryfikacja dist/ directory
  - **Komenda**: `ls -R dist/` lub `tree dist/` (jeśli masz tree command)
  - **Sprawdź**:
    - `index.html` exists
    - `blog/` directory z postami
    - `changelog/` lub `changelog.html`
    - `bonus-planowanie/` lub `bonus-planowanie.html`
    - `kup/` lub `kup.html`
    - `rss.xml` exists
    - `robots.txt` exists
    - `_astro/` directory (bundled assets)
  - **Czas**: 2 min

- [ ] **[P13.4]** Check bundle sizes
  - **Komenda**: `du -sh dist/` (total size)
  - **Komenda**: `du -sh dist/_astro/*` (individual bundles)
  - **Target**: Total <5MB (dla small blog, większe OK)
  - **Sprawdź**: Czy nie ma gigantycznych plików (>1MB pojedynczo)
  - **Czas**: 1 min

### 13.2 Preview Testing

- [ ] **[P13.5]** Start preview server
  - **Komenda**: `npm run preview`
  - **Oczekiwany rezultat**: `Server running at http://localhost:4321`
  - **Czas**: 1 min

- [ ] **[P13.6]** Test homepage
  - **URL**: http://localhost:4321/
  - **Sprawdź**:
    - Strona ładuje się < 2s
    - Navigation działa
    - Sticky CTA widoczny
    - Linki działają (blog, changelog, kup)
  - **Czas**: 2 min

- [ ] **[P13.7]** Test blog listing
  - **URL**: http://localhost:4321/blog
  - **Sprawdź**:
    - Posty są widoczne (jeśli draft=false)
    - Sortowanie chronologiczne (najnowsze first)
    - BlogCard rendering poprawny
    - Hover states działają
  - **Czas**: 2 min

- [ ] **[P13.8]** Test blog post detail
  - **URL**: http://localhost:4321/blog/[your-post-slug]
  - **Sprawdź**:
    - Title, date, tags widoczne
    - Content rendering (MDX)
    - Code blocks mają syntax highlighting
    - Links w treści działają
    - "Wróć do bloga" link działa
    - Responsive (zmień szerokość okna)
  - **Czas**: 3 min

- [ ] **[P13.9]** Test changelog
  - **URL**: http://localhost:4321/changelog
  - **Sprawdź**:
    - Entries widoczne
    - Colored badges (feat=green, fix=red, etc.)
    - Highlights list renderuje
    - Version badges (jeśli są)
  - **Czas**: 2 min

- [ ] **[P13.10]** Test bonus page
  - **URL**: http://localhost:4321/bonus-planowanie
  - **Sprawdź**:
    - Video embed renderuje (może nie załadować jeśli offline)
    - Content sections widoczne
    - CTA button działa (link do /kup)
    - Typography styling (prose classes)
  - **Czas**: 2 min

- [ ] **[P13.11]** Test purchase page
  - **URL**: http://localhost:4321/kup
  - **Sprawdź**:
    - Pricing widoczny
    - Features list (5 items z icons)
    - CTA button link (checkout URL)
    - Guarantee section widoczna
  - **Czas**: 2 min

- [ ] **[P13.12]** Test RSS feed
  - **URL**: http://localhost:4321/rss.xml
  - **Sprawdź**: Valid XML (no errors w przeglądarce)
  - **Sprawdź**: Items dla postów są obecne
  - **Czas**: 1 min

- [ ] **[P13.13]** Test robots.txt
  - **URL**: http://localhost:4321/robots.txt
  - **Sprawdź**: Content widoczny, sitemap URL correct
  - **Czas**: 1 min

### 13.3 Link Validation

- [ ] **[P13.14]** Test wszystkich internal links
  - **Manual**: Kliknij każdy link w navigation
  - **Sprawdź**:
    - / → homepage
    - /blog → blog listing
    - /changelog → changelog
    - /bonus-planowanie → bonus page
    - /kup → purchase page
    - All links resolve (no 404s)
  - **Czas**: 3 min

- [ ] **[P13.15]** Test back navigation links
  - **Test**: /blog/[slug] → "Wróć do bloga" → /blog
  - **Test**: Navigation logo click → homepage
  - **Czas**: 2 min

### 13.4 Responsive Testing

- [ ] **[P13.16]** Mobile test (375px)
  - **DevTools**: F12 → Responsive mode → 375px width
  - **Sprawdź każdą stronę**:
    - Content nie overflow
    - Navigation działa (może być hamburger menu - currently not implemented, but should fit)
    - Sticky CTA widoczny i nie zakrywa content
    - Images responsive
    - Text readable (min 16px)
  - **Czas**: 5 min

- [ ] **[P13.17]** Tablet test (768px)
  - **DevTools**: 768px width
  - **Sprawdź**: Layout adjusts, content readable
  - **Czas**: 2 min

- [ ] **[P13.18]** Desktop test (1920px)
  - **DevTools**: 1920px width
  - **Sprawdź**: Content nie jest zbyt rozciągnięty (max-width-4xl działa)
  - **Czas**: 1 min

### 13.5 Dark Mode Testing

- [ ] **[P13.19]** Toggle dark mode
  - **Akcja**: DevTools → Console → `document.documentElement.classList.toggle('dark')`
  - **Lub**: Inspect <html> element → add/remove class="dark"
  - **Sprawdź wszystkie strony**:
    - Colors invertują poprawnie
    - Kontrast nadal dobry (text readable)
    - Cards, buttons, links wyglądają dobrze
  - **Czas**: 5 min

### 13.6 Keyboard Navigation

- [ ] **[P13.20]** Test Tab navigation
  - **Akcja**: Kliknij w stronę → naciśnij Tab wielokrotnie
  - **Sprawdź**:
    - Focus visible (outline/ring around elements)
    - Tab order logiczny (top→bottom, left→right)
    - Sticky CTA jest focusable
    - Można dotrzeć do wszystkich interaktywnych elementów
  - **Czas**: 3 min

- [ ] **[P13.21]** Test Enter activation
  - **Akcja**: Tab do linku → naciśnij Enter
  - **Sprawdź**: Link się aktywuje (nawigacja działa)
  - **Czas**: 1 min

### 13.7 Lighthouse Audit

- [ ] **[P13.22]** Lighthouse audit - Homepage
  - **DevTools**: F12 → Lighthouse tab → Generate report
  - **Ustawienia**: Desktop, wszystkie kategorie
  - **Target scores**:
    - Performance: ≥95 (goal), ≥90 (acceptable)
    - Accessibility: 100 (goal), ≥95 (acceptable)
    - Best Practices: 100
    - SEO: 100
  - **Jeśli < target**: Sprawdź recommendations, fix critical issues
  - **Czas**: 3 min

- [ ] **[P13.23]** Lighthouse audit - Blog post
  - **URL**: http://localhost:4321/blog/[your-post]
  - **Sprawdź**: Similar scores jak homepage
  - **Uwaga**: Może być nieco niższy Performance (content-heavy)
  - **Czas**: 2 min

- [ ] **[P13.24]** Lighthouse audit - Mobile
  - **Ustawienia**: Mobile (zamiast Desktop)
  - **URL**: Homepage
  - **Target**: Performance ≥85 (mobile typically lower)
  - **Czas**: 2 min

### 13.8 Accessibility Audit

- [ ] **[P13.25]** WAVE test (opcjonalnie)
  - **Tool**: https://wave.webaim.org/ lub WAVE browser extension
  - **Sprawdź**: Zero errors (warnings OK)
  - **Common issues**: missing alt text, low contrast, missing labels
  - **Czas**: 3 min (skip jeśli nie masz narzędzia)

- [ ] **[P13.26]** Manual accessibility check
  - **Sprawdź**:
    - Images mają alt text (lub są decorative)
    - Headings hierarchical (H1 → H2 → H3, no skipping)
    - Links mają descriptive text (nie "click here")
    - Color contrast ≥4.5:1 dla text
  - **Czas**: 3 min

### 13.9 SEO Meta Validation

- [ ] **[P13.27]** View source check
  - **Akcja**: Prawy klik → View Page Source
  - **Sprawdź <head>**:
    - `<title>` present i unique
    - `<meta name="description">` present
    - `<link rel="canonical">` correct URL
    - OG tags (og:title, og:description, og:image, og:url)
    - Twitter Card tags
  - **Czas**: 2 min

- [ ] **[P13.28]** OG preview test
  - **Tool**: https://www.opengraph.xyz/
  - **Wklej URL**: http://localhost:4321 (nie zadziała dla localhost - test po deploy)
  - **Alternatywnie**: Sprawdź meta tags w source code
  - **Czas**: 1 min (skip dla localhost)

### 13.10 Performance Profiling

- [ ] **[P13.29]** Check page load times
  - **DevTools**: Network tab → Hard refresh (Ctrl+Shift+R)
  - **Sprawdź**:
    - DOMContentLoaded < 1s
    - Load < 2s
    - Total transfer < 1MB (excluding images)
  - **Czas**: 2 min

- [ ] **[P13.30]** Check for render-blocking resources
  - **Lighthouse**: Sprawdź "Opportunities" section
  - **Common issues**: Non-optimized images, unminified CSS/JS
  - **Akcja**: Note dla później (optymalizacja images)
  - **Czas**: 1 min

### 13.11 Zatrzymaj Preview

- [ ] **[P13.31]** Stop preview server
  - **Komenda**: Ctrl+C w terminalu gdzie działa `npm run preview`
  - **Czas**: 1 min

### 13.12 Git Commit

- [ ] **[P13.32]** (Opcjonalnie) Commit test results
  - **Jeśli masz screenshots**: Dodaj do dokumentacji
  - **Lighthouse scores**: Note w commit message lub osobny plik TESTING.md
  - **Komenda**:
    ```bash
    git commit --allow-empty -m "test: comprehensive QA pass completed

- Build successful (0 errors)
- All pages tested and functional
- Responsive design verified (375px, 768px, 1920px)
- Dark mode working correctly
- Keyboard navigation accessible
- Lighthouse scores: Performance 95+, Accessibility 100, SEO 100
- All internal links validated
- RSS feed valid XML"
    ```
  - **Czas**: 2 min

### 13.13 Code Review Checkpoint #13

- [ ] **[P13.33]** Review: Wszystkie testy passed?
  - **Sprawdź**:
    - ✅ Build bez errors
    - ✅ Wszystkie strony działają (homepage, blog, changelog, bonus, kup)
    - ✅ Links działają (no 404s)
    - ✅ Responsive (mobile, tablet, desktop)
    - ✅ Dark mode działa
    - ✅ Keyboard navigation accessible
    - ✅ Lighthouse ≥95/100/100/100 (Performance/Accessibility/Best Practices/SEO)
    - ✅ SEO meta tags complete
  - **Jeśli coś failed**: Wróć i fix przed deployment
  - **Czas**: 3 min

---

## 🚀 PHASE 14: Deployment (30 min)

**Cel**: Deploy aplikacji na Vercel/Netlify z custom domain

### 14.1 Pre-Deployment Preparation

- [ ] **[P14.1]** Finalize content (un-draft posts)
  - **Otwórz**: src/content/blog/[your-post].mdx
  - **Zmień**: `draft: true` → `draft: false`
  - **Komenda**: `npm run build` → sprawdź czy post się pojawia
  - **Czas**: 2 min

- [ ] **[P14.2]** Update site URL w astro.config.mjs
  - **Otwórz**: astro.config.mjs
  - **Zmień**: `site: 'https://claudecodelab.com'` → Twoja domena
  - **Jeśli nie masz domeny**: Zostaw placeholder, zmienisz po deploy
  - **Czas**: 1 min

- [ ] **[P14.3]** Update robots.txt sitemap URL
  - **Otwórz**: public/robots.txt
  - **Zmień**: `Sitemap: https://claudecodelab.com/sitemap-index.xml` → Twoja domena
  - **Czas**: 1 min

- [ ] **[P14.4]** Final build test
  - **Komenda**: `npm run build`
  - **Oczekiwany rezultat**: Success, 0 errors
  - **Czas**: 1 min

### 14.2 Git Repository Setup

- [ ] **[P14.5]** Sprawdź git status
  - **Komenda**: `git status`
  - **Sprawdź**: Czy wszystkie pliki są committed
  - **Akcja jeśli uncommitted**: `git add . && git commit -m "chore: prepare for deployment"`
  - **Czas**: 1 min

- [ ] **[P14.6]** Create GitHub repository
  - **Opcja A - GitHub CLI**: `gh repo create claudecodelab-blog --public --source=. --push`
  - **Opcja B - GitHub Web**:
    1. Idź do https://github.com/new
    2. Repository name: `claudecodelab-blog`
    3. Public/Private: Public (lub Private jeśli wolisz)
    4. **NIE** initialize z README (już masz)
    5. Create repository
  - **Czas**: 2 min

- [ ] **[P14.7]** Add remote i push
  - **Jeśli użyłeś GitHub CLI**: Skip (already pushed)
  - **Jeśli GitHub Web**:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/claudecodelab-blog.git
    git branch -M main
    git push -u origin main
    ```
  - **Weryfikacja**: Odśwież GitHub → pliki powinny być widoczne
  - **Czas**: 2 min

### 14.3 Vercel Deployment (Opcja A - Rekomendowane)

- [ ] **[P14.8]** Zaloguj się do Vercel
  - **URL**: https://vercel.com/login
  - **Akcja**: Login z GitHub account
  - **Czas**: 1 min

- [ ] **[P14.9]** Import projektu
  - **Kliknij**: "Add New..." → "Project"
  - **Kliknij**: "Import Git Repository"
  - **Wybierz**: Twoje repo `claudecodelab-blog`
  - **Czas**: 1 min

- [ ] **[P14.10]** Configure project
  - **Framework Preset**: Powinno auto-detect "Astro"
  - **Build Command**: `npm run build` (auto-filled)
  - **Output Directory**: `dist` (auto-filled)
  - **Install Command**: `npm install` (auto-filled)
  - **Root Directory**: `./` (leave as is)
  - **Czas**: 1 min

- [ ] **[P14.11]** Add Environment Variables (jeśli potrzebne)
  - **Kliknij**: "Environment Variables" (expand)
  - **Dodaj** (jeśli masz):
    - `SITE`: `https://yourdomain.com` (opcjonalne, override astro.config)
    - `GA_ID`: Twój Google Analytics ID (jeśli chcesz via env var)
  - **Dla większości projektów**: Można pominąć
  - **Czas**: 1 min (skip if none)

- [ ] **[P14.12]** Deploy
  - **Kliknij**: "Deploy"
  - **Oczekiwany rezultat**: Building... → Success (2-5 min)
  - **Sprawdź log**: Czy build przeszedł bez errors
  - **Czas**: 5 min (wait for build)

- [ ] **[P14.13]** Sprawdź deployment URL
  - **Akcja**: Kliknij "Visit" lub skopiuj URL
  - **URL**: Będzie wyglądał jak `https://claudecodelab-blog-xyz123.vercel.app`
  - **Sprawdź**: Czy strona się ładuje
  - **Test**: Navigate do /blog, /changelog, /kup
  - **Czas**: 2 min

### 14.4 Custom Domain Setup (Opcjonalnie)

- [ ] **[P14.14]** Dodaj custom domain
  - **Vercel Dashboard**: Project Settings → Domains
  - **Kliknij**: "Add"
  - **Wpisz**: Twoją domenę (np. `claudecodelab.com`)
  - **Kliknij**: "Add"
  - **Czas**: 1 min

- [ ] **[P14.15]** Configure DNS
  - **Vercel pokaże**: DNS records do dodania
  - **Typ A record**: Point to Vercel IP
  - **Lub CNAME**: Point to `cname.vercel-dns.com`
  - **Akcja**: Idź do swojego DNS providera (Cloudflare, Namecheap, etc.)
  - **Dodaj records** jak Vercel pokazuje
  - **Czas**: 5 min

- [ ] **[P14.16]** Wait for SSL certificate
  - **Vercel**: Automatically provisions SSL (Let's Encrypt)
  - **Czas**: 2-10 min (może zająć do kilku minut)
  - **Sprawdź**: Domain status w Vercel → "Valid Configuration"
  - **Czas**: Wait 5-10 min

- [ ] **[P14.17]** Test custom domain
  - **URL**: https://yourdomain.com
  - **Sprawdź**: Czy strona się ładuje
  - **Sprawdź**: Czy SSL działa (🔒 w address bar)
  - **Czas**: 2 min

### 14.5 Alternatywnie: Netlify Deployment (Opcja B)

**Jeśli wolisz Netlify zamiast Vercel:**

- [ ] **[P14.18]** Zaloguj się do Netlify
  - **URL**: https://app.netlify.com/
  - **Login**: Z GitHub account
  - **Czas**: 1 min

- [ ] **[P14.19]** Import projektu
  - **Kliknij**: "Add new site" → "Import an existing project"
  - **Wybierz**: GitHub
  - **Wybierz repo**: `claudecodelab-blog`
  - **Czas**: 1 min

- [ ] **[P14.20]** Configure build settings
  - **Build command**: `npm run build`
  - **Publish directory**: `dist`
  - **Czas**: 1 min

- [ ] **[P14.21]** Deploy
  - **Kliknij**: "Deploy site"
  - **Wait**: 2-5 min dla build
  - **Sprawdź**: Deploy log
  - **Czas**: 5 min

- [ ] **[P14.22]** Test Netlify URL
  - **URL**: `https://random-name-12345.netlify.app`
  - **Sprawdź**: Strona działa
  - **Czas**: 2 min

### 14.6 Post-Deployment Verification

- [ ] **[P14.23]** Test wszystkie routes na produkcji
  - **URLs**:
    - Homepage: `https://yourdomain.com/`
    - Blog: `https://yourdomain.com/blog`
    - Post: `https://yourdomain.com/blog/[your-post]`
    - Changelog: `https://yourdomain.com/changelog`
    - Bonus: `https://yourdomain.com/bonus-planowanie`
    - Kup: `https://yourdomain.com/kup`
    - RSS: `https://yourdomain.com/rss.xml`
    - Robots: `https://yourdomain.com/robots.txt`
  - **Sprawdź**: Wszystkie działają (no 404s)
  - **Czas**: 3 min

- [ ] **[P14.24]** Test analytics na produkcji
  - **Akcja**: Visit strona → DevTools Console
  - **Sprawdź**: Czy analytics.js się ładuje
  - **Sprawdź**: Czy nie ma błędów w console
  - **Google Analytics**: Idź do GA dashboard → Real-Time → sprawdź czy widzi Twoją wizytę
  - **Czas**: 2 min (skip jeśli nie masz GA setup)

- [ ] **[P14.25]** Test OG preview na produkcji
  - **Tool**: https://www.opengraph.xyz/
  - **Wklej**: Twój production URL
  - **Sprawdź**: Title, description, image preview
  - **Alternatywnie**: Share link na Slack/Discord → sprawdź preview
  - **Czas**: 2 min

### 14.7 Google Search Console (Opcjonalnie)

- [ ] **[P14.26]** Add site to Google Search Console
  - **URL**: https://search.google.com/search-console
  - **Kliknij**: "Add property"
  - **Typ**: URL prefix → `https://yourdomain.com`
  - **Weryfikacja**: Via DNS record lub HTML file (follow Google instructions)
  - **Czas**: 5 min (skip jeśli nie chcesz teraz)

- [ ] **[P14.27]** Submit sitemap
  - **W GSC**: Sitemaps → "Add a new sitemap"
  - **URL**: `https://yourdomain.com/sitemap-index.xml`
  - **Kliknij**: Submit
  - **Czas**: 1 min

### 14.8 Final Git Tag

- [ ] **[P14.28]** Create release tag
  - **Komenda**:
    ```bash
    git tag -a v1.0.0 -m "Release v1.0.0 - Initial deployment

- Full blog and changelog system
- SEO optimized with OG tags
- RSS feed
- Analytics tracking
- Deployed to production"
    ```
  - **Czas**: 1 min

- [ ] **[P14.29]** Push tag to GitHub
  - **Komenda**: `git push origin v1.0.0`
  - **Weryfikacja**: GitHub → Releases → tag powinien być widoczny
  - **Czas**: 1 min

### 14.9 Documentation Update

- [ ] **[P14.30]** Update README z production URL
  - **Otwórz**: readme.md
  - **Dodaj na górze** (jeśli chcesz):
    ```markdown
    ## 🌐 Live Demo

    Production: [https://yourdomain.com](https://yourdomain.com)

    ---
    ```
  - **Commit**:
    ```bash
    git add readme.md
    git commit -m "docs: add production URL to README"
    git push
    ```
  - **Czas**: 2 min

### 14.10 Code Review Checkpoint #14 (Final)

- [ ] **[P14.31]** Final review: Deployment sukces?
  - **Sprawdź**:
    - ✅ GitHub repository utworzone i pushed
    - ✅ Vercel/Netlify deployment successful
    - ✅ Production URL działa
    - ✅ Wszystkie routes accessible (blog, changelog, bonus, kup, rss, robots)
    - ✅ SSL certificate active (🔒 https)
    - ✅ Custom domain configured (jeśli applicable)
    - ✅ Analytics tracking na produkcji (jeśli setup)
    - ✅ OG preview działa
    - ✅ Git tagged v1.0.0
  - **Czas**: 3 min

---

## 🎉 CONGRATULATIONS!

**✅ Implementacja kompletna!**

Właśnie ukończyłeś wszystkie 14 faz i **333 kroków** ultra-szczegółowej checklisty implementacji ClaudeCodeLab Blog & Changelog.

### 📊 Podsumowanie

| Faza | Nazwa | Kroków | ✅ Status |
|------|-------|--------|-----------|
| 0 | Pre-Implementation | 10 | ✅ Complete |
| 1 | Inicjalizacja Projektu | 25 | ✅ Complete |
| 2 | Konfiguracje | 30 | ✅ Complete |
| 3 | Styles & Design System | 20 | ✅ Complete |
| 4 | Content Collections Schema | 15 | ✅ Complete |
| 5 | BaseLayout Component | 25 | ✅ Complete |
| 6 | Pozostałe Komponenty | 30 | ✅ Complete |
| 7 | Blog Pages | 25 | ✅ Complete |
| 8 | Changelog & Landing Pages | 25 | ✅ Complete |
| 9 | RSS Feed | 10 | ✅ Complete |
| 10 | CLI Scripts | 20 | ✅ Complete |
| 11 | SEO & Analytics | 18 | ✅ Complete |
| 12 | Content Creation | 17 | ✅ Complete |
| 13 | Testing & QA | 33 | ✅ Complete |
| 14 | Deployment | 31 | ✅ Complete |
| **TOTAL** | | **334** | **100%** |

### 🚀 Co osiągnąłeś:

✅ **Profesjonalną aplikację** z Astro + TypeScript
✅ **Type-safe Content Collections** z Zod validation
✅ **Kompletny design system** z dark mode
✅ **SEO-first architecture** (sitemap, RSS, OG tags)
✅ **Accessibility** (WCAG AA compliant)
✅ **Performance** (Lighthouse 95+)
✅ **CLI tools** do zarządzania contentem
✅ **Production deployment** z SSL
✅ **Analytics tracking** (GA4)

### 🎯 Next Steps (Opcjonalne rozszerzenia):

1. **Newsletter signup** (ConvertKit/Mailchimp integration)
2. **Comments system** (Giscus/Disqus)
3. **Search functionality** (Pagefind/Algolia)
4. **Related posts** recommendation engine
5. **OG image generator** (@vercel/og dla dynamic images)
6. **48h countdown timer** implementation
7. **Multi-language support** (i18n)

### 📚 Resources:

- **Astro Docs**: https://docs.astro.build
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Lighthouse**: https://developers.google.com/web/tools/lighthouse
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

### 💝 Helpful Commands (Quick Reference):

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Content creation
npm run new:post "Title"          # Create blog post
npm run new:changelog "Title" feat # Create changelog entry

# Testing
npx astro check          # TypeScript validation
npm audit                # Security vulnerabilities

# Git
git status               # Check changes
git log --oneline        # View commits
git tag                  # List tags

# Deployment
git push                 # Push to GitHub
vercel --prod            # Deploy to Vercel (if using CLI)
```

---

**Czas realizacji**: ~4-6 godzin (zależnie od prędkości i doświadczenia)

**Status projektu**: 🟢 **PRODUCTION READY**

**Ostatni commit**: v1.0.0 - Production deployment

---

**Gratulacje i powodzenia z projektem! 🎉🚀**
