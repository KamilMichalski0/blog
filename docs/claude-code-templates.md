# Claude Code Templates - Community Resource

**Source:** Context7 - /davila7/claude-code-templates
**Trust Score:** 10
**Code Snippets:** 2306+
**Last Updated:** 2025-01-24

## Overview

Claude Code Templates is a comprehensive collection of ready-to-use configurations for Anthropic's Claude Code. It provides AI agents, custom commands, settings, hooks, integrations, and project templates to enhance development workflows.

---

## Installation

### Quick Start

```bash
# Interactive installation
npx claude-code-templates@latest

# Install specific components
npx claude-code-templates@latest --agent frontend-developer --command generate-tests --mcp github-integration
```

### Template Installation

```bash
# Modern syntax (recommended)
npx claude-code-templates@latest --template=react --yes
npx claude-code-templates@latest --template=python --yes
npx claude-code-templates@latest --template=nodejs --yes
npx claude-code-templates@latest --template=vue --yes
npx claude-code-templates@latest --template=django --yes
```

---

## Component Types

### 1. Templates

Complete project setups with pre-configured agents, commands, and settings.

**Installation:**
```bash
# Downloads complete template with multiple components
npx claude-code-templates@latest --template=react --yes
```

**Available Templates:**
- React
- Python (Django, Flask, FastAPI)
- Node.js
- Vue
- Angular

### 2. Agents

Specialized AI assistants for specific tasks.

**Installation:**
```bash
# Individual agents
npx claude-code-templates@latest --agent=react-performance --yes
npx claude-code-templates@latest --agent=api-security-audit --yes
npx claude-code-templates@latest --agent=database-optimization --yes
```

**Available Agents:**
- `react-performance` - React optimization specialist
- `frontend-security` - Frontend security expert
- `api-security-audit` - API security auditor
- `database-optimization` - Database performance optimizer
- `network-engineer` - Network configuration specialist
- `deployment-agent` - Deployment automation
- `incident-responder` - Production incident handler
- `monitoring-agent` - System health monitoring

### 3. Commands

Reusable slash commands for common tasks.

**Installation:**
```bash
npx claude-code-templates@latest --command=check-file --yes
npx claude-code-templates@latest --command=generate-tests --yes
npx claude-code-templates@latest --command=optimize-imports --yes
```

**Available Commands:**
- `/test` - Run test suite
- `/lint` - Lint codebase
- `/component` - Generate component
- `/route` - Generate route
- `/check-file` - File validation
- `/generate-tests` - Test generation
- `/optimize-imports` - Import optimization
- `/sync-automation-setup` - Setup automation
- `/log` - Task logging

### 4. MCP Integrations

Model Context Protocol server integrations.

**Installation:**
```bash
npx claude-code-templates@latest --mcp=github-integration --yes
npx claude-code-templates@latest --mcp=database-integration --yes
npx claude-code-templates@latest --mcp=deepgraph-react --yes
```

**Available MCPs:**
- GitHub integration
- Database integration
- DeepGraph React
- PostgreSQL integration

### 5. Settings

Pre-configured settings for various scenarios.

**Installation:**
```bash
# Permissions
npx claude-code-templates@latest --setting=permissions/allow-npm-commands
npx claude-code-templates@latest --setting=permissions/deny-sensitive-files

# Model selection
npx claude-code-templates@latest --setting=model/use-sonnet
npx claude-code-templates@latest --setting=model/use-haiku

# Telemetry
npx claude-code-templates@latest --setting=telemetry/enable-telemetry
npx claude-code-templates@latest --setting=telemetry/disable-telemetry

# Cleanup policies
npx claude-code-templates@latest --setting=cleanup/retention-7-days
npx claude-code-templates@latest --setting=cleanup/retention-90-days
```

### 6. Hooks

Automation hooks for pre/post tool execution.

