# Claude Code SDK - Python

**Source:** Context7 - /anthropics/claude-code-sdk-python
**Last Updated:** 2025-01-24

## Overview

The Claude Agent SDK for Python enables programmatic interaction with Claude Code, allowing developers to send prompts, manage options, utilize tools, and build custom workflows for code generation and execution.

---

## Installation

### Prerequisites

- Python 3.10+
- Node.js
- Claude Code CLI: `npm install -g @anthropic-ai/claude-code`

### Install SDK

```bash
pip install claude-agent-sdk
```

### Set API Key

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

---

## Quick Start

### Basic Query

```python
import anyio
from claude_agent_sdk import query

async def main():
    async for message in query(prompt="What is 2 + 2?"):
        print(message)

anyio.run(main)
```

### Query with Response Handling

```python
from claude_agent_sdk import query, AssistantMessage, TextBlock

async def main():
    async for message in query(prompt="Hello Claude"):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(block.text)

anyio.run(main)
```

---

## Basic Usage: query()

The `query()` function is an async function for querying Claude Code. It returns an `AsyncIterator` of response messages.

### Simple Query

```python
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, TextBlock

async for message in query(prompt="Hello Claude"):
    if isinstance(message, AssistantMessage):
        for block in message.content:
            if isinstance(block, TextBlock):
                print(block.text)
```

### Query with Options

```python
options = ClaudeAgentOptions(
    system_prompt="You are a helpful assistant",
    max_turns=1
)

async for message in query(prompt="Tell me a joke", options=options):
    print(message)
```

---

## Using Tools

### Enable Tools in Queries

```python
options = ClaudeAgentOptions(
    allowed_tools=["Read", "Write", "Bash"],
    permission_mode='acceptEdits'  # auto-accept file edits
)

async for message in query(
    prompt="Create a hello.py file",
    options=options
):
    # Process tool use and results
    pass
```

---

## Working Directory

### Set Working Directory

```python
from pathlib import Path

options = ClaudeAgentOptions(
    cwd="/path/to/project"  # or Path("/path/to/project")
)
```

---

## ClaudeSDKClient

`ClaudeSDKClient` supports bidirectional, interactive conversations with Claude Code, enabling custom tools and hooks.

### Basic Client Usage

```python
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions

options = ClaudeAgentOptions(
    system_prompt="You are a helpful coding assistant"
)

async with ClaudeSDKClient(options=options) as client:
    await client.query("Create a Python function to calculate factorial")

    async for msg in client.receive_response():
        print(msg)
```

---

## Custom Tools (In-Process SDK MCP Servers)

A **custom tool** is a Python function that you can offer to Claude for Claude to invoke as needed.

Custom tools are implemented as in-process MCP servers that run directly within your Python application, eliminating the need for separate processes.

### Creating a Simple Tool

```python
from claude_agent_sdk import tool, create_sdk_mcp_server, ClaudeAgentOptions, ClaudeSDKClient

# Define a tool using the @tool decorator
@tool("greet", "Greet a user", {"name": str})
async def greet_user(args):
    return {
        "content": [
            {"type": "text", "text": f"Hello, {args['name']}!"}
        ]
    }

# Create an SDK MCP server
server = create_sdk_mcp_server(
    name="my-tools",
    version="1.0.0",
    tools=[greet_user]
)

# Use it with Claude
options = ClaudeAgentOptions(
    mcp_servers={"tools": server},
    allowed_tools=["mcp__tools__greet"]
)

async with ClaudeSDKClient(options=options) as client:
    await client.query("Greet Alice")

    # Extract and print response
    async for msg in client.receive_response():
        print(msg)
```

### Benefits of SDK MCP Servers

- **No subprocess management** - Runs in the same process as your application
- **Better performance** - No IPC overhead for tool calls
- **Simpler deployment** - Single Python process instead of multiple
- **Easier debugging** - All code runs in the same process
- **Type safety** - Direct Python function calls with type hints

---

## Migration from External to SDK MCP Servers

### Before: External MCP Server

```python
# BEFORE: External MCP server (separate process)
options = ClaudeAgentOptions(
    mcp_servers={
        "calculator": {
            "type": "stdio",
            "command": "python",
            "args": ["-m", "calculator_server"]
        }
    }
)
```

