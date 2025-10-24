# Claude Code Cookbook

**Source:** Context7 - /wasabeef/claude-code-cookbook
**Trust Score:** 9.4
**Code Snippets:** 2736+
**Last Updated:** 2025-01-24

## Overview

The Claude Code Cookbook is a comprehensive collection of practical examples, usage patterns, and best practices for working with Claude Code. It includes advanced CLI commands, design patterns, automation workflows, and integration examples.

---

## Design Patterns CLI

### Basic Usage

```bash
/design-patterns [analysis_target] [options]

# Analyze patterns for entire project
/design-patterns

# Suggest patterns for specific file
/design-patterns src/services/user.js --suggest

# Check SOLID principles
/design-patterns --solid

# Detect anti-patterns
/design-patterns --anti-patterns
```

### Advanced Options

```bash
# See what happens if you use a pattern
/design-patterns --impact-analysis Repository

# Get example code for a pattern
/design-patterns --generate Factory --for src/models/Product.js

# Find patterns that work well together
/design-patterns --combine --context "API with caching"

# Check your architecture
/design-patterns --architecture MVC
```

### Analysis Report Structure

```text
Design Patterns Analysis Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Currently Used Patterns
├─ Observer Pattern: EventEmitter (12 locations)
├─ Factory Pattern: UserFactory (3 locations)
├─ Singleton Pattern: DatabaseConnection (1 location)
└─ Strategy Pattern: PaymentProcessor (5 locations)

Recommended Patterns
├─ [HIGH] Repository Pattern
│  └─ Target: src/models/*.js
│  └─ Reason: Separation of data access logic
│  └─ Example:
│      class UserRepository {
│        async findById(id) { ... }
│        async save(user) { ... }
│      }
│
├─ [MED] Command Pattern
│  └─ Target: src/api/handlers/*.js
│  └─ Reason: Request processing unification
│
└─ [LOW] Decorator Pattern
   └─ Target: src/middleware/*.js
   └─ Reason: Improved feature combination

SOLID Principle Violations
├─ [S] UserService: handles both auth and permissions
├─ [O] PaymentGateway: requires modification for new payment methods
├─ [D] EmailService: directly depends on concrete classes
└─ [I] IDataStore: contains unused methods

Refactoring Proposals
1. Split UserService into auth and permission management
2. Introduce PaymentStrategy interface
3. Define EmailService interface
4. Separate IDataStore by usage
```

---

## Strategy Pattern Implementation

### Before (Problem Code)

```javascript
class OrderService {
  processOrder(order, paymentType) {
    if (paymentType === "credit") {
      // Credit card processing
    } else if (paymentType === "paypal") {
      // PayPal processing
    }
    // Other payment methods...
  }
}
```

### After (Applying Strategy Pattern)

```javascript
// Strategy interface
class PaymentStrategy {
  process(amount) {
    throw new Error("Must implement process method");
  }
}

// Concrete strategies
class CreditCardPayment extends PaymentStrategy {
  process(amount) {
    /* Implementation */
  }
}

class PayPalPayment extends PaymentStrategy {
  process(amount) {
    /* Implementation */
  }
}

// Context
class OrderService {
  constructor(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }

  processOrder(order) {
    this.paymentStrategy.process(order.total);
  }
}

// Usage
const service = new OrderService(new CreditCardPayment());
service.processOrder(order);
```

---

## Spec Mode

### Basic Usage

Spec Mode allows you to generate detailed specifications from minimal requirements.

```bash
# Request Spec Mode with minimal requirements
"Create spec for [feature description]"

# Gradual expansion (Kiro style):
# 1. Simple requirements → Automatic generation of detailed user stories
# 2. Structured requirements using EARS notation
# 3. Specification refinement through gradual dialogue
# 4. Generation of 3 independent files:
#    - requirements.md: Requirements using EARS notation
#    - design.md: Design with Mermaid diagrams and TypeScript interfaces
#    - tasks.md: Implementation plan with automatic best practices
```

### Minimal Input Examples

```bash
# Create spec for new feature
"Product review system
- Star rating functionality
- Comment posting
- Image upload"

# Create spec for system feature
"User authentication
- OAuth support
- Multi-factor authentication"

# Create spec for API feature
"Payment system API
- Stripe integration
- Security focus"

# Complex feature spec
"Create chat feature spec. Include WebSocket, real-time notifications, and history management"

# Database integration spec
"Create inventory management spec for e-commerce site. Include product addition, stock updates, and alert functionality"

# Frontend feature spec
"Create React dashboard spec. Include chart display, filters, and export functionality"

# Backend feature spec
"Create RESTful API spec. Include authentication, validation, and logging"
```

### User Story Generation

**Input:**
```bash
"User management system
- Login functionality
- Profile editing
- Administrator permissions"
```

