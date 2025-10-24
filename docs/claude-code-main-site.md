# Claude Code - Main Site Documentation

**Source:** Context7 - /websites/anthropic_s
**Last Updated:** 2025-01-24

## Overview

Claude Code is Anthropic's agentic coding tool that lives in your terminal, helping developers build features, debug, navigate codebases, and automate tasks to accelerate the coding process.

---

## Installation

### Requirements

- Node.js 18 or newer
- Anthropic account (Claude.ai or Claude Console)

### Install via npm

```bash
# Requires Node.js 18 or newer
npm install -g @anthropic-ai/claude-code

# Navigate to your project directory
cd /path/to/your-awesome-project

# Launch Claude Code (prompts for login on first use)
claude

# Expected output:
# Welcome to Claude Code!
# Please log in to your Claude.ai or Claude Console account...
# [Browser opens for authentication]
# Successfully authenticated!
# Claude Code is ready to use.
```

### VS Code Extension

```bash
# Alternative: Install the VS Code extension from marketplace
# Search for "Claude Code" in VS Code Extensions
# Or visit: https://marketplace.visualstudio.com/

# After installation:
# 1. Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
# 2. Type "Claude Code: Start Session"
# 3. Use the sidebar panel to interact with Claude
```

---

## Usage Modes

### Interactive Mode

```bash
# Interactive mode - opens a conversational session
claude
```

### One-Shot Mode

```bash
# One-shot mode - execute a single task
claude -p "Fix all TypeScript errors in src/"
```

### Stream Processing

```bash
# Pipe input to Claude for stream processing
tail -f app.log | claude -p "Alert me if you see any error patterns"

# Expected behavior:
# Claude analyzes the codebase, executes the requested task,
# and provides feedback with file paths and line numbers
```

---

## Core Capabilities

### 1. Build Features

Create complete features with proper error handling, tests, and database migrations:

```bash
# Start Claude and describe the feature you want
claude -p "Create a REST API endpoint that accepts a JSON payload with user data, validates the email format, stores it in a PostgreSQL database, and returns a 201 status with the created user ID"

# Claude will:
# 1. Analyze your project structure
# 2. Create a plan (e.g., "I'll add a POST /users endpoint in routes/users.ts")
# 3. Write the code with proper error handling
# 4. Add database migrations if needed
# 5. Update tests
# 6. Run the tests to verify functionality

# Example generated code in routes/users.ts:
# import { Router } from 'express';
# import { validateEmail } from '../utils/validation';
# import { db } from '../db';
#
# const router = Router();
#
# router.post('/users', async (req, res) => {
#   try {
#     const { email, name } = req.body;
#     if (!validateEmail(email)) {
#       return res.status(400).json({ error: 'Invalid email format' });
#     }
#     const result = await db.query(
#       'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id',
#       [email, name]
#     );
#     res.status(201).json({ id: result.rows[0].id });
#   } catch (error) {
#     res.status(500).json({ error: 'Internal server error' });
#   }
# });
```

### 2. Debug and Fix Issues

```bash
# Paste an error message and let Claude diagnose and fix it
claude -p "I'm getting this error: TypeError: Cannot read property 'map' of undefined at UserList.tsx:45"

# Claude will:
# 1. Read UserList.tsx around line 45
# 2. Identify the undefined variable
# 3. Trace the data flow to find the root cause
# 4. Implement a fix with proper null checking
# 5. Test the fix

# Or paste a stack trace directly
claude -p "$(cat error.log)"

# Example fix Claude might apply to UserList.tsx:45:
# Before:
# const userNames = users.map(u => u.name);
#
# After:
# const userNames = users?.map(u => u.name) ?? [];
#
# Claude reports: "Fixed undefined users in UserList.tsx:45 by adding optional chaining and null coalescing"
```

### 3. Navigate Codebase

```bash
# Ask questions about your codebase
claude -p "Where is the authentication logic implemented?"

# Expected response:
# "Authentication is handled in src/middleware/auth.ts:23-67
# The main function is authenticateUser() which:
# - Validates JWT tokens from the Authorization header
# - Checks token expiration
# - Loads user data from Redis cache
```

