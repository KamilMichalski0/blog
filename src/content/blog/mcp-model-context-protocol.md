---
title: 'MCP (Model Context Protocol) - Podłączanie Zewnętrznych Źródeł Danych do Claude Code'
description: 'Poznaj Model Context Protocol i dowiedz się, jak zintegrować Claude Code z GitHub, bazami danych, Notion, Stripe i setkami innych narzędzi.'
pubDate: 'Oct 24 2024'
heroImage: '/mcp-integration.jpg'
tags: ['Claude Code', 'MCP', 'Integracja', 'API', 'Zaawansowane']
---

Model Context Protocol (MCP) to otwarty standard umożliwiający Claude Code łączenie się z zewnętrznymi narzędziami, bazami danych i API. Dzięki MCP możesz rozszerzyć możliwości Claude poza wbudowane funkcje i uzyskać dostęp do danych w czasie rzeczywistym podczas kodowania.

## Czym Jest MCP?

MCP to **open-source standard dla integracji AI z narzędziami**, który pozwala Claude Code:

- Łączyć się z zewnętrznymi API (GitHub, Stripe, Notion)
- Odpytywać bazy danych (PostgreSQL, MySQL)
- Czytać i zapisywać pliki w chmurze
- Integrować się z narzędziami projektowymi (Figma, Linear, Jira)
- Dostęp do **setek dostępnych MCP serverów**

## Trzy Rodzaje Transportu MCP

MCP obsługuje trzy metody komunikacji:

### 1. HTTP Servers (Rekomendowane)

Zdalne usługi w chmurze używające transportu HTTP.

**Składnia:**
```bash
claude mcp add --transport http <nazwa> <url>
```

**Przykład - Notion:**
```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

### 2. SSE Servers (Przestarzałe)

Server-Sent Events - nadal działa, ale HTTP jest preferowany.

```bash
claude mcp add --transport sse asana https://mcp.asana.com/sse
```

### 3. Stdio Servers (Lokalne)

Procesy uruchamiane lokalnie na Twoim komputerze.

**Składnia:**
```bash
claude mcp add --transport stdio <nazwa> --env KEY=VALUE -- <komenda>
```

**Przykład - Airtable:**
```bash
claude mcp add --transport stdio airtable \
  --env AIRTABLE_API_KEY=YOUR_KEY \
  -- npx -y airtable-mcp-server
```

## Poziomy Konfiguracji (Scopes)

MCP serwery mogą być skonfigurowane na trzech poziomach:

### Local (Domyślny)
Prywatny dla Ciebie, specyficzny dla projektu.

```bash
claude mcp add --transport http github https://mcp.github.com
```

### Project
Współdzielony z zespołem przez `.mcp.json` w kontroli wersji.

```bash
claude mcp add --scope project --transport http linear https://mcp.linear.app
```

### User
Dostępny we wszystkich projektach, globalny dla użytkownika.

```bash
claude mcp add --scope user --transport http stripe https://mcp.stripe.com
```

## Podstawowe Komendy MCP

```bash
# Lista wszystkich serwerów
claude mcp list

# Szczegóły konkretnego serwera
claude mcp get github

# Usunięcie serwera
claude mcp remove github

# Sprawdzenie autoryzacji (w Claude Code)
/mcp
```

## Popularne Integracje MCP

Dokumentacja wymienia **ponad 40 często używanych MCP serverów**:

### Development & Version Control
- **GitHub** - repositories, issues, PRs
- **GitLab** - CI/CD pipelines, merge requests

### Project Management
- **Linear** - zadania, projekty, sprint planning
- **Jira** - issue tracking, workflows
- **Asana** - task management

### Databases
- **PostgreSQL** - SQL queries, schema inspection
- **MySQL** - database operations
- **MongoDB** - NoSQL queries

### Business Tools
- **Notion** - notes, databases, wiki
- **Slack** - messages, channels
- **HubSpot** - CRM, contacts
- **Stripe** - payments, customers

### Monitoring & Analytics
- **Sentry** - error tracking
- **DataDog** - metrics, logs

### Design
- **Figma** - design files, components

## Konfiguracja przez Plik `.mcp.json`

Dla projektów zespołowych, utwórz `.mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "transport": "http",
      "url": "https://mcp.github.com",
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
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

