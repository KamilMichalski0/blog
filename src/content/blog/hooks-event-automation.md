---
title: "Hooki w Claude Code: automatyzacja zdarzeń"
description: Automatyzuj pracę przez hooki w Claude Code. Poznaj PreToolUse, PostToolUse, walidację, logowanie i integracje z zewnętrznymi narzędziami.
pubDate: Oct 24 2024
heroImage: ../../assets/blog/heroes/hooks-event-automation.jpg
tags: ['Claude Code', 'Hooks', 'Automation', 'DevOps', 'Zaawansowane']
readingTime: 6
heroImageAlt: "Ilustracja do artykułu o hookach i automatyzacji zdarzeń w Claude Code"
---




Hooki w Claude Code pozwalają automatycznie wykonywać działania w odpowiedzi na zdarzenia, takie jak użycie narzędzia, wysłanie promptu czy rozpoczęcie sesji. Ten mechanizm jest przydatny wtedy, gdy chcesz wymuszać reguły jakości, dodawać walidację albo ograniczać ryzykowne operacje.

## Czym są hooki?

[Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) to **skrypty lub komendy wywoływane automatycznie** w odpowiedzi na zdarzenia w Claude Code.

**Przykłady użycia:**
- Automatyczne formatowanie kodu po edycji
- Logowanie komend Bash do dziennika audytowego
- Walidacja przed wykonaniem ryzykownych operacji
- Wysyłanie notyfikacji do Slacka
- Dodawanie dodatkowego kontekstu do promptów

## 8 typów zdarzeń hooków

Claude Code wspiera **8 głównych typów hooków zdarzeniowych**:

### 1. PreToolUse
**Kiedy:** Po utworzeniu parametrów tool przez Claude, **przed** wykonaniem

**Typowe zastosowania:**
- Walidacja przed wykonaniem
- Proces zatwierdzania działań
- Logowanie planowanych operacji
- Blokowanie ryzykownych poleceń

### 2. PostToolUse
**Kiedy:** Natychmiast **po** udanym wykonaniu tool

**Use cases:**
- Auto-formatting po edycji plików
- Running tests po zmianach kodu
- Notyfikacje o zakończeniu
- Cleanup operations

### 3. UserPromptSubmit
**Kiedy:** Gdy użytkownik wysyła prompt, **przed** przetworzeniem przez Claude

**Use cases:**
- Context injection
- Enriching prompts z dodatkowymi danymi
- User input validation
- Analytics tracking

### 4. Notification
**Kiedy:** Claude wysyła notyfikację (permission requests, idle waiting)

**Use cases:**
- Auto-approval dla trusted operations
- Logging permission requests
- Custom notification routing

### 5. Stop
**Kiedy:** Main agent kończy odpowiedź

**Use cases:**
- Session summary
- Archiving conversation
- Metrics collection

### 6. SubagentStop
**Kiedy:** Subagent kończy zadanie

**Use cases:**
- Subagent result processing
- Performance tracking
- Cleanup po subagent tasks

### 7. SessionStart
**Kiedy:** Na początku sesji lub resume

**Use cases:**
- Environment setup
- Loading context
- Initializing integrations

### 8. SessionEnd
**Kiedy:** Zakończenie sesji

**Use cases:**
- Cleanup operations
- Saving state
- Final reporting

## Konfiguracja Hooks

Hooks definiuje się w plikach settings:

- `~/.claude/settings.json` - User-level (wszystkie projekty)
- `.claude/settings.json` - Project-level (team shared)
- `.claude/settings.local.json` - Local overrides (gitignored)

