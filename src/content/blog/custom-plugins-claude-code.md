---
title: Własne wtyczki do Claude Code
description: Naucz się tworzyć własne wtyczki do Claude Code z komendami, agentami, skills i hookami oraz udostępniać je całemu zespołowi.
pubDate: Oct 24 2024
heroImage: ../../assets/blog/heroes/custom-plugins-claude-code.jpg
tags: ['Claude Code', 'Plugins', 'Extensibility', 'Zaawansowane']
readingTime: 4
heroImageAlt: "Ilustracja do artykułu o tworzeniu własnych wtyczek do Claude Code"
---




Claude Code można rozszerzać przez system wtyczek. W tym przewodniku pokazuję, jak budować własne rozszerzenia z komendami slash, agentami, skills i hookami, tak aby dało się je bezpiecznie rozwijać i udostępniać w zespole.

## Struktura wtyczki

Każda wtyczka Claude Code ma określoną strukturę katalogów:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json          # Metadata pluginu (wymagane)
├── commands/                 # Custom slash commands
│   ├── command1.md
│   └── command2.md
├── agents/                   # Specialized agent definitions
│   └── agent-name.md
├── skills/                   # Reusable agent capabilities
│   └── skill-name/
│       └── SKILL.md
├── hooks/                    # Event handlers
│   └── hooks.json
└── .mcp.json                # MCP servers (opcjonalne)
```

## Manifest wtyczki: `plugin.json`

Każdy [plugin](https://docs.anthropic.com/en/docs/claude-code/plugins) **musi** zawierać plik `.claude-plugin/plugin.json`:

```json
{
  "name": "plugin-name",
  "description": "Plugin description",
  "version": "1.0.0",
  "author": {
    "name": "Author Name"
  }
}
```

**Pola:**
- `name` - Unikalna nazwa pluginu (lowercase, hyphens)
- `description` - Krótki opis funkcjonalności
- `version` - Semantic versioning (1.0.0)
- `author` - Informacje o autorze

## Komponenty Pluginu

### 1. Custom Commands (Slash Commands)

Commands to pliki Markdown w katalogu `commands/` z YAML frontmatter.

**Przykład: `commands/review.md`**

```markdown
---
name: review
description: Code review with security focus
---

Review the provided code for:
1. Security vulnerabilities (SQL injection, XSS, CSRF)
2. Performance issues
3. Best practices violations
4. Potential bugs

Format output as:
- 🔴 Critical issues
- 🟡 Warnings
- 🟢 Suggestions

Be specific and actionable.
```

**Użycie:**
```bash
claude
> /review src/api/auth.js
```

**Przykład 2: Command z parametrami**

`commands/generate-test.md`:

```markdown
---
name: generate-test
description: Generate unit tests for a file
---

Generate comprehensive unit tests for the specified file.

Include:
- Happy path scenarios
- Edge cases
- Error handling
- Mock external dependencies

Use the testing framework already present in the project.
```

**Użycie:**
```
> /generate-test src/utils/validator.js
```

### 2. Agents (Specialized Agents)

Agents to wyspecjalizowani asystenci dla konkretnych zadań, definiowani w katalogu `agents/`.

**Przykład: `agents/security-reviewer.md`**

```markdown
---
name: security-reviewer
description: Security-focused code reviewer
---

You are a security expert reviewing code for vulnerabilities.

Focus areas:
1. **Input validation** - Check for injection attacks
2. **Authentication** - Verify proper auth implementation
3. **Authorization** - Ensure correct permission checks
4. **Data exposure** - Look for sensitive data leaks
5. **Cryptography** - Validate crypto usage

For each issue found:
- Severity: Critical/High/Medium/Low
- Location: File and line number
- Description: What the vulnerability is
- Fix: How to remediate

Prioritize critical and high severity issues.
```

**Użycie w Claude Code:**

Claude automatycznie wykryje agenta. Użytkownik może go wywołać przez:
```
> Use security-reviewer agent to analyze src/api/
```

Lub Claude może autonomicznie wybrać tego agenta, gdy wykryje zadanie związane z security.

### 3. Skills (Reusable Capabilities)

Skills to autonomiczne możliwości, które Claude może samodzielnie wywoływać na podstawie kontekstu zadania.

**Struktura:**
```
skills/
└── database-query/
    └── SKILL.md