**Ważne:** `.mcp.json` używa **interpolacji zmiennych środowiskowych** - `${VAR_NAME}` zostanie zastąpione wartością z `.env`.

## Praktyczne Przykłady Użycia

### Przykład 1: GitHub Integration

**Setup:**
```bash
claude mcp add --transport http github https://mcp.github.com
```

**Użycie w Claude Code:**
```
> Pokaż mi wszystkie otwarte pull requesty w repo owner/project

> Utwórz issue w repozytorium z tytułem "Bug in auth" i opisem...

> Sprawdź status CI/CD dla ostatniego commita
```

### Przykład 2: PostgreSQL Database Access

**Setup:**
```bash
claude mcp add --transport stdio postgres \
  --env DATABASE_URL="postgresql://user:pass@localhost:5432/db" \
  -- npx -y postgres-mcp-server
```

**Użycie:**
```
> Pokaż schemat tabeli users

> Wykonaj query: SELECT * FROM orders WHERE status = 'pending' LIMIT 10

> Wygeneruj migrację dodającą kolumnę email_verified do tabeli users
```

### Przykład 3: Notion Knowledge Base

**Setup:**
```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

**Użycie:**
```
> Znajdź wszystkie dokumenty dotyczące API authentication w Notion

> Utwórz nową stronę w Notion z dokumentacją tej funkcji

> Zaktualizuj status projektu w Notion database
```

### Przykład 4: Stripe Payments

**Setup:**
```bash
claude mcp add --transport http stripe https://mcp.stripe.com
```

**Użycie:**
```
> Pokaż mi ostatnie 10 płatności

> Sprawdź szczegóły klienta o ID cus_xyz

> Utwórz nowy subscription plan
```

## OAuth 2.0 Authentication

Zdalne serwery MCP (HTTP/SSE) obsługują **OAuth 2.0** dla bezpiecznej autoryzacji.

**Flow:**
1. Dodaj serwer: `claude mcp add --transport http github https://mcp.github.com`
2. Uruchom Claude Code: `claude`
3. Claude wyświetli URL autoryzacji
4. Zaloguj się w przeglądarce
5. Token zostanie zapisany lokalnie

**Sprawdzenie statusu:**
```bash
claude
> /mcp
```

## Resource Referencing

MCP umożliwia **referencje do zewnętrznych zasobów** przez specjalną składnię:

```
@server:protocol://path
```

**Przykłady:**
```
> Przeanalizuj ten plik: @github:github://owner/repo/path/to/file.js

> Użyj danych z: @postgres:sql://SELECT * FROM users WHERE active=true

> Wczytaj design: @figma:figma://file/abc123/page/1
```

## MCP Prompts jako Slash Commands

Serwery MCP mogą eksportować **prompty**, które stają się slash commands w Claude Code.

**Przykład:**
Jeśli GitHub MCP eksportuje prompt `create-pr`, możesz użyć:

```
> /create-pr
```

Claude automatycznie wykryje i zasugeruje dostępne prompty.

## Limity Tokenów

MCP ma konfigurowalny limit tokenów dla outputu:

**Ustawienie w `.claude/settings.json`:**
```json
{
  "MAX_MCP_OUTPUT_TOKENS": 10000
}
```

**Domyślnie:** Output z MCP jest limitowany, aby nie przekroczyć context window.

## Enterprise: Centralna Konfiguracja

Administratorzy mogą zarządzać MCP dla zespołu przez:

**`managed-mcp.json`:**
```json
{
  "mcpServers": {
    "company-internal-api": {
      "transport": "http",
      "url": "https://internal.company.com/mcp",
      "allowlist": ["team-a", "team-b"]
    }
  }
}
```