### Podstawowa Struktura

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolPattern",
        "hooks": [
          {
            "type": "command",
            "command": "bash-command",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

## Matcher Patterns

Matchers określają, **które tools** powinny wywołać hook.

**Case-sensitive patterns:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",           // Dokładne dopasowanie - tylko Write tool
        "hooks": [...]
      },
      {
        "matcher": "Edit|Write",      // Regex - Edit LUB Write
        "hooks": [...]
      },
      {
        "matcher": "Notebook.*",      // Regex - wszystkie Notebook tools
        "hooks": [...]
      },
      {
        "matcher": "*",               // Wildcard - wszystkie tools
        "hooks": [...]
      }
    ]
  }
}
```

**Popularne tool patterns:**

- `Bash` - Shell commands
- `Read`, `Write`, `Edit` - File operations
- `Glob`, `Grep` - File searching
- `WebFetch`, `WebSearch` - Web operations
- `Task` - Subagent tasks
- `mcp__*` - Wszystkie MCP tools
- `mcp__github__*` - Tylko GitHub MCP tools

## Hook Input Format

Hooks otrzymują **JSON via stdin** ze szczegółami eventu:

```json
{
  "session_id": "abc123",
  "transcript_path": "/path/to/transcript.md",
  "cwd": "/project/directory",
  "hook_event_name": "PostToolUse",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.js",
    "content": "const x = 1;"
  },
  "tool_output": "File written successfully"
}
```

**Dostęp do danych w hookach:**

Przez **environment variables**:
- `$TOOL_NAME` - Nazwa użytego tool
- `$TOOL_INPUT_<param>` - Parametry (np. `$TOOL_INPUT_file_path`)
- `$CLAUDE_PROJECT_DIR` - Root directory projektu
- `$CLAUDE_CODE_REMOTE` - `"true"` jeśli remote environment

## Hook Output i Exit Codes

### Exit Codes

```bash
# 0 - Success (stdout pokazany w transcript mode)
exit 0

# 2 - Blocking error (stderr przekazany do Claude)
exit 2

# Inne - Non-blocking error (stderr pokazany użytkownikowi)
exit 1
```

### JSON Output (Advanced Control)

```json
{
  "continue": true,
  "stopReason": "message",
  "suppressOutput": true,
  "hookSpecificOutput": {
    "hookEventName": "EventType",
    "permissionDecision": "allow",
    "additionalContext": "Extra info for Claude"
  }
}
```

**Pola:**
- `continue` - Czy kontynuować execution
- `stopReason` - Powód zatrzymania
- `suppressOutput` - Ukryj output hook
- `permissionDecision` - `"allow"` | `"deny"` | `"ask"` (dla Notification hooks)
- `additionalContext` - Context dodany do UserPromptSubmit

## Praktyczne Przykłady Hooks

### Przykład 1: Auto-formatting Po Edycji

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
    ]
  }
}
```

**Co robi:** Po każdym Write lub Edit, automatycznie formatuje plik przez Prettier.

### Przykład 2: Bash Command Logging

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[$(date)] Executing: $TOOL_INPUT_command\" >> .claude/bash-audit.log",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

**Co robi:** Loguje wszystkie Bash commands przed wykonaniem do audit log.

### Przykład 3: Dangerous Command Blocking

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$TOOL_INPUT_command\" | grep -qE \"rm -rf|sudo|curl.*sh\"; then echo \"Dangerous command blocked\" >&2 && exit 2; fi'",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

**Co robi:** Blokuje potencjalnie niebezpieczne komendy (exit 2 = blocking error).

