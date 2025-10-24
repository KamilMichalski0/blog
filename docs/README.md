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

### Claude Code Documentation

#### Oficjalna Dokumentacja Anthropic

- **claude-code.md** - Oficjalna dokumentacja CLI Claude Code
  - Instalacja i konfiguracja (`npm install -g @anthropic-ai/claude-code`)
  - Zmienne środowiskowe i API keys
  - Slash commands (`/plugin`, `/context`, `/search`)
  - System pluginów i rozszerzeń
  - Git workflow automation
  - Settings i permissions

- **claude-code-developers.md** - Best practices dla developerów
  - Git worktrees dla równoległego developmentu
  - Custom slash commands (`.claude/commands/`)
  - Programmatic usage (headless mode)
  - CLAUDE.md - konfiguracja projektu
  - Pipelining i automatyzacja CI/CD
  - Integracja z VS Code, git hooks, Makefile

- **claude-code-main-site.md** - Główna dokumentacja z anthropic.com
  - Budowanie features, debugging, nawigacja codebase
  - Security features i enterprise deployment
  - AWS Bedrock, Google Vertex AI integration
  - CI/CD workflows i batch processing
  - Use cases: feature development, refactoring, testing

#### SDK Documentation

- **claude-code-sdk-python.md** - Python SDK dla Claude Code
  - Instalacja: `pip install claude-agent-sdk`
  - `query()` function - async queries
  - `ClaudeSDKClient` - bidirectional conversations
  - Custom tools (SDK MCP servers) - in-process tools
  - Hooks system (PreToolUse, PostToolUse)
  - Error handling (CLINotFoundError, ProcessError)
  - End-to-end testing

- **claude-agent-sdk-typescript.md** - TypeScript SDK dla AI Agents
  - Instalacja: `npm install @anthropic-ai/sdk`
  - Basic usage: `query()` i `AgentClient`
  - Custom tools i tool definitions
  - Specialized subagents (security-reviewer, code-optimizer)
  - Permission management i session handling
  - External MCP integration
  - Real-world examples (calculator, weather, customer support)

#### Community Resources

- **claude-code-templates.md** - Kolekcja szablonów i konfiguracji
  - **Trust Score:** 10/10
  - **Code Snippets:** 2306+
  - Templates: React, Python, Node.js, Vue, Django
  - Agents: react-performance, api-security-audit, database-optimization
  - Commands: /test, /lint, /component, /generate-tests
  - MCP integrations: GitHub, Database, DeepGraph React
  - Settings: permissions, model selection, telemetry
  - Hooks: pre-commit validation, git workflows
  - Instalacja: `npx claude-code-templates@latest`

- **claude-code-cookbook.md** - Praktyczne przykłady użycia
  - **Trust Score:** 9.4/10
  - **Code Snippets:** 2736+
  - Design Patterns CLI (`/design-patterns`)
  - Spec Mode - generowanie specyfikacji z minimalnych wymagań
  - Plan Mode - szczegółowe plany implementacji
  - Role-based analysis (`/role security`, `/role architect`)
  - Context7 integration
  - Sequential thinking patterns
  - Multilingual support (EN, ES, FR, PT, JP, KO)

### OpenAI Agents Documentation

- **openai-agents-python.md** - Python SDK dla OpenAI Agents
  - **Code Snippets:** 400+ linii
  - Instalacja: `pip install openai-agents`
  - Agents i Runner API
  - Handoffs (agent-to-agent delegation)
  - Guardrails (security i validation)
  - Tools i context management
  - Sessions i streaming
  - MCP Integration

- **openai-agents-javascript.md** - TypeScript/JavaScript SDK
  - **Code Snippets:** 450+ linii
  - Instalacja: `npm install @openai/agents`
  - Agent creation i configuration
  - Multi-agent workflows
  - Tool calling patterns
  - Type safety z TypeScript
  - MCP server integration
  - Real-world examples

## Źródła

Wszystkie dokumentacje pochodzą z oficjalnych źródeł:

### Framework Documentation
- **Astro:** `/withastro/docs` (Context7)
- **React:** `/reactjs/react.dev` (Context7)

### Claude Code Documentation
- **Official Docs:** `/anthropics/claude-code` (Context7)
- **Developer Docs:** `/websites/anthropic_developers` (Context7)
- **Main Site:** `/websites/anthropic_s` (Context7)
- **Python SDK:** `/anthropics/claude-code-sdk-python` (Context7)
- **TypeScript SDK:** `/anthropics/claude-agent-sdk-typescript` (Context7)

### Community Resources
- **Templates:** `/davila7/claude-code-templates` (Context7, Trust Score: 10)
- **Cookbook:** `/wasabeef/claude-code-cookbook` (Context7, Trust Score: 9.4)

### OpenAI Agents
- **Python SDK:** `/websites/openai_github_io_openai-agents-python` (Context7)
- **JavaScript SDK:** `/websites/openai_github_io_openai-agents-js` (Context7)

## Statystyki

- **Łączna liczba plików:** 13
- **Łączna liczba code snippets:** ~6000+
- **Języki programowania:** Python, TypeScript, JavaScript, Bash
- **Frameworki:** Astro, React, Vue, Django, Express.js, Flask, FastAPI

## Ostatnia aktualizacja

2025-01-24

## Zastosowanie

Używane do:
1. Weryfikacji merytorycznej postów blogowych na ClaudeCodeLab
2. Reference podczas pisania nowych artykułów
3. Zapewnienia zgodności z najnowszymi best practices
4. Unikania powtarzającego się pobierania dokumentacji z Context7