**Example: Understand Payment Processing Flow**

```plaintext
api/payments.ts:89 (createPayment)
  ’ utils/validators.ts:34 (validatePaymentData)
  ’ services/stripe.ts:123 (processPayment)
  ’ models/transaction.ts:56 (createTransaction)
  ’ services/email.ts:78 (sendConfirmation)
  ’ models/user.ts:234 (updateBalance)
```

### 4. Resolve Git Merge Conflicts

```bash
git merge feature-branch
# CONFLICT (content): Merge conflict in src/app.ts
claude -p "Resolve the merge conflict in src/app.ts by keeping both changes and ensuring the code works"
```

---

## Automation Patterns

### Automate ESLint Fixes

```bash
claude -p "Fix all ESLint errors in this project"
```

### Generate Release Notes

```bash
claude -p "Generate release notes for all commits since v1.2.0, categorized by feature, bugfix, and breaking changes"
```

### Batch Update Imports

```bash
claude -p "Rename all imports from 'lodash' to 'lodash-es' for better tree-shaking"
```

### Batch Convert Files

```bash
find src/ -name "*.js" | xargs -I {} claude -p "Convert {} to TypeScript with proper types"
```

### Automate Dependency Updates

```bash
#!/bin/bash
# auto-update-deps.sh

outdated=$(npm outdated --json)

echo "$outdated" | claude -p "
  These packages are outdated. For each package:
  1. Check the changelog for breaking changes
  2. If safe, update in package.json
  3. Run tests to verify nothing breaks
  4. Create a commit with description of what was updated

  Skip any packages with major version bumps that have breaking changes.
"
```

---

## Security Features

### Secret Redaction

Claude automatically redacts sensitive data from logs:

```bash
# Claude automatically redacts sensitive data:
claude -p "Deploy the API with credentials: API_KEY=sk_live_abc123 DB_PASS=secret123"

# In logs, secrets are shown as: API_KEY=****** DB_PASS=******
```

### Security Scanning

```bash
# Scan for common vulnerabilities
claude -p "Scan this codebase for security vulnerabilities including: SQL injection, XSS, CSRF, insecure dependencies, hardcoded secrets, and authentication issues"

# Auto-fix security issues
claude -p "Fix all critical and high severity security issues found in the scan"
```

### Local-Only Mode

Process sensitive code without sending data to external servers:

```bash
claude --local -p "Analyze this authentication system"

# All processing happens on-device
```

---

## Enterprise Deployment

### AWS Bedrock Configuration

```bash
# Configure Claude Code to use AWS Bedrock
# Set environment variables in ~/.bashrc or ~/.zshrc:

export CLAUDE_CODE_PROVIDER="aws-bedrock"
export AWS_REGION="us-east-1"
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"

# Or use IAM roles in EC2/ECS:
export CLAUDE_CODE_PROVIDER="aws-bedrock"
export AWS_REGION="us-east-1"
# Credentials automatically loaded from IAM role

# Launch Claude Code (now using Bedrock):
claude -p "Analyze the security posture of this application"

# All requests now route through AWS Bedrock with:
# - VPC isolation
# - CloudWatch logging
# - IAM-based access control
# - Data residency in your AWS region
```

### Google Vertex AI Configuration

```bash
# Configure Claude Code to use Vertex AI
export CLAUDE_CODE_PROVIDER="vertex-ai"
export GOOGLE_CLOUD_PROJECT="your-project-id"
export GOOGLE_CLOUD_REGION="us-central1"
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"

# Features with Vertex AI:
# - Private networking
# - Cloud Audit Logs
# - VPC Service Controls
# - Data residency compliance
```

---

## CI/CD Integration

### AI Code Review in GitHub Actions

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v3
      - run: npm install -g @anthropic-ai/claude-code
      - name: Review changes
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "Review the changes in this PR. Check for: security issues, performance problems, missing error handling, and inconsistent code style. Post findings as a comment on the PR"
```

### Automated Translation Workflow

```yaml
name: Auto-translate new strings

on:
  push:
    branches: [main]

jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install -g @anthropic-ai/claude-code
      - name: Translate and create PR
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "Scan for new English strings in src/i18n/en.json that don't exist in src/i18n/fr.json. Translate them to French and add them to fr.json. Create a git commit and open a PR for @lang-fr-team to review"
```

### Custom Deployment with Validation

```bash
#!/bin/bash
# deploy-with-validation.sh

SERVICE_NAME=$1
ENVIRONMENT=$2

claude -p "
  I'm deploying $SERVICE_NAME to $ENVIRONMENT. Please:

  1. Run the test suite and ensure 100% pass rate
  2. Check for any uncommitted changes
  3. Verify environment variables are set correctly
  4. Build the production bundle
  5. Run the deployment command
  6. Monitor logs for 2 minutes after deployment
  7. If you see any errors, automatically rollback
  8. Send a Slack notification to #deployments with status

  Abort if any step fails and explain why."
```

---

## Log Analysis and Monitoring

### Real-time Log Monitoring

```bash
# Monitor application logs in real-time
tail -f app.log | claude -p "If you see an OOM error, identify the memory leak and suggest a fix" > analysis.md
```

### Real-time Anomaly Detection

```bash
tail -f /var/log/app/production.log | claude -p "Watch for anomalies, error spikes, or suspicious patterns. If you detect any critical issues, send a Slack alert to #ops-alerts with details"
```

### Identify Bugs in Code Diffs

```bash
git diff main | claude -p "Identify any potential bugs in this diff" | tee review.txt
```

### Generate Code Quality Reports

```bash
{ echo "=== Test Coverage ==="
npm run coverage
echo "=== Linting Issues ==="
npm run lint
echo "=== Type Errors ==="
npm run typecheck
} | claude -p "Summarize the code quality issues and prioritize them by severity" > weekly-report.md
```

---

## Configuration

### Custom Settings

**File:** `~/.config/claude-code/settings.json`

```json
{
  "model": "claude-sonnet-4.5",
  "maxTokens": 200000,
  "temperature": 0.7,

  // Custom system prompts
  "systemPrompts": [
    "Always use TypeScript strict mode",
    "Follow company coding standards: https://internal-wiki.company.com/coding-standards",
    "Add JSDoc comments for all public functions"
  ],

  // File exclusion patterns
  "excludePatterns": [
    "**/node_modules/**",
    "**/.git/**",
    "**/dist/**",
    "**/*.min.js"
  ],

  // Hooks for automation
  "hooks": {
    "pre-commit": "npm run lint && npm test",
    "post-edit": "npm run format"
  },

  // Custom slash commands
  "commands": {
    "/review": "Review this code for security issues, performance problems, and best practices violations",
    "/test": "Write comprehensive unit tests with edge cases for the selected code",
    "/docs": "Generate JSDoc documentation for all functions in this file"
  }
}
```

### Data Retention and Privacy

```json
{
  "privacy": {
    "shareConversations": false,
    "logLevel": "error",
    "redactSecrets": true,
    "localOnly": false
  }
}
```

---

## MCP Server Integration

### Configure MCP Servers

**File:** `~/.config/claude-code/mcp_settings.json`

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-google-drive"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-client-id",
        "GOOGLE_CLIENT_SECRET": "your-secret"
      }
    },
    "figma": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-figma"],
      "env": {
        "FIGMA_TOKEN": "your-figma-token"
      }
    },
    "jira": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-jira"],
      "env": {
        "JIRA_URL": "https://yourcompany.atlassian.net",
        "JIRA_TOKEN": "your-jira-token"
      }
    }
  }
}
```

### Create Custom MCP Server

```typescript
// Create a custom MCP server for your internal tools
// File: mcp-servers/company-tools/index.ts

import { McpServer } from '@anthropic-ai/mcp-sdk';

const server = new McpServer({
  name: 'company-tools',
  version: '1.0.0',
});

// Add a tool to query internal API
server.addTool({
  name: 'query_customer_data',
  description: 'Query customer data from internal CRM',
  parameters: {
    customer_id: { type: 'string', required: true },
  },
  handler: async ({ customer_id }) => {
    const response = await fetch(`https://internal-crm.company.com/api/customers/${customer_id}`, {
      headers: { 'Authorization': `Bearer ${process.env.CRM_TOKEN}` }
    });
    return response.json();
  },
});