### Przykład 4: Auto-testing Po Zmianach

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$TOOL_INPUT_file_path\" | grep -q '\\.test\\|spec'; then npm test -- \"$TOOL_INPUT_file_path\"; fi",
            "timeout": 120
          }
        ]
      }
    ]
  }
}
```

**Co robi:** Uruchamia testy automatycznie, gdy edytujesz pliki testowe.

### Przykład 5: Context Injection

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "echo '{\"additionalContext\": \"Current branch: $(git branch --show-current)\\nLast commit: $(git log -1 --oneline)\"}'",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

**Co robi:** Automatycznie dodaje Git context do każdego promptu (UserPromptSubmit + additionalContext).

### Przykład 6: Slack Notifications

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL -H 'Content-Type: application/json' -d '{\"text\": \"Claude Code session completed\"}'",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

**Co robi:** Wysyła notyfikację do Slacka po zakończeniu sesji.

### Przykład 7: Environment Setup

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'export PROJECT_NAME=my-app' > \"$CLAUDE_ENV_FILE\" && echo 'export ENV=development' >> \"$CLAUDE_ENV_FILE\"",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

**Co robi:** Setup environment variables na początku sesji (przez `$CLAUDE_ENV_FILE`).

### Przykład 8: MCP Tool Monitoring

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__github__*",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[$(date)] GitHub MCP call: $TOOL_NAME\" >> .claude/mcp-github.log",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

**Co robi:** Loguje wszystkie wywołania GitHub MCP tools.

## Zaawansowane Patterns

### Multiple Hooks na Event

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
            "command": "npx eslint --fix \"$TOOL_INPUT_file_path\"",
            "timeout": 30
          },
          {
            "type": "command",
            "command": "git add \"$TOOL_INPUT_file_path\"",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

**Co robi:** 3 hooks wykonywane **równolegle** po edycji: format, lint, git add.

### Conditional Hooks

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if [ \"$CLAUDE_CODE_REMOTE\" = \"true\" ]; then echo 'Remote execution detected' >> remote.log; fi",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

**Co robi:** Hook wykonuje się tylko w remote environment.

### File Type Specific Hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "case \"$TOOL_INPUT_file_path\" in *.js|*.ts) npx eslint --fix \"$TOOL_INPUT_file_path\" ;; *.py) black \"$TOOL_INPUT_file_path\" ;; *.go) gofmt -w \"$TOOL_INPUT_file_path\" ;; esac",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

**Co robi:** Różne formattery dla różnych języków.

## Execution Details

### Parallel Execution

**Wszystkie matching hooks wykonują się równolegle:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {"type": "command", "command": "hook1.sh"},  // \
          {"type": "command", "command": "hook2.sh"},  // |--> Równolegle
          {"type": "command", "command": "hook3.sh"}   // /
        ]
      }
    ]
  }
}
```

### Deduplication

**Identyczne komendy są deduplikowane:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {"type": "command", "command": "npm test"}  // Wykonane
        ]
      },
      {
        "matcher": "Edit",
        "hooks": [
          {"type": "command", "command": "npm test"}  // Deduplikowane jeśli Write+Edit match
        ]
      }
    ]
  }
}
```

### Timeouts

**Domyślny timeout: 60 sekund**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "long-running-task.sh",
            "timeout": 300  // 5 minut
          }
        ]
      }
    ]
  }
}
```

## Security Best Practices

### 1. Validate Input

**Zawsze waliduj dane z `$TOOL_INPUT_*`:**

```bash
#!/bin/bash
# validate-hook.sh

FILE="$TOOL_INPUT_file_path"

# Check for path traversal
if echo "$FILE" | grep -q '\.\./'; then
  echo "Path traversal attempt blocked" >&2
  exit 2
fi

# Check for absolute path outside project
if [[ "$FILE" = /* ]] && [[ ! "$FILE" = "$CLAUDE_PROJECT_DIR"* ]]; then
  echo "Access outside project blocked" >&2
  exit 2
fi

# Proceed with safe operation
prettier --write "$FILE"
```

### 2. Quote Variables

**Zawsze cytuj zmienne w bash:**

```bash
# ❌ Niebezpieczne
prettier --write $TOOL_INPUT_file_path

# ✅ Bezpieczne
prettier --write "$TOOL_INPUT_file_path"
```

### 3. Avoid Sensitive Files

```bash
#!/bin/bash

FILE="$TOOL_INPUT_file_path"

# Blokuj sensitive files
if echo "$FILE" | grep -qE '\\.env$|\\.git/|id_rsa|credentials'; then
  echo "Cannot modify sensitive file" >&2
  exit 2
fi
```

### 4. Use Absolute Paths

```bash
#!/bin/bash

# ❌ Relative path - może być exploitation
cd "$TOOL_INPUT_directory" && rm file.txt

# ✅ Absolute path
rm "$CLAUDE_PROJECT_DIR/$TOOL_INPUT_directory/file.txt"
```

### 5. Limit Permissions

**Hook ma permissions użytkownika - ogranicz dostęp:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$TOOL_INPUT_command\" | grep -q 'sudo'; then echo 'sudo blocked' >&2 && exit 2; fi",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