**Installation:**
```bash
npx claude-code-templates@latest --hook=pre-commit-validation
npx claude-code-templates@latest --hook=git-workflow/auto-git-add
```

---

## Component Installation Paths

| Component Type | CLI Parameter | Installation Path | Example |
|----------------|---------------|-------------------|---------|
| **Template** | `--template=name` | Multiple files | Full project setup |
| **Agent** | `--agent=name` | `.claude/agents/` | Embedded in CLAUDE.md |
| **Command** | `--command=name` | `.claude/commands/` | `.claude/commands/name.md` |
| **MCP** | `--mcp=name` | `.mcp.json` | MCP configuration |

---

## Creating Custom Agents

### Agent File Structure

**File:** `.claude/agents/[agent-name].md`

```yaml
---
name: frontend-security
description: Use this agent when securing frontend applications. Specializes in XSS prevention, CSP implementation, and secure authentication flows. Examples: <example>Context: User needs to secure React app user: 'My React app is vulnerable to XSS attacks' assistant: 'I'll use the frontend-security agent to analyze and implement XSS protections' <commentary>Frontend security issues require specialized expertise</commentary></example>
color: red
---

# Frontend Security Agent

You are a Frontend Security specialist focusing on web application security.

## Core Expertise

- **XSS Prevention**: Input sanitization, output encoding, CSP
- **Authentication**: Secure token storage, OAuth flows
- **HTTPS**: Certificate management, mixed content

## Responsibilities

- Analyze frontend code for security vulnerabilities
- Implement Content Security Policy (CSP)
- Secure authentication flows
- Prevent XSS, CSRF, and clickjacking attacks

## Activation Triggers

- Security audit requests
- Authentication implementation
- React/Vue/Angular security issues
```

### Agent Creation Best Practices

```markdown
When creating specialized agents, always:
- Create files in `cli-tool/components/agents/` directory
- Follow the YAML frontmatter format exactly
- Include 2-3 realistic usage examples in description
- Use appropriate color coding for the domain
- Provide comprehensive domain expertise
- Include practical, actionable examples
- Test with the CLI installation command
- Implement clear expertise boundaries
```

---

## Custom Commands

### Command Template Structure

```markdown
# [Feature] Generator

Generate [feature type] for $ARGUMENTS following project conventions and best practices.

## Task

I'll analyze the project structure and create comprehensive [feature] including:

1. [Primary files/components]
2. [Secondary files/configuration]
3. [Tests and documentation]
4. [Integration with existing system]

## Generation Types

### Framework Components
- Component type 1 with proper structure
- Component type 2 with state management
- Component type 3 with styling and props

### Supporting Files
- Test files with comprehensive coverage
- Documentation and usage examples
- Configuration and setup files
- Integration scripts and utilities

## Best Practices

### Code Quality
- Follow project naming conventions
- Implement proper error boundaries
- Add comprehensive type definitions
- Include accessibility features

I'll adapt to your project's framework and follow established patterns.
```

---

## MCP Integration

### Standard MCP Configuration

```json
{
  "mcpServers": {
    "ServiceName MCP": {
      "command": "npx",
      "args": [
        "-y",
        "package-name@latest",
        "additional-args"
      ],
      "env": {
        "API_KEY": "required-env-var",
        "BASE_URL": "optional-base-url",
        "TIMEOUT": "30000",
        "RETRY_ATTEMPTS": "3"
      }
    }
  }
}
```

### Example: GitHub Integration

```json
{
  "mcpServers": {
    "GitHub Integration MCP": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-github@latest"
      ],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxxxxxxxxxx",
        "GITHUB_ORG": "your-organization",
        "GITHUB_REPO": "your-repository"
      }
    }
  }
}
```

---

## Hooks Configuration

### PreToolUse Hook

```json
{
  "PreToolUse": [
    {
      "matcher": "Edit|Write",
      "hooks": [
        {
          "type": "command",
          "command": "echo 'About to modify file: $CLAUDE_TOOL_FILE_PATH'"
        }
      ]
    }
  ]
}
```