**Output:**
```markdown
Claude: "I'll generate detailed user stories from your requirements.
Is this understanding correct?

Automatically generated user stories:
- User registration and authentication (OAuth compatible)
- Profile management (avatar, settings)
- Permission management (RBAC)
- Password reset functionality
- Security audit logs

I've added some details you didn't mention. Anything else we need?"
```

### Automatic Codebase Analysis

```markdown
Claude: "After analyzing your codebase, here's my recommended architecture:

Codebase Analysis Results:
- Authentication: JWT + Express.js (v4.18.x)
- Database: PostgreSQL (v14+)
- Frontend: React + TypeScript (v18+)
- Existing patterns: Repository Pattern, service layer separation

Recommended Kiro Architecture:
- Clean Architecture compliance
- Domain-Driven Design elements
- Partial CQRS pattern application
- Automated security best practices

Shall we proceed with this design?"
```

### Automatic Best Practices Application

```markdown
Automatically generated implementation strategy:

1. Security-first development
   - Automatic incorporation of OWASP Top 10 countermeasures
   - Automatic implementation of encryption and hashing
   - Automatic generation of security tests

2. Enforcement of clean architecture
   - Automatic implementation of layer separation
   - Automatic application of dependency inversion
   - Enforcement of testable design

3. Performance optimization
   - Automatic implementation of caching strategy
   - Database optimization
   - Utilization of asynchronous processing
```

### Real-World Example

```bash
"Create a spec for a file sharing system (with encryption)"
→ Production-level encrypted file sharing application completed in 2 days
→ Automatic application of security best practices
→ No additional prompts needed
```

---

## Plan Mode

### Basic Usage

```bash
# Implementation plan for a new feature
"Create an implementation plan for user authentication feature"

# System design plan
"Create an implementation plan for microservice division"

# Refactoring plan
"Create an implementation plan for refactoring legacy code"
```

### Detailed Plan Examples

```bash
# Complex system implementation
"Create an implementation plan for an online payment system, including Stripe integration, security, and error handling"

# Frontend implementation
"Create an implementation plan for a React dashboard, including state management, component design, and testing"

# Backend implementation
"Create an implementation plan for a RESTful API, including authentication, validation, and logging"

# DevOps implementation
"Create an implementation plan for a CI/CD pipeline, including test automation, deployment, and monitoring"
```

### Advanced Integration Examples

```bash
# Complex feature implementation
"Create an implementation plan for chat feature. Include WebSocket, real-time notifications, and history management"

# Database design
"Create a database design plan for e-commerce site. Include product, order, and user management"

# API design
"Create an implementation plan for GraphQL API. Include authentication, caching, and rate limiting"

# Infrastructure design
"Create an implementation plan for Dockerization. Include development environment, production environment, and CI/CD"
```

### When to Use Plan Mode

**Plan Mode recommended for:**
- System-wide design
- Infrastructure setup
- Refactoring
- Technology selection
- Architecture changes

---

## Role-Based Analysis

### Basic Role Usage

```bash
# Security-focused analysis
/role security
cat app.js
"Analyze potential security risks in this code in detail"

# Architecture perspective evaluation
/role architect
ls -la src/
"Present problems with current structure and improvement proposals"

# Test strategy development
/role qa
"Propose optimal test strategy for this project"
```

### Sequential Multi-Role Analysis

```bash
# Analysis with multiple roles
/role security
"First, verification from security perspective"
git diff HEAD~1

/role reviewer
"Next, overall code quality review"

/role architect
"Finally, evaluation from architecture perspective"
```

### Role-Specific Output Format

```bash
/role security

Security Analysis Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Vulnerability: SQL Injection
Severity: High
Applicable location: db.js:42
Correction proposal: Use parameterized queries
```

---

## Smart Review

### Basic Usage

```bash
# Analyze the current directory
/smart-review
"Suggest the optimal role and approach"

# Analyze a specific file
/smart-review src/auth/login.js
"Suggest the best review method for this file"

# Analyze an error log
/smart-review error.log
"Suggest the best approach to resolve this error"
```

---

## Prompt Analysis

### Check Prompt Quality

```bash
# Quality check combined with prompt file
cat your-prompt.md
/check-prompt
"Evaluate the quality of this prompt and suggest improvements"

# Comparison of multiple prompt files
cat prompt-v1.md && echo "---" && cat prompt-v2.md
/check-prompt
"Compare the two versions and analyze improved points and remaining issues"

# Analysis combined with actual error logs
cat execution-errors.log
/check-prompt --deep
"Identify potential prompt issues that may have caused this error"
```

---

## Sequential Thinking

### Advanced Integration Examples