```

**Przykład: `skills/database-query/SKILL.md`**

```markdown
---
name: database-query
description: Execute SQL queries and analyze database schema
---

This skill enables querying databases and understanding schema.

## Capabilities

1. **Execute SELECT queries** - Run read-only SQL
2. **Analyze schema** - Inspect tables, columns, indexes
3. **Explain query plans** - Understand performance
4. **Suggest optimizations** - Improve query efficiency

## Usage

Claude will automatically use this skill when:
- User asks about database contents
- Needs to verify data before code changes
- Analyzing database performance
- Planning schema migrations

## Safety

- Only read operations allowed
- No DROP, DELETE, UPDATE, INSERT
- Queries timeout after 30 seconds
- Results limited to 1000 rows
```

**Jak działa:**

Skills są **autonomicznie wywoływane przez Claude** - nie musisz ich ręcznie aktywować. Claude rozpozna kontekst i użyje odpowiedniego skilla.

**Przykład automatycznego użycia:**
```
User: Sprawdź, czy w tabeli users są duplikaty emaili

Claude: [Automatycznie używa database-query skill]
       Executing: SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1

       Znalazłem 3 duplikaty emaili...
```

### 4. Hooks (Event Handlers)

Hooks automatyzują działania na podstawie zdarzeń w Claude Code.

**Plik: `hooks/hooks.json`**

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
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Executing: $TOOL_INPUT_command' >> .claude/audit.log",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

**Obsługiwane eventy:**
- `PreToolUse` - Przed wykonaniem tool
- `PostToolUse` - Po wykonaniu tool
- `UserPromptSubmit` - Po wysłaniu promptu przez użytkownika
- `SessionStart` - Na początku sesji
- `SessionEnd` - Na końcu sesji
- `Notification` - Przy notyfikacjach
- `Stop` - Gdy główny agent kończy
- `SubagentStop` - Gdy subagent kończy

**Zmienne dostępne w hookach:**
- `$TOOL_NAME` - Nazwa użytego toolu
- `$TOOL_INPUT_<param>` - Parametry toolu (np. `$TOOL_INPUT_file_path`)
- `$CLAUDE_PROJECT_DIR` - Katalog projektu

### 5. MCP Integration

Pluginy mogą zawierać własne [MCP serwery](https://docs.anthropic.com/en/docs/claude-code/mcp) przez `.mcp.json`.

**Przykład: `.mcp.json`**

```json
{
  "mcpServers": {
    "company-api": {
      "transport": "http",
      "url": "https://internal.company.com/mcp",
      "env": {
        "API_TOKEN": "${COMPANY_API_TOKEN}"
      }
    },
    "local-db": {
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

Po zainstalowaniu pluginu, MCP serwery będą automatycznie dostępne.

## Tworzenie Kompletnego Pluginu - Przykład

Stwórzmy plugin `code-quality` do analizy jakości kodu.

### Krok 1: Struktura

```bash
mkdir -p code-quality/.claude-plugin
mkdir -p code-quality/commands
mkdir -p code-quality/agents
mkdir -p code-quality/skills/complexity-analyzer
mkdir -p code-quality/hooks
```

### Krok 2: Manifest

**`code-quality/.claude-plugin/plugin.json`:**

```json
{
  "name": "code-quality",
  "description": "Comprehensive code quality analysis and improvements",
  "version": "1.0.0",
  "author": {
    "name": "Your Team"
  }
}
```

### Krok 3: Commands

**`code-quality/commands/analyze.md`:**

```markdown
---
name: analyze
description: Analyze code quality metrics
---

Analyze the specified file or directory for:

1. **Complexity** - Cyclomatic complexity score
2. **Duplication** - Repeated code blocks
3. **Test coverage** - Missing tests
4. **Dependencies** - Outdated or unused packages
5. **Security** - Known vulnerabilities

Provide:
- Overall quality score (0-100)
- Detailed breakdown per category
- Top 5 improvement recommendations
```

**`code-quality/commands/fix-quality.md`:**

```markdown
---
name: fix-quality
description: Automatically fix common code quality issues
---

Fix the following in the codebase:

1. Linting errors (ESLint/Prettier)
2. Unused imports
3. Console.log statements (remove or replace with logger)
4. Magic numbers (extract to constants)
5. Long functions (suggest refactoring)

Make changes incrementally and run tests after each change.
Only proceed if tests pass.
```

### Krok 4: Agent

**`code-quality/agents/refactoring-expert.md`:**

```markdown
---
name: refactoring-expert
description: Expert in code refactoring and design patterns
---

You are a refactoring expert specializing in clean code principles.

## Approach

1. **Analyze** - Understand current code structure
2. **Identify** - Find code smells and anti-patterns
3. **Plan** - Create step-by-step refactoring plan
4. **Execute** - Make incremental, testable changes
5. **Verify** - Ensure tests pass after each step

## Focus Areas

- Extract long methods into smaller functions
- Apply SOLID principles
- Introduce design patterns where beneficial
- Improve naming and readability
- Reduce coupling, increase cohesion

## Safety First

- Never break existing functionality
- Maintain test coverage
- Make atomic commits
- Document breaking changes
```

### Krok 5: Skill

**`code-quality/skills/complexity-analyzer/SKILL.md`:**

```markdown
---
name: complexity-analyzer
description: Automatically analyze code complexity
---

This skill calculates cyclomatic complexity and suggests refactoring.

## When to Use

Claude automatically uses this when:
- Reviewing pull requests
- Analyzing file complexity
- Planning refactoring
- Identifying technical debt

## Analysis

For each function:
1. Calculate cyclomatic complexity
2. Count lines of code
3. Identify nested loops/conditions
4. Suggest refactoring if complexity > 10

## Output Format

```
Function: calculateTotal()
Complexity: 15 (High)
Lines: 85
Recommendation: Extract validation logic to separate function
```
```

### Krok 6: Hooks

**`code-quality/hooks/hooks.json`:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx eslint --fix \"$TOOL_INPUT_file_path\" 2>/dev/null || true",
            "timeout": 30
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Code Quality Plugin Active ✓' && npm run lint -- --quiet || echo '⚠️  Linting issues detected'",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

## Dystrybucja Pluginów - Marketplace

### Tworzenie Marketplace

**Plik: `marketplace.json`**

```json
{
  "name": "team-plugins",
  "owner": {
    "name": "Your Company"
  },
  "description": "Internal company plugins",
  "plugins": [
    {
      "name": "code-quality",
      "source": "./code-quality",
      "description": "Code quality analysis and improvements"
    },
    {
      "name": "security-tools",
      "source": "./security-tools",
      "description": "Security scanning and remediation"
    }
  ]
}
```

### Struktura Repository

```
team-plugins-repo/
├── marketplace.json
├── code-quality/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── commands/
│   ├── agents/
│   └── skills/
└── security-tools/
    ├── .claude-plugin/
    │   └── plugin.json
    └── ...
```

### Publikacja (Git Repository)

```bash
git init
git add .
git commit -m "Initial plugin marketplace"
git remote add origin https://github.com/company/team-plugins
git push -u origin main
```

## Instalacja Pluginów

### Metoda 1: Interaktywna

```bash
claude
> /plugin
```

Wybierz "Install from marketplace" → podaj URL → wybierz plugin.

### Metoda 2: Command Line

```bash
claude
> /plugin install code-quality@team-plugins
```

Gdzie:
- `code-quality` - nazwa pluginu
- `team-plugins` - nazwa marketplace

### Metoda 3: Automatyczna (Team-wide)

**`.claude/settings.json` w repozytorium:**

```json
{
  "plugins": {
    "marketplaces": [
      {
        "name": "team-plugins",
        "url": "https://github.com/company/team-plugins"
      }
    ],
    "autoInstall": [
      "code-quality@team-plugins",
      "security-tools@team-plugins"
    ]
  }
}
```

Zespół automatycznie otrzyma pluginy po `git pull`.

## Testowanie Pluginów Lokalnie

### Przed publikacją, testuj lokalnie:

```bash
# 1. Przejdź do katalogu projektu
cd ~/my-project

# 2. Utwórz local plugin directory
mkdir -p .claude/plugins

# 3. Skopiuj plugin
cp -r ~/code-quality .claude/plugins/

# 4. Uruchom Claude
claude

# 5. Testuj commands
> /analyze src/

# 6. Weryfikuj hooks
> Edit jakiś plik i sprawdź czy auto-lint działa
```

## Best Practices

### 1. Dokumentuj Commands

Commands powinny być **self-explanatory**:

✅ Dobrze:
```markdown
---
name: deploy
description: Deploy application to staging or production
---

Deploy the application to specified environment.

Usage:
/deploy staging - Deploy to staging
/deploy production - Deploy to production (requires approval)

Prerequisites:
- Tests must pass
- No uncommitted changes
- CI/CD pipeline successful
```

❌ Źle:
```markdown
---
name: deploy
description: Deploy
---

Deploy app.
```

### 2. Agents z Jasnym Scope

Agent powinien mieć **określoną specjalizację**:

✅ Dobrze:
```markdown
---
name: api-designer
description: RESTful API design expert
---

Specialized in designing REST APIs following best practices...
```

❌ Źle:
```markdown
---
name: helper
description: Helps with code
---

I help with coding tasks...
```

### 3. Skills z Clear Triggers

Opisz **kiedy skill powinien być użyty**:

```markdown
## When to Use

Claude automatically uses this skill when:
- User mentions "database" or "SQL"
- Needs to verify data before changes
- Planning schema migrations
```

### 4. Bezpieczne Hooks

**Waliduj input w hookach:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$TOOL_INPUT_command\" | grep -q 'rm -rf /'; then echo 'Dangerous command blocked' && exit 2; fi",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

### 5. Versioning

Używaj **semantic versioning**:

- `1.0.0` - Initial release
- `1.0.1` - Bug fix (backward compatible)
- `1.1.0` - New feature (backward compatible)
- `2.0.0` - Breaking change

## Zaawansowane: Plugin z MCP + Hooks + Skills

**Kompletny przykład - Database Tools Plugin:**

```
database-tools/
├── .claude-plugin/
│   └── plugin.json
├── .mcp.json                 # PostgreSQL MCP server
├── commands/
│   ├── query.md             # /query - Execute SQL
│   └── migrate.md           # /migrate - Run migrations
├── skills/
│   └── schema-analyzer/
│       └── SKILL.md         # Auto schema analysis
└── hooks/
    └── hooks.json           # Log all queries
```

**`.mcp.json`:**
```json
{
  "mcpServers": {
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

**`hooks/hooks.json`:**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__postgres__*",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[$(date)] Query: $TOOL_INPUT_query\" >> .claude/db-queries.log",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

## Dokumentacja i zasoby

### Oficjalna Dokumentacja
- [Claude Code - Plugins](https://docs.anthropic.com/en/docs/claude-code/plugins)
- [Claude Code - MCP](https://docs.anthropic.com/en/docs/claude-code/mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)

### Powiązane Artykuły
- [MCP (Model Context Protocol)](/blog/mcp-model-context-protocol)
- [Hooks i Event-Driven Automation](/blog/hooks-event-automation)
- [Zaawansowane Techniki Claude Code](/blog/zaawansowane-techniki-claude-code)

## Podsumowanie

Własne wtyczki pozwalają uporządkować sposób pracy z Claude Code i przenieść powtarzalne działania do jednego, kontrolowanego miejsca. Największą wartość dają wtedy, gdy rozwiązują konkretny problem zespołu: ujednolicają komendy, automatyzują sprawdzenia albo porządkują integracje.

Najrozsądniejsza ścieżka wdrożenia jest prosta: zacznij od jednej komendy, przetestuj ją lokalnie, dopiero potem dodaj hooki i dystrybucję zespołową. Dzięki temu wtyczka pozostanie użyteczna, zamiast szybko zamienić się w trudny do utrzymania zestaw eksperymentów.
