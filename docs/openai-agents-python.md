# OpenAI Agents SDK - Python Documentation

**Source:** Context7 - /websites/openai_github_io_openai-agents-python
**Last Updated:** 2025-01-24

## Overview

The OpenAI Agents SDK is a Python framework for building multi-agent workflows with lightweight primitives like Agents, Handoffs, Guardrails, and Sessions. It features built-in tracing for visualization and debugging.

## Core Concepts

### 1. Agents

An Agent is a fundamental unit that encompasses instructions and tools. Agents can:
- Execute tasks based on instructions
- Use tools to interact with external systems
- Hand off conversations to other agents
- Produce structured outputs

### 2. Handoffs

Handoffs enable seamless transitions between agents in a multi-agent system. Key differences from tools:
- **Handoffs**: New agent receives conversation history and takes over
- **Tools (as_tool)**: New agent receives generated input, original agent continues

### 3. Guardrails

Guardrails provide input validation and safety checks before agents process requests.

### 4. Sessions

Sessions manage conversation history automatically across multiple agent interactions.

---

## Basic Agent Definition

```python
from agents import Agent

# Simple agent
agent = Agent(
    name="Math Tutor",
    instructions="You provide help with math problems. Explain your reasoning at each step.",
)

# Agent with structured output
from pydantic import BaseModel

class HomeworkOutput(BaseModel):
    is_homework: bool
    reasoning: str

guardrail_agent = Agent(
    name="Guardrail check",
    instructions="Check if the user is asking about homework.",
    output_type=HomeworkOutput,
)
```

---

## Running Agents

### Async Execution (Recommended)

```python
from agents import Agent, Runner
import asyncio

agent = Agent(
    name="Assistant",
    instructions="You are a helpful assistant."
)

async def main():
    result = await Runner.run(
        agent,
        "What is 2+2?",
        context=None,
        max_turns=10
    )
    print(result.final_output)

asyncio.run(main())
```

### Synchronous Execution

```python
# For environments without event loop
result = Runner.run_sync(
    starting_agent=agent,
    input="What is 2+2?",
    max_turns=10
)
print(result.final_output)
```

### Streaming Mode

```python
result_streaming = Runner.run_streamed(
    starting_agent=agent,
    input="Explain quantum physics",
    max_turns=10
)

# Stream events as they occur
async for event in result_streaming.stream_events():
    print(event)
```

---

## Agent Handoffs

### Basic Handoff

```python
from agents import Agent, handoff

# Define specialist agents
math_tutor = Agent(
    name="Math Tutor",
    handoff_description="Specialist agent for math questions",
    instructions="You provide help with math problems."
)

history_tutor = Agent(
    name="History Tutor",
    handoff_description="Specialist agent for historical questions",
    instructions="You provide assistance with historical queries."
)

# Triage agent with handoffs
triage_agent = Agent(
    name="Triage Agent",
    instructions="Determine which specialist agent to use",
    handoffs=[math_tutor, history_tutor]
)
```

### Handoff with Input

```python
from pydantic import BaseModel

class TransferInput(BaseModel):
    reason: str
    priority: str

async def on_handoff_with_input(ctx, input: TransferInput):
    print(f"Handoff reason: {input.reason}")
    # Perform any necessary context updates

specialist_agent = Agent(name="Specialist")

handoff_obj = handoff(
    agent=specialist_agent,
    on_handoff=on_handoff_with_input,
    input_type=TransferInput,
    tool_description_override="Transfer to specialist with context"
)
```

### Handoff Input Filter

```python
from agents.extensions import handoff_filters

# Remove tool calls from conversation history during handoff
handoff_obj = handoff(
    agent=agent,
    input_filter=handoff_filters.remove_all_tools
)
```

---

## Tool Calling

### Function Tools

```python
from agents import function_tool

@function_tool(
    name_override="get_weather",
    description_override="Get current weather for a location"
)
async def get_weather(location: str) -> str:
    # Implementation
    return f"Weather in {location}: Sunny, 72°F"

agent = Agent(
    name="Weather Assistant",
    instructions="Help users with weather information",
    tools=[get_weather]
)
```

### Agent as Tool

Transform an agent into a tool callable by other agents:

```python
specialist_agent = Agent(
    name="Data Analyst",
    instructions="Analyze data and provide insights"
)

# Convert agent to tool
tool = specialist_agent.as_tool(
    tool_name="analyze_data",
    tool_description="Analyze dataset and return insights",
    max_turns=5
)

# Use in another agent
main_agent = Agent(
    name="Main Agent",
    instructions="Coordinate data analysis tasks",
    tools=[tool]
)
```

**Key Differences:**
- **Handoff**: New agent receives full conversation history, takes over conversation
- **as_tool**: New agent receives generated input only, original agent continues

---

## Input Guardrails

Guardrails validate input before processing:

```python
from agents import InputGuardrail, GuardrailFunctionOutput

async def homework_guardrail(ctx, agent, input_data):
    # Use guardrail agent to check input
    result = await Runner.run(guardrail_agent, input_data)
    final_output = result.final_output_as(HomeworkOutput)

    return GuardrailFunctionOutput(
        output_info=final_output,
        tripwire_triggered=not final_output.is_homework
    )

triage_agent = Agent(
    name="Triage Agent",
    instructions="Process homework questions only",
    input_guardrails=[
        InputGuardrail(guardrail_function=homework_guardrail)
    ]
)
```

**Handling Guardrail Exceptions:**

```python
from agents.exceptions import InputGuardrailTripwireTriggered

try:
    result = await Runner.run(triage_agent, "What is the meaning of life?")
except InputGuardrailTripwireTriggered as e:
    print("Guardrail blocked this input:", e)
```

---

## Context Management

### Custom Context

```python
from pydantic import BaseModel

class MyContext(BaseModel):
    user_id: str
    session_id: str
    preferences: dict

context = MyContext(
    user_id="user123",
    session_id="session456",
    preferences={"language": "en"}
)

result = await Runner.run(
    agent,
    "Hello",
    context=context
)
```

### Accessing Context in Tools

```python
from agents import ToolContext

@function_tool()
async def custom_tool(ctx: ToolContext, query: str) -> str:
    # Access custom context
    user_context = ctx.context
    print(f"User ID: {user_context.user_id}")

    # Access usage information
    print(f"Tokens used: {ctx.usage.total_tokens}")

    return "Result"
```

---

## Session Management

Sessions automatically manage conversation history:

```python
from agents import Session

# Create session
session = Session()

# First interaction
result1 = await Runner.run(
    agent,
    "My name is Alice",
    session=session
)

# Second interaction - agent remembers context
result2 = await Runner.run(
    agent,
    "What's my name?",
    session=session
)
# Agent responds: "Your name is Alice"
```

---

## Multi-Agent Workflow Example

Complete example with guardrails, handoffs, and multiple agents:

```python
from agents import Agent, InputGuardrail, GuardrailFunctionOutput, Runner
from agents.exceptions import InputGuardrailTripwireTriggered
from pydantic import BaseModel
import asyncio

# Define output structure
class HomeworkOutput(BaseModel):
    is_homework: bool
    reasoning: str

# Guardrail agent
guardrail_agent = Agent(
    name="Guardrail check",
    instructions="Check if the user is asking about homework.",
    output_type=HomeworkOutput,
)

# Specialist agents
math_tutor_agent = Agent(
    name="Math Tutor",
    handoff_description="Specialist agent for math questions",
    instructions="Help with math problems. Explain reasoning at each step.",
)

history_tutor_agent = Agent(
    name="History Tutor",
    handoff_description="Specialist agent for historical questions",
    instructions="Provide assistance with historical queries.",
)

# Guardrail function
async def homework_guardrail(ctx, agent, input_data):
    result = await Runner.run(guardrail_agent, input_data, context=ctx.context)
    final_output = result.final_output_as(HomeworkOutput)
    return GuardrailFunctionOutput(
        output_info=final_output,
        tripwire_triggered=not final_output.is_homework,
    )

# Triage agent with guardrails and handoffs
triage_agent = Agent(
    name="Triage Agent",
    instructions="Determine which agent to use based on homework question",
    handoffs=[history_tutor_agent, math_tutor_agent],
    input_guardrails=[
        InputGuardrail(guardrail_function=homework_guardrail),
    ],
)

# Run workflow
async def main():
    try:
        result = await Runner.run(
            triage_agent,
            "Who was the first president of the United States?"
        )
        print(result.final_output)
    except InputGuardrailTripwireTriggered as e:
        print("Guardrail blocked input:", e)

asyncio.run(main())
```

---

## Run Configuration

### RunConfig