// Add a tool to deploy services
server.addTool({
  name: 'deploy_service',
  description: 'Deploy a service to staging or production',
  parameters: {
    service_name: { type: 'string', required: true },
    environment: { type: 'string', enum: ['staging', 'production'], required: true },
  },
  handler: async ({ service_name, environment }) => {
    // Trigger deployment via internal CD system
    const result = await triggerDeployment(service_name, environment);
    return { status: 'deployed', url: result.url };
  },
});

server.start();

// Register in ~/.config/claude-code/mcp_settings.json:
// {
//   "mcpServers": {
//     "company-tools": {
//       "command": "node",
//       "args": ["/path/to/mcp-servers/company-tools/index.js"],
//       "env": {
//         "CRM_TOKEN": "xxx",
//         "DEPLOY_TOKEN": "yyy"
//       }
//     }
//   }
// }

// Usage:
// claude -p "Query customer data for customer ID 12345 and generate a support summary"
// claude -p "Deploy the payment-service to staging"
```

---

## Use Cases

### 1. Feature Development

Build complete features with error handling and tests:

```bash
claude -p "Create user authentication with JWT tokens"
```

### 2. Bug Fixing

Diagnose and fix errors automatically:

```bash
claude -p "$(cat error.log)"
```

### 3. Code Navigation

Understand complex codebases:

```bash
claude -p "Explain the payment processing flow"
```

### 4. Refactoring

Modernize codebases at scale:

```bash
claude -p "Refactor all class components to hooks"
```

### 5. Testing

Generate comprehensive test suites:

```bash
claude -p "Write tests for the authentication module"
```

### 6. Documentation

Auto-generate documentation:

```bash
claude -p "Generate API documentation from the codebase"
```

### 7. Security Audits

Identify and fix security issues:

```bash
claude -p "Audit this code for security vulnerabilities"
```

### 8. Performance Optimization

Optimize slow code:

```bash
claude -p "Optimize the database queries in this file"
```

### 9. Code Reviews

Automated PR reviews:

```bash
claude -p "Review this PR for quality and security"
```

### 10. Deployment Automation

Automate deployment workflows:

```bash
claude -p "Deploy to production with validation"
```

---

## Best Practices

### 1. Provide Clear Context

Always describe what you want clearly:

```bash
# Good
claude -p "Create a POST endpoint for user registration with email validation and password hashing"

# Bad
claude -p "Make an endpoint"
```

### 2. Use One-Shot Mode for Automation

Automate repetitive tasks:

```bash
# Good for automation
claude -p "Fix all linting errors" > report.txt

# Good for exploration
claude  # Interactive mode
```

### 3. Leverage MCP Servers

Connect to external services for richer functionality:

```bash
# With Jira MCP server
claude -p "Create a Jira ticket for this bug with details from the logs"
```

### 4. Secure Sensitive Operations

Use local mode for sensitive code:

```bash
claude --local -p "Analyze authentication code"
```

### 5. Integrate into CI/CD

Automate code quality checks:

```yaml
# In GitHub Actions
- run: claude -p "Review PR for security issues"
```

---

## Key Features

 **Natural Language Interface** - Code in plain English
 **Full Codebase Understanding** - Analyzes entire projects
 **Automated Bug Fixing** - Diagnoses and fixes errors
 **Git Integration** - Handles commits, merges, conflicts
 **Security First** - Secret redaction, local mode
 **Enterprise Ready** - AWS Bedrock, Google Vertex AI
 **CI/CD Integration** - GitHub Actions, GitLab CI
 **MCP Support** - Connect to external services
 **Custom Slash Commands** - Reusable workflows
 **Multi-Provider** - Anthropic, OpenAI, AWS, Google

---

## Further Resources

- Official Site: https://claude.com/claude-code
- Documentation: https://docs.anthropic.com/
- GitHub: https://github.com/anthropics/claude-code
- VS Code Extension: https://marketplace.visualstudio.com/