### PostToolUse Hook

```json
{
  "description": "Automatically deploy to staging after successful tests",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "if [[ \"$CLAUDE_TOOL_FILE_PATH\" == *.js && -f package.json ]]; then npm test && npm run deploy:staging; fi"
          }
        ]
      }
    ]
  }
}
```

---

## Settings Configuration

### Settings File Structure

```json
// User Settings (Global)
// ~/.claude/settings.json

// Project Settings (Shared)
// .claude/settings.json

// Local Settings (Personal, Git Ignored)
// .claude/settings.local.json

// Enterprise Settings (Platform-specific)
// macOS: /Library/Application Support/ClaudeCode/managed-settings.json
// Linux/WSL: /etc/claude-code/managed-settings.json
// Windows: C:\ProgramData\ClaudeCode\managed-settings.json
```

### Example Settings

```json
{
  "framework": "react",
  "testFramework": "jest",
  "packageManager": "npm",
  "buildTool": "vite",
  "permissions": {
    "allowedTools": ["Read", "Write", "Bash"],
    "deniedPatterns": ["**/secrets/**", "**/.env"]
  },
  "model": "claude-sonnet-4-5"
}
```

---

## Supported Languages & Frameworks

### JavaScript/TypeScript

**Frameworks:** React, Vue, Angular, Node.js
**Status:**  Ready
**Components:** 7+ commands, 9+ hooks, 4+ MCPs

```bash
npx claude-code-templates@latest --template=react --yes
npx claude-code-templates@latest --template=vue --yes
npx claude-code-templates@latest --template=nodejs --yes
```

### Python

**Frameworks:** Django, Flask, FastAPI
**Status:**  Ready
**Components:** 5+ commands, 8+ hooks, 4+ MCPs

```bash
npx claude-code-templates@latest --template=python --yes
npx claude-code-templates@latest --template=django --yes
```

### Common (Universal)

**Frameworks:** Universal
**Status:**  Ready
**Components:** 2+ commands, 1+ hooks, 4+ MCPs

---

## Example Workflows

### React Performance Optimization

```bash
# Install React template
npx claude-code-templates@latest --template=react --yes

# Install performance agent
npx claude-code-templates@latest --agent=react-performance --yes

# Use in Claude Code
# User: "My React app is slow when rendering large lists"
# Agent analyzes and provides optimization strategies
```

### API Security Audit

```bash
# Install API security agent
npx claude-code-templates@latest --agent=api-security-audit --yes

# Use in Claude Code
# User: "Audit my REST API for security vulnerabilities"
# Agent performs comprehensive security analysis
```

### DevOps Automation

```bash
# Install deployment and monitoring agents
npx claude-code-templates@latest --agent=deployment-agent --yes
npx claude-code-templates@latest --agent=monitoring-agent --yes

# Install sync automation
npx claude-code-templates@latest --command=sync-automation-setup --yes
```

---

## Advanced Configuration

### Monorepo Setup

```bash
# Setup monorepo structure
npx claude-code-templates@latest --command=setup-monorepo --yes
```

**Configuration:**
```json
// .npmrc for hoisting (npm/yarn)
// package-lock=true
// workspaces-experimental=true
// hoist=true

// .pnpmfile.cjs for pnpm configuration
module.exports = {
  hooks: {
    readPackage: (pkg, context) => {
      // Modify dependencies or add scripts
      return pkg;
    }
  }
};
```

### Load Balancer Configuration

**Nginx:**
```nginx
http {
    upstream backend_servers {
        server backend1.example.com;
        server backend2.example.com;
        server backend3.example.com;
    }

    server {
        listen 80;
        server_name example.com;

        location / {
            proxy_pass http://backend_servers;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

**HAProxy:**
```haproxy
frontend http_frontend
    bind *:80
    mode http
    default_backend http_backend