### After: SDK MCP Server

```python
# AFTER: SDK MCP server (in-process)
from my_tools import add, subtract  # Your tool functions

calculator = create_sdk_mcp_server(
    name="calculator",
    tools=[add, subtract]
)

options = ClaudeAgentOptions(
    mcp_servers={"calculator": calculator}
)
```

### Mixed Server Support

You can use both SDK and external MCP servers together:

```python
options = ClaudeAgentOptions(
    mcp_servers={
        "internal": sdk_server,      # In-process SDK server
        "external": {                # External subprocess server
            "type": "stdio",
            "command": "external-server"
        }
    }
)
```

---

## Hooks

A **hook** is a Python function that the Claude Code application (not Claude) invokes at specific points of the Claude agent loop. Hooks can provide deterministic processing and automated feedback for Claude.

For more details, see [Claude Code Hooks Reference](https://docs.anthropic.com/en/docs/claude-code/hooks).

### PreToolUse Hook Example

Implement a hook to intercept and validate bash commands:

```python
from claude_agent_sdk import ClaudeAgentOptions, ClaudeSDKClient, HookMatcher

async def check_bash_command(input_data, tool_use_id, context):
    tool_name = input_data["tool_name"]
    tool_input = input_data["tool_input"]

    if tool_name != "Bash":
        return {}

    command = tool_input.get("command", "")
    block_patterns = ["foo.sh"]

    for pattern in block_patterns:
        if pattern in command:
            return {
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "deny",
                    "permissionDecisionReason": f"Command contains invalid pattern: {pattern}",
                }
            }

    return {}

options = ClaudeAgentOptions(
    allowed_tools=["Bash"],
    hooks={
        "PreToolUse": [
            HookMatcher(matcher="Bash", hooks=[check_bash_command]),
        ],
    }
)

async with ClaudeSDKClient(options=options) as client:
    # Test 1: Command with forbidden pattern (will be blocked)
    await client.query("Run the bash command: ./foo.sh --help")
    async for msg in client.receive_response():
        print(msg)

    print("\n" + "=" * 50 + "\n")

    # Test 2: Safe command that should work
    await client.query("Run the bash command: echo 'Hello from hooks example!'")
    async for msg in client.receive_response():
        print(msg)
```

---

## Error Handling

### Common Exceptions

```python
from claude_agent_sdk import (
    ClaudeSDKError,      # Base error
    CLINotFoundError,    # Claude Code not installed
    CLIConnectionError,  # Connection issues
    ProcessError,        # Process failed
    CLIJSONDecodeError,  # JSON parsing issues
)

try:
    async for message in query(prompt="Hello"):
        pass
except CLINotFoundError:
    print("Please install Claude Code")
except ProcessError as e:
    print(f"Process failed with exit code: {e.exit_code}")
except CLIJSONDecodeError as e:
    print(f"Failed to parse response: {e}")
```

---

## Development

### Install Development Dependencies

```bash
pip install -e ".[dev]"
```

### Run Tests

```bash
# Run all tests
python -m pytest tests/

# Run specific test file
python -m pytest tests/test_client.py
```

### Linting and Formatting

```bash
# Lint and auto-fix
python -m ruff check src/ tests/ --fix

# Format code
python -m ruff format src/ tests/
```

### Type Checking

```bash
python -m mypy src/
```

---

## End-to-End Tests

### Prerequisites

```bash
# Set API key
export ANTHROPIC_API_KEY=sk-ant-...

# Install dev dependencies
pip install -e ".[dev]"
```

### Run E2E Tests

```bash
# Run all e2e tests
python -m pytest e2e-tests/ -v

# Run tests with 'e2e' marker
python -m pytest e2e-tests/ -v -m e2e

# Run specific test
python -m pytest e2e-tests/test_mcp_calculator.py::test_basic_addition -v
```

---

## Complete Example: MCP Calculator

```python
from claude_agent_sdk import (
    tool,
    create_sdk_mcp_server,
    ClaudeAgentOptions,
    ClaudeSDKClient
)

# Define calculator tools
@tool("add", "Add two numbers", {"a": float, "b": float})
async def add(args):
    result = args["a"] + args["b"]
    return {
        "content": [
            {"type": "text", "text": f"Result: {result}"}
        ]
    }

@tool("subtract", "Subtract two numbers", {"a": float, "b": float})
async def subtract(args):
    result = args["a"] - args["b"]
    return {
        "content": [
            {"type": "text", "text": f"Result: {result}"}
        ]
    }

@tool("multiply", "Multiply two numbers", {"a": float, "b": float})
async def multiply(args):
    result = args["a"] * args["b"]
    return {
        "content": [
            {"type": "text", "text": f"Result: {result}"}
        ]
    }

@tool("divide", "Divide two numbers", {"a": float, "b": float})
async def divide(args):
    if args["b"] == 0:
        return {
            "content": [
                {"type": "text", "text": "Error: Division by zero"}
            ],
            "isError": True
        }
    result = args["a"] / args["b"]
    return {
        "content": [
            {"type": "text", "text": f"Result: {result}"}
        ]
    }

# Create MCP server
calculator_server = create_sdk_mcp_server(
    name="calculator",
    version="1.0.0",
    tools=[add, subtract, multiply, divide]
)

# Use with Claude
async def main():
    options = ClaudeAgentOptions(
        mcp_servers={"calculator": calculator_server},
        allowed_tools=[
            "mcp__calculator__add",
            "mcp__calculator__subtract",
            "mcp__calculator__multiply",
            "mcp__calculator__divide"
        ]
    )

    async with ClaudeSDKClient(options=options) as client:
        # Test basic arithmetic
        await client.query("What is 15 + 27?")
        async for msg in client.receive_response():
            print(msg)

        print("\n" + "=" * 50 + "\n")

        # Test complex calculation
        await client.query("Calculate (100 - 25) * 3 / 5")
        async for msg in client.receive_response():
            print(msg)

import anyio
anyio.run(main)
```

---

## Best Practices

### 1. Use SDK MCP Servers for Custom Tools

Prefer in-process SDK MCP servers over external servers:

```python
# Good: In-process SDK server
server = create_sdk_mcp_server(name="tools", tools=[my_tool])

# Avoid when possible: External server
# mcp_servers={"tools": {"type": "stdio", "command": "external-tool"}}
```

### 2. Implement Hooks for Security

Use hooks to validate commands before execution:

```python
async def validate_command(input_data, tool_use_id, context):
    # Validate bash commands
    if input_data["tool_name"] == "Bash":
        command = input_data["tool_input"]["command"]
        if any(dangerous in command for dangerous in ["rm -rf", "sudo"]):
            return {"hookSpecificOutput": {"permissionDecision": "deny"}}
    return {}
```

### 3. Handle Errors Gracefully

Always catch and handle specific exceptions:

```python
try:
    async for message in query(prompt="Task"):
        process(message)
except CLINotFoundError:
    install_claude_code()
except ProcessError as e:
    log_error(e)
    retry_task()
```

### 4. Use Type Hints

Leverage type hints for better IDE support and error detection:

```python
@tool("process_data", "Process data", {"data": list[str]})
async def process_data(args: dict) -> dict:
    result: list[str] = process(args["data"])
    return {"content": [{"type": "text", "text": str(result)}]}
```

### 5. Set Working Directory

Always specify the working directory for file operations:

```python
options = ClaudeAgentOptions(
    cwd="/path/to/project",
    allowed_tools=["Read", "Write", "Edit"]
)
```

---

## Key Features

 **Simple API** - Easy-to-use async query function
 **Custom Tools** - In-process SDK MCP servers
 **Hooks System** - Pre/post tool execution validation
 **Type Safety** - Full Python type hints support
 **Error Handling** - Comprehensive exception hierarchy
 **Mixed Servers** - SDK and external MCP servers
 **Performance** - No subprocess overhead
 **Debugging** - All code in same process

---

## Further Resources

- GitHub: https://github.com/anthropics/claude-code-sdk-python
- Claude Code Hooks Reference: https://docs.anthropic.com/en/docs/claude-code/hooks
- Examples: See `examples/` directory in repository
- MCP Documentation: https://modelcontextprotocol.io/