```bash
# Complex implementation strategy
"Analyze authentication system implementation using sequential-thinking. Consider OAuth2, JWT, and session management"

# Bug cause analysis
"Analyze memory leak cause using sequential-thinking. Include code review and profiling results"

# Refactoring strategy
cat src/complex_module.js
"Create refactoring strategy for this module using sequential-thinking"

# Technology selection
"Analyze frontend framework selection using sequential-thinking. Consider project requirements and constraints"
```

---

## Context7 Integration

### Technical Research Queries

```bash
# Request technical investigation
"Use context7 to research Rust's ownership system and explain it for beginners"

# Request error resolution
"Use context7 to search for common causes and solutions for Python's ImportError"

# Confirm best practices
"Use context7 to find best practices for React performance optimization"
```

### Multilingual Examples

**French:**
```bash
# Demander une recherche technique
"Recherchez des informations sur le système de propriété de Rust en utilisant context7 et expliquez-le pour les débutants"

# Demander une solution d'erreur
"Recherchez les causes communes et solutions pour l'ImportError de Python en utilisant context7"

# Confirmer les bonnes pratiques
"Recherchez les bonnes pratiques pour l'optimisation des performances React en utilisant context7"
```

**Japanese:**
```bash
# 技術調査の依頼
「context7 で Rust の所有権システムについて調べて、初心者向けに解説して」

# エラー解決の依頼
「context7 で Python の ImportError の一般的な原因と解決方法を検索して」

# ベストプラクティスの確認
「context7 で React のパフォーマンス最適化のベストプラクティスを探して」
```

---

## Command Template

### Basic Command Structure

```bash
/command-name
"Explanation when executing"

# Example with option
/command-name --option1
"Explanation when using option 1"

# Example with parameterized option
/command-name --option2 value
"Example of using parameterized option"

# Combining multiple options
/command-name --option1 --flag
"Example combining multiple options"
```

---

## Best Practices

### 1. Use Spec Mode for New Features

Start with minimal requirements and let Claude expand them into detailed specifications:

```bash
"Payment system
- Credit card support
- Security focus"
```

Claude will automatically:
- Generate detailed user stories
- Create EARS notation requirements
- Design architecture with diagrams
- Plan implementation with best practices

### 2. Leverage Design Patterns Analysis

Regularly analyze your codebase for pattern opportunities:

```bash
/design-patterns
/design-patterns --solid
/design-patterns --anti-patterns
```

### 3. Use Role-Based Analysis for Comprehensive Reviews

Apply multiple perspectives to critical code:

```bash
/role security
# Security analysis

/role architect
# Architecture review

/role qa
# Test strategy
```

### 4. Combine Plan Mode with Implementation

Create detailed plans before coding:

```bash
"Create implementation plan for microservices migration"
# Review plan
# Execute plan step-by-step
```

### 5. Utilize Context7 for Research

Always verify best practices and solutions:

```bash
"Use context7 to research [technology/pattern/solution]"
```

---

## Key Features

✓ **2736+ Code Snippets** - Extensive practical examples
✓ **Design Patterns Analysis** - Automated pattern suggestions
✓ **Spec Mode** - Requirements to implementation automation
✓ **Plan Mode** - Detailed implementation planning
✓ **Role-Based Analysis** - Multi-perspective code review
✓ **Context7 Integration** - Research and best practices
✓ **SOLID Principles** - Automated compliance checking
✓ **Multilingual Support** - EN, ES, FR, PT, JP, KO
✓ **Trust Score 9.4** - Community-vetted resource
✓ **Active Development** - Regular updates with new patterns

---

## Use Cases

### 1. Feature Development

```bash
# Generate spec
"Create spec for user authentication with OAuth"

# Create implementation plan
"Create implementation plan for authentication feature"

# Implement with pattern analysis
/design-patterns src/auth/ --suggest

# Review with multiple roles
/role security
/role architect
```

### 2. Code Quality Improvement

```bash
# Analyze patterns
/design-patterns

# Check SOLID principles
/design-patterns --solid

# Detect anti-patterns
/design-patterns --anti-patterns

# Generate refactoring proposals
/design-patterns --suggest
```

### 3. Architecture Design

```bash
# Create architecture plan
"Create architecture plan for e-commerce platform"

# Analyze with architect role
/role architect

# Validate design patterns
/design-patterns --architecture Microservices
```

### 4. Security Auditing

```bash
# Security analysis
/role security
git diff HEAD~1

# Check for vulnerabilities
/design-patterns --anti-patterns

# Review implementation
/smart-review src/auth/
```

---

## Further Resources

- GitHub: https://github.com/wasabeef/claude-code-cookbook
- Context7: https://context7.com/wasabeef/claude-code-cookbook
- Documentation: Browse locales for multilingual examples
- Community: Contribute via GitHub issues and PRs