backend http_backend
    mode http
    balance roundrobin
    server http1 192.168.1.10:80 check
    server http2 192.168.1.11:80 check
```

---

## Analysis Tools

### Component Statistics

```bash
# Analyze commands
npx claude-code-templates --commands-stats

# Analyze hooks
npx claude-code-templates --hooks-stats

# List installed agents
npx claude-code-templates@latest --list-agents
```

---

## Global Agent Management

```bash
# Create a global agent (one-time setup)
npx claude-code-templates@latest --create-agent customer-support

# List installed global agents
npx claude-code-templates@latest --list-agents

# Update an agent to latest version
npx claude-code-templates@latest --update-agent customer-support

# Remove an agent
npx claude-code-templates@latest --remove-agent customer-support
```

---

## Project Structure

```text
claude-code-templates/
   cli-tool/
      components/
         agents/          # AI agents
         commands/        # Slash commands
         mcps/           # MCP integrations
         settings/        # Configuration settings
         hooks/          # Automation hooks
      templates/          # Project templates
   docu/                   # Documentation
   docs/                   # Additional docs
```

---

## Best Practices

### 1. Start with Templates

Use complete templates for new projects:

```bash
npx claude-code-templates@latest --template=react --yes
```

### 2. Add Specialized Agents

Install agents for specific needs:

```bash
npx claude-code-templates@latest --agent=react-performance --yes
npx claude-code-templates@latest --agent=api-security-audit --yes
```

### 3. Configure Hooks

Automate workflows with hooks:

```bash
npx claude-code-templates@latest --hook=pre-commit-validation
npx claude-code-templates@latest --hook=git-workflow/auto-git-add
```

### 4. Integrate MCP Servers

Connect external services:

```bash
npx claude-code-templates@latest --mcp=github-integration --yes
npx claude-code-templates@latest --mcp=database-integration --yes
```

### 5. Customize Settings

Adjust permissions and models:

```bash
npx claude-code-templates@latest --setting=model/use-sonnet
npx claude-code-templates@latest --setting=permissions/allow-npm-commands
```

---

## Contributing

```bash
# Clone the repository
git clone https://github.com/davila7/claude-code-templates.git
cd claude-code-templates

# Navigate to the CLI tool directory
cd cli-tool

# Install dependencies
npm install

# Link for local testing
npm link

# Run test suite
npm test
```

---

## Use Cases

### 1. React Development

```bash
npx claude-code-templates@latest --template=react --yes
npx claude-code-templates@latest --agent=react-performance --yes
npx claude-code-templates@latest --command=generate-tests --yes
```

### 2. API Development

```bash
npx claude-code-templates@latest --template=nodejs --yes
npx claude-code-templates@latest --agent=api-security-audit --yes
npx claude-code-templates@latest --mcp=database-integration --yes
```

### 3. DevOps Automation

```bash
npx claude-code-templates@latest --agent=deployment-agent --yes
npx claude-code-templates@latest --agent=monitoring-agent --yes
npx claude-code-templates@latest --command=sync-automation-setup --yes
```

### 4. Security Auditing

```bash
npx claude-code-templates@latest --agent=api-security-audit --yes
npx claude-code-templates@latest --agent=frontend-security --yes
```

---

## Key Features

 **2306+ Code Snippets** - Comprehensive library
 **Multiple Templates** - React, Python, Node.js, Vue, Django
 **Specialized Agents** - Performance, security, DevOps
 **Custom Commands** - Reusable workflows
 **MCP Integrations** - External service connections
 **Hooks System** - Automation triggers
 **Settings Management** - Flexible configuration
 **Trust Score 10** - Highly trusted resource
 **Active Development** - Regular updates
 **Community Driven** - Open source contributions

---

## Further Resources

- GitHub: https://github.com/davila7/claude-code-templates
- Website: https://aitmpl.com
- Documentation: Browse components at `/components/` directory
- Community: Contribute via GitHub issues and PRs