## Real-World Use Cases

### Use Case 1: Code Review Workflow

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx eslint \"$TOOL_INPUT_file_path\" --format json > /tmp/lint.json && if [ $(jq '.[] | select(.errorCount > 0) | length' /tmp/lint.json) -gt 0 ]; then echo 'Linting errors detected' >&2 && exit 2; fi",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

**Workflow:** Błędy lintingu blokują Claude przed dalszymi zmianami.

### Use Case 2: Continuous Testing

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npm test -- --findRelatedTests \"$TOOL_INPUT_file_path\" --passWithNoTests",
            "timeout": 120
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "npm test -- --coverage && echo 'Coverage report: file://$(pwd)/coverage/index.html'",
            "timeout": 300
          }
        ]
      }
    ]
  }
}
```

**Workflow:** Testy after każdej zmiany, full coverage na końcu sesji.

### Use Case 3: Deployment Gate

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$TOOL_INPUT_command\" | grep -q 'deploy'; then echo 'Deployment requires manual approval' >&2 && exit 2; fi",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

**Workflow:** Blokuj auto-deployment, wymagaj manual approval.

### Use Case 4: Analytics & Metrics

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "curl -X POST https://analytics.company.com/track -d '{\"event\": \"claude_prompt\", \"user\": \"$USER\", \"timestamp\": \"$(date -Iseconds)\"}'",
            "timeout": 10
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "curl -X POST https://analytics.company.com/track -d '{\"event\": \"claude_session_complete\", \"session_id\": \"$SESSION_ID\", \"duration\": \"$(date +%s)\"}'",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

**Workflow:** Track usage metrics dla team analytics.

## Debugging Hooks

### Check Hook Configuration

```bash
claude
> /hooks
```

**Output pokazuje:**
- Załadowane hooks
- Active matchers
- Configuration source (user/project/local)

### View Hook Output

Hooks output jest widoczny w **transcript mode**.

**Enable transcript:**
```bash
claude --transcript
```

### Test Hook Manually

```bash
# Symuluj hook input
echo '{"tool_name": "Write", "tool_input": {"file_path": "test.js"}}' | \
  TOOL_NAME=Write \
  TOOL_INPUT_file_path=test.js \
  bash -c 'npx prettier --write "$TOOL_INPUT_file_path"'
```

### Hook Errors

**Check stderr output:**
- Exit 2 → Claude otrzyma error
- Exit 0 → Success
- Exit 1 → User widzi error, Claude kontynuuje

## Snapshot Behavior

**Ważne:** Hooks są **snapshot at startup**.

External zmiany w settings wymagają:
```bash
claude
> /hooks
```

Następnie wybierz "Reload hooks" aby zaaplikować nową konfigurację.

## Dokumentacja i zasoby

### Oficjalna Dokumentacja
- [Claude Code - Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [Claude Code - Developer Guide](https://docs.anthropic.com/en/docs/claude-code/developers)
- [Hook Event Types](https://docs.anthropic.com/en/docs/claude-code/hooks#event-types)

### Powiązane Artykuły
- [Custom Plugins dla Claude Code](/blog/custom-plugins-claude-code)
- [Automatyzacja Workflow z Claude](/blog/automatyzacja-workflow-z-claude)
- [Integracja Claude Code z Workflow](/blog/integracja-claude-code-workflow)

## Podsumowanie

Hooki są najbardziej użyteczne wtedy, gdy rozwiązują konkretny problem: pilnują jakości kodu, blokują niebezpieczne operacje albo przygotowują środowisko pracy. Nie warto zaczynać od zbyt rozbudowanej automatyzacji, bo to zwykle utrudnia diagnostykę i utrzymanie.

Najlepiej wdrażać je etapami. Najpierw prosty `PostToolUse` do formatowania, potem `PreToolUse` do walidacji, a dopiero później bardziej złożone działania związane z kontekstem sesji czy integracjami zespołowymi. Taka kolejność daje kontrolę i pozwala łatwo ocenić, które hooki faktycznie pomagają.