```python
from agents import RunConfig

run_config = RunConfig(
    # Add global configuration here
)

result = await Runner.run(
    agent,
    "Hello",
    run_config=run_config
)
```

### Max Turns

```python
# Limit agent iterations
result = await Runner.run(
    agent,
    "Complex task",
    max_turns=20  # Default is 10
)
```

### Conversation Management

```python
# Using OpenAI Conversation API
result = await Runner.run(
    agent,
    "Hello",
    conversation_id="conv_123",  # Conversation ID from OpenAI
    previous_response_id="resp_456"  # Previous response ID
)
```

---

## Hooks and Instrumentation

### RunHooks

```python
from agents import RunHooks

class MyHooks(RunHooks):
    async def on_agent_start(self, agent, input_data):
        print(f"Agent {agent.name} started")

    async def on_agent_end(self, agent, output):
        print(f"Agent {agent.name} finished")

    async def on_tool_start(self, tool, input_data):
        print(f"Tool {tool.name} called")

hooks = MyHooks()

result = await Runner.run(
    agent,
    "Hello",
    hooks=hooks
)
```

---

## Error Handling

### Common Exceptions

```python
from agents.exceptions import (
    MaxTurnsExceeded,
    InputGuardrailTripwireTriggered,
    ModelBehaviorError,
    UserError
)

try:
    result = await Runner.run(agent, "Input", max_turns=5)
except MaxTurnsExceeded as e:
    print("Agent exceeded maximum turns")
except InputGuardrailTripwireTriggered as e:
    print("Guardrail blocked input")
except ModelBehaviorError as e:
    print("Model behavior issue:", e)
except UserError as e:
    print("User error:", e)
```

---

## Best Practices

### 1. Agent Instructions

✅ **Good:**
```python
Agent(
    name="Math Tutor",
    instructions="""You are a math tutor helping students with homework.
    - Explain step-by-step
    - Provide examples
    - Ask clarifying questions if needed
    - Use simple language"""
)
```

❌ **Bad:**
```python
Agent(
    name="Math Tutor",
    instructions="Help with math"
)
```

### 2. Handoff Descriptions

Be specific about when to use each agent:

```python
Agent(
    name="Technical Support",
    handoff_description="Use for technical issues, bug reports, or system errors",
    instructions="..."
)
```

### 3. Structured Outputs

Use Pydantic models for predictable responses:

```python
from pydantic import BaseModel

class AnalysisResult(BaseModel):
    summary: str
    confidence: float
    recommendations: list[str]

agent = Agent(
    name="Analyst",
    output_type=AnalysisResult
)

result = await Runner.run(agent, "Analyze this...")
typed_output = result.final_output_as(AnalysisResult)
```

### 4. Context Usage

Keep context focused and relevant:

```python
class TaskContext(BaseModel):
    task_id: str
    priority: str
    deadline: str
    # Only include what agents need
```

### 5. Guardrails

Always validate untrusted input:

```python
# Check for sensitive topics
# Validate format
# Ensure appropriate content
```

---

## System Context Prompt

Recommended prefix for multi-agent systems:

```python
from agents.extensions.handoff_prompt import RECOMMENDED_PROMPT_PREFIX

agent = Agent(
    name="Agent",
    instructions=f"{RECOMMENDED_PROMPT_PREFIX}\n\nYour specific instructions..."
)
```

**Content:**
> You are part of a multi-agent system called the Agents SDK, designed to make agent coordination and execution easy. Agents uses two primary abstraction: **Agents** and **Handoffs**. An agent encompasses instructions and tools and can hand off a conversation to another agent when appropriate. Handoffs are achieved by calling a handoff function, generally named `transfer_to_<agent_name>`. Transfers between agents are handled seamlessly in the background; do not mention or draw attention to these transfers in your conversation with the user.

---

## Key Takeaways

✅ **Agents** - Core unit with instructions and tools
✅ **Handoffs** - Seamless transitions between agents
✅ **Guardrails** - Input validation and safety
✅ **Sessions** - Automatic conversation history
✅ **Tools** - Function calls and agent-as-tool
✅ **Context** - Custom data passed through workflow
✅ **Hooks** - Lifecycle event callbacks
✅ **Streaming** - Real-time event streaming

## Further Resources

- Official Docs: https://openai.github.io/openai-agents-python/
- GitHub: https://github.com/openai/openai-agents-python
- Examples: See quickstart and tutorials in official docs