**`managed-settings.json`:**
```json
{
  "allowedMcpServers": ["github", "jira"],
  "deniedMcpServers": ["*"]
}
```

## Debugging MCP Connections

### Problem: Serwer nie działa

```bash
# Sprawdź listę serwerów
claude mcp list

# Sprawdź szczegóły
claude mcp get <nazwa>

# Usuń i dodaj ponownie
claude mcp remove <nazwa>
claude mcp add --transport http <nazwa> <url>
```

### Problem: Brak autoryzacji

```bash
claude
> /mcp
```

Następnie kliknij link OAuth i zaloguj się ponownie.

### Problem: Timeout

**Zwiększ timeout w `.mcp.json`:**
```json
{
  "mcpServers": {
    "slow-api": {
      "transport": "http",
      "url": "https://slow.api.com",
      "timeout": 120000
    }
  }
}
```

## Best Practices

### 1. Używaj Scope Odpowiednio

```bash
# Local - do eksperymentów
claude mcp add github-test https://test.github.com

# Project - dla zespołu
claude mcp add --scope project github https://mcp.github.com

# User - dla osobistych narzędzi
claude mcp add --scope user personal-notes https://notes.com/mcp
```

### 2. Secrets w Environment Variables

**NIE umieszczaj API keys w `.mcp.json`:**

❌ Źle:
```json
{
  "mcpServers": {
    "api": {
      "env": {
        "API_KEY": "sk-12345678"
      }
    }
  }
}
```

✅ Dobrze:
```json
{
  "mcpServers": {
    "api": {
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

Następnie w `.env` (NIE commituj):
```
API_KEY=sk-12345678
```

### 3. Dokumentuj Wymagane Serwery

**`README.md` w projekcie:**
```markdown
## Required MCP Servers

Install with:
```bash
claude mcp add --scope project --transport http github https://mcp.github.com
claude mcp add --scope project --transport stdio postgres --env DATABASE_URL="${DATABASE_URL}" -- npx -y postgres-mcp-server
```

Required environment variables in `.env`:
- `GITHUB_TOKEN` - Personal access token
- `DATABASE_URL` - PostgreSQL connection string
```

### 4. Testuj Lokalnie Przed Project Scope

```bash
# Najpierw testuj lokalnie
claude mcp add --transport http test-api https://api.test.com

# Jak działa, przenieś do project
claude mcp remove test-api
claude mcp add --scope project --transport http api https://api.test.com
```

## Tworzenie Własnego MCP Servera

Chociaż szczegóły wykraczają poza ten tutorial, MCP to **open-source standard**, więc możesz stworzyć własny serwer.

**Podstawowa struktura:**
1. Implementuj MCP protocol (HTTP lub stdio)
2. Zdefiniuj dostępne tools/resources/prompts
3. Hostuj (dla HTTP) lub spakuj (dla stdio)
4. Dodaj do Claude Code

**Dokumentacja MCP:**
```
https://modelcontextprotocol.io/
```

## Podsumowanie

MCP (Model Context Protocol) to potężna funkcjonalność Claude Code, która:

✅ Łączy Claude z **setkami zewnętrznych narzędzi**
✅ Obsługuje **trzy rodzaje transportu**: HTTP, SSE, stdio
✅ Oferuje **trzy poziomy konfiguracji**: local, project, user
✅ Wspiera **OAuth 2.0** dla bezpiecznej autoryzacji
✅ Umożliwia **resource referencing** przez `@server:protocol://path`
✅ Eksportuje **prompty jako slash commands**
✅ Pozwala na **centralną konfigurację enterprise**

### Następne Kroki

1. Zainstaluj pierwszy MCP server (np. GitHub)
2. Eksperymentuj z resource references
3. Dodaj database integration dla swojego projektu
4. Skonfiguruj team-wide MCP w `.mcp.json`
5. Rozważ stworzenie własnego MCP servera dla wewnętrznych API

MCP przekształca Claude Code z lokalnego asystenta w **połączone centrum deweloperskie** z dostępem do całego Twojego ekosystemu narzędzi! 🚀
