# OpenAI Agents SDK - JavaScript/TypeScript Documentation

**Source:** Context7 - /websites/openai_github_io_openai-agents-js
**Last Updated:** 2025-01-24

## Overview

The OpenAI Agents SDK is a JavaScript/TypeScript framework for building multi-agent workflows. It supports OpenAI APIs and features handoffs, guardrails, tool calling, MCP integration, and tracing for debugging.

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
- **Tools (asTool)**: New agent receives generated input, original agent continues

### 3. Guardrails

Guardrails provide input/output validation and safety checks before and after agent processing.

### 4. MCP Integration

Model Context Protocol (MCP) servers can be integrated to extend agent capabilities with external tools.

---

## Basic Agent Definition

```typescript
import { Agent } from "@openai/agents";

// Simple agent
const agent = new Agent({
  name: "Assistant",
  instructions: "You are a helpful assistant.",
});

// Agent with tools
const weatherAgent = new Agent({
  name: "Weather Assistant",
  instructions: "Help users with weather information.",
  tools: [getWeatherTool],
});
```

---

## Running Agents

### Basic Execution

```typescript
import { Agent } from "@openai/agents";

const agent = new Agent({
  name: "Assistant",
  instructions: "You are a helpful assistant.",
});

const result = await agent.run({
  input: "What is 2+2?"
});

console.log(result.finalOutput);
```

### Using Runner Class

```typescript
import { Agent, Runner } from "@openai/agents";

const agent = new Agent({
  name: "Assistant",
  instructions: "You are a helpful assistant."
});

const result = await Runner.run(
  agent,
  "What is 2+2?",
  {
    context: { userId: "user123" },
    maxTurns: 10
  }
);

console.log(result.finalOutput);
```

### Streaming Mode

```typescript
const result = await agent.run({
  input: "Explain quantum physics",
  stream: true
});

// Process streamed items
for (const item of result.newItems) {
  if (item.type === "RunMessageOutputItem") {
    console.log("Message:", item.rawItem);
  }
}
```

---

## Agent Handoffs

### Basic Handoff

```typescript
import { Agent, handoff } from "@openai/agents";

// Define specialist agents
const mathAgent = new Agent({
  name: "Math Tutor",
  handoffDescription: "Specialist agent for math questions",
  instructions: "You provide help with math problems."
});

const historyAgent = new Agent({
  name: "History Tutor",
  handoffDescription: "Specialist agent for historical questions",
  instructions: "You provide assistance with historical queries."
});

// Triage agent with handoffs
const triageAgent = new Agent({
  name: "Triage Agent",
  instructions: "Determine which specialist agent to use",
  handoffs: [mathAgent, historyAgent]
});
```

### Manual Handoff Creation

```typescript
import { Agent, handoff } from "@openai/agents";

const specialistAgent = new Agent({
  name: "Specialist",
  instructions: "Handle specialized tasks"
});

const customHandoff = handoff(specialistAgent, {
  toolName: "transfer_to_specialist",
  description: "Transfer to specialist with context"
});

const mainAgent = new Agent({
  name: "Main Agent",
  handoffs: [customHandoff]
});
```

### Type-Safe Handoffs with Agent.create()

```typescript
const agent = Agent.create({
  name: "Coordinator",
  instructions: "Coordinate between agents",
  handoffs: [
    agentA, // returns string
    agentB, // returns number
  ]
});

const result = await agent.run({ input: "Process data" });

// finalOutput is automatically typed as string | number | undefined
const output: string | number | undefined = result.finalOutput;
```

---

## Tool Calling

### Function Tools

```typescript
import { Agent } from "@openai/agents";

async function getWeather(location: string): Promise<string> {
  // Implementation
  return `Weather in ${location}: Sunny, 72°F`;
}

const weatherTool = {
  name: "get_weather",
  description: "Get current weather for a location",
  parameters: {
    type: "object" as const,
    properties: {
      location: {
        type: "string" as const,
        description: "The city and state, e.g. San Francisco, CA"
      }
    },
    required: ["location"]
  },
  execute: async (params: { location: string }) => {
    return await getWeather(params.location);
  }
};

const agent = new Agent({
  name: "Weather Assistant",
  instructions: "Help users with weather information",
  tools: [weatherTool]
});
```

### Agent as Tool

Transform an agent into a tool callable by other agents:

```typescript
const dataAnalystAgent = new Agent({
  name: "Data Analyst",
  instructions: "Analyze data and provide insights"
});

// Convert agent to tool
const analysisTool = dataAnalystAgent.asTool({
  toolName: "analyze_data",
  toolDescription: "Analyze dataset and return insights",
  runOptions: {
    maxTurns: 5
  }
});

// Use in another agent
const mainAgent = new Agent({
  name: "Main Agent",
  instructions: "Coordinate data analysis tasks",
  tools: [analysisTool]
});
```

**Key Differences:**
- **Handoff**: New agent receives full conversation history, takes over conversation
- **asTool**: New agent receives generated input only, original agent continues

---

## MCP Integration

### Streamable HTTP MCP Server

```typescript
import { MCPServerStreamableHttp } from "@openai/agents";

const mcpServer = new MCPServerStreamableHttp({
  name: "my-streamable-server",
  url: "https://my-mcp-server.com/api/v1/agent",
});

const agent = new Agent({
  name: "Assistant",
  mcpServers: [mcpServer]
});
```

### Stdio MCP Server

```typescript
import { MCPServerStdio } from "@openai/agents";

const mcpServer = new MCPServerStdio({
  fullCommand: "python my_mcp_server.py",
});

const agent = new Agent({
  name: "Assistant",
  mcpServers: [mcpServer]
});
```

### Hosted MCP Tools

```typescript
import { hostedMcpTool } from "@openai/agents";

const googleCalendarTool = hostedMcpTool({
  connectorId: "google-calendar",
  authorization: process.env.GOOGLE_CALENDAR_AUTHORIZATION,
});

const agent = new Agent({
  name: "Calendar Assistant",
  tools: [googleCalendarTool]
});
```

### Tool List Caching

```typescript
import { MCPServerStreamableHttp } from "@openai/agents";

const mcpServer = new MCPServerStreamableHttp({
  name: "my-server",
  url: "https://my-server.com/api/v1/agent",
  cacheToolsList: true, // Enable caching
});

// Invalidate cache when needed
mcpServer.invalidateToolsCache();
```

### Filtering MCP Tools

```typescript
import { MCPServerStreamableHttp, createMCPToolStaticFilter } from "@openai/agents";

// Static filter
const mcpServer = new MCPServerStreamableHttp({
  name: "my-server",
  url: "https://my-server.com/api/v1/agent",
  toolFilter: createMCPToolStaticFilter(["tool1", "tool2"]),
});

// Function filter
const mcpServerWithFunctionFilter = new MCPServerStreamableHttp({
  name: "another-server",
  url: "https://another-server.com/api/v1/agent",
  toolFilter: (tool) => {
    return tool.description?.startsWith("Useful for:") === true;
  },
});
```

---

## Input Guardrails

Guardrails validate input before processing:

```typescript
import { Agent } from "@openai/agents";

const guardrailAgent = new Agent({
  name: "Content Filter",
  instructions: "Check if content is appropriate",
  outputType: {
    isAppropriate: "boolean",
    reason: "string"
  }
});

async function contentGuardrail(ctx: any, agent: any, input: string) {
  const result = await guardrailAgent.run({ input });

  return {
    outputInfo: result.finalOutput,
    tripwireTriggered: !result.finalOutput.isAppropriate
  };
}

const agent = new Agent({
  name: "Chat Agent",
  instructions: "Chat with users",
  inputGuardrails: [
    { guardrailFunction: contentGuardrail }
  ]
});
```

**Handling Guardrail Exceptions:**

```typescript
import { GuardrailExecutionError } from "@openai/agents";

try {
  const result = await agent.run({ input: "User message" });
} catch (e) {
  if (e instanceof GuardrailExecutionError) {
    console.error("Guardrail blocked input:", e.message);
    console.error("State:", e.state);
  }
}
```

---

## Output Guardrails

Validate agent output before returning:

```typescript
const agent = new Agent({
  name: "Agent",
  instructions: "Generate responses",
  outputGuardrails: [
    {
      guardrailFunction: async (ctx, agent, output) => {
        // Validate output
        const isValid = validateOutput(output);

        return {
          outputInfo: { isValid },
          tripwireTriggered: !isValid
        };
      }
    }
  ]
});

// Access guardrail results
const result = await agent.run({ input: "Hello" });
const guardrailResults = result.outputGuardrailResults();
```

---

## Tool Approval (Human-in-the-Loop)

```typescript
const sensitiveTool = {
  name: "delete_file",
  description: "Delete a file from the system",
  parameters: {
    type: "object" as const,
    properties: {
      filePath: { type: "string" as const }
    },
    required: ["filePath"]
  },
  needsApproval: true, // Require human approval
  execute: async (params: { filePath: string }) => {
    // Delete file logic
    return `Deleted ${params.filePath}`;
  }
};

const agent = new Agent({
  name: "File Manager",
  tools: [sensitiveTool]
});
```

---

## Run Results and State Management

### Processing Run Items

```typescript
const result = await agent.run({ input: "Generate report" });

for (const item of result.newItems) {
  if (item.type === "RunMessageOutputItem") {
    console.log("LLM Message:", item.rawItem);
  } else if (item.type === "RunToolCallItem") {
    console.log("Tool Call:", item.rawItem);
  } else if (item.type === "RunReasoningItem") {
    console.log("Reasoning:", item.rawItem);
  } else if (item.type === "RunHandoffCallItem") {
    console.log("Handoff:", item.rawItem);
  }
}
```

### Run State

```typescript
interface RunResult<TContext, TAgent> {
  finalOutput: OutputType<TAgent>;
  newItems: RunItem[];
  state: RunState<TContext, TAgent>;
}

interface RunState<TContext, TAgent> {
  input: string | AgentInputItem[];
  history: ChatMessage[];
  context?: TContext;
}
```

---

## Agent Configuration

### Complete Configuration Example

```typescript
import { Agent } from "@openai/agents";

const agent = new Agent({
  // Required
  name: "MyAgent",

  // Instructions
  instructions: "You are a helpful assistant.",
  // OR async function
  instructions: async (runContext, agent) => {
    return `You are ${agent.name}. Context: ${runContext.context}`;
  },

  // Model configuration
  model: "gpt-4o",
  modelSettings: {
    temperature: 0.7,
    topP: 0.9,
  },

  // Tools and handoffs
  tools: [tool1, tool2],
  handoffs: [agentA, agentB],
  mcpServers: [mcpServer],

  // Guardrails
  inputGuardrails: [inputGuardrail],
  outputGuardrails: [outputGuardrail],

  // Output configuration
  outputType: "text", // or custom type

  // Tool behavior
  toolUseBehavior: "run_llm_again", // or "stop_on_first_tool" or custom
  resetToolChoice: true,

  // Handoff configuration
  handoffDescription: "Use for specialized tasks",
  handoffOutputTypeWarningEnabled: true,

  // Prompt (for Responses API)
  prompt: {
    // Prompt template object
  }
});
```

### Tool Use Behavior

```typescript
// Run LLM again after tool calls (default)
const agent1 = new Agent({
  name: "Agent1",
  toolUseBehavior: "run_llm_again"
});

// Stop after first tool call
const agent2 = new Agent({
  name: "Agent2",
  toolUseBehavior: "stop_on_first_tool"
});

// Stop on specific tools
const agent3 = new Agent({
  name: "Agent3",
  toolUseBehavior: ["specific_tool_name"]
});

// Custom function
const agent4 = new Agent({
  name: "Agent4",
  toolUseBehavior: async (runContext, toolResults) => {
    // Custom logic
    return {
      finalOutput: processResults(toolResults),
      runContext: updatedContext
    };
  }
});
```

---

## Realtime Agents (Voice)

### RealtimeAgent

```typescript
import { RealtimeAgent, RealtimeSession } from "@openai/agents/realtime";

const voiceAgent = new RealtimeAgent({
  name: "Voice Assistant",
  instructions: "You are a voice assistant",
  voice: "alloy",
  turnDetection: "server_vad"
});

const session = new RealtimeSession(voiceAgent, {
  // Session options
});

// Handle realtime events
session.on("message", (message) => {
  console.log("Agent said:", message);
});
```

### MCP Tool Approval in Realtime

```typescript
// Send approval for MCP tool call
transportLayer.sendMcpResponse({
  approved: true,
  arguments: {},
  itemId: "item_123",
  name: "tool_name",
  serverLabel: "server_label",
  type: "mcp_approval_request"
});
```

---

## Error Handling

### Common Exceptions

```typescript
import {
  MaxTurnsExceeded,
  GuardrailTripwireTriggered,
  GuardrailExecutionError,
  AgentsError
} from "@openai/agents";

try {
  const result = await agent.run({ input: "Hello", maxTurns: 5 });
} catch (e) {
  if (e instanceof MaxTurnsExceeded) {
    console.error("Agent exceeded maximum turns");
  } else if (e instanceof GuardrailTripwireTriggered) {
    console.error("Guardrail blocked execution");
  } else if (e instanceof GuardrailExecutionError) {
    console.error("Guardrail execution failed:", e.message);
    console.error("State:", e.state);
  } else if (e instanceof AgentsError) {
    console.error("Agent error:", e.message);
  }
}
```

---

## Advanced Features

### Get All Tools

```typescript
const allTools = await agent.getAllTools(runContext);
const mcpTools = await agent.getMcpTools(runContext);
```

### Get Enabled Handoffs

```typescript
const enabledHandoffs = await agent.getEnabledHandoffs(runContext);
```

### Get System Prompt

```typescript
const systemPrompt = await agent.getSystemPrompt(runContext);
const prompt = await agent.getPrompt(runContext);
```

### MCP Tool Conversion

```typescript
import { mcpToFunctionTool } from "@openai/agents";

const functionTool = mcpToFunctionTool(
  mcpTool,
  mcpServer,
  true // convertSchemasToStrict
);
```

---

## Complete Multi-Agent Example

```typescript
import { Agent, handoff } from "@openai/agents";

// Guardrail agent
const contentFilterAgent = new Agent({
  name: "Content Filter",
  instructions: "Check if content is appropriate",
  outputType: {
    isAppropriate: "boolean",
    reason: "string"
  }
});

// Specialist agents
const mathAgent = new Agent({
  name: "Math Tutor",
  handoffDescription: "Specialist for math questions",
  instructions: "Help with math problems. Explain step-by-step."
});

const scienceAgent = new Agent({
  name: "Science Tutor",
  handoffDescription: "Specialist for science questions",
  instructions: "Provide assistance with science queries."
});

// Guardrail function
async function contentGuardrail(ctx: any, agent: any, input: string) {
  const result = await contentFilterAgent.run({ input });

  return {
    outputInfo: result.finalOutput,
    tripwireTriggered: !result.finalOutput.isAppropriate
  };
}

// Triage agent with guardrails and handoffs
const triageAgent = new Agent({
  name: "Triage Agent",
  instructions: "Determine which specialist to use",
  handoffs: [mathAgent, scienceAgent],
  inputGuardrails: [
    { guardrailFunction: contentGuardrail }
  ]
});

// Run workflow
try {
  const result = await triageAgent.run({
    input: "What is photosynthesis?"
  });
  console.log(result.finalOutput);
} catch (e) {
  if (e instanceof GuardrailTripwireTriggered) {
    console.error("Content filter blocked input");
  }
}
```

---

## Best Practices

### 1. Agent Instructions

✅ **Good:**
```typescript
new Agent({
  name: "Math Tutor",
  instructions: `You are a math tutor helping students.
  - Explain step-by-step
  - Provide examples
  - Ask clarifying questions if needed
  - Use simple language`
});
```

❌ **Bad:**
```typescript
new Agent({
  name: "Math Tutor",
  instructions: "Help with math"
});
```

### 2. Handoff Descriptions

Be specific about when to use each agent:

```typescript
new Agent({
  name: "Technical Support",
  handoffDescription: "Use for technical issues, bug reports, or system errors",
  instructions: "..."
});
```

### 3. Type Safety

Use TypeScript and define output types:

```typescript
interface AnalysisResult {
  summary: string;
  confidence: number;
  recommendations: string[];
}

const agent = new Agent({
  name: "Analyst",
  outputType: AnalysisResult
});

const result = await agent.run({ input: "Analyze this..." });
const typed: AnalysisResult = result.finalOutput;
```

### 4. Tool Approval

Always require approval for sensitive operations:

```typescript
const deleteTool = {
  name: "delete_resource",
  needsApproval: true,
  execute: async (params) => {
    // Sensitive operation
  }
};
```

### 5. Error Handling

Always handle agent errors gracefully:

```typescript
try {
  await agent.run({ input });
} catch (e) {
  // Handle specific error types
  // Log errors
  // Provide fallback behavior
}
```

---

## Key Takeaways

✅ **Agents** - Core unit with instructions and tools
✅ **Handoffs** - Seamless transitions between agents
✅ **Tools** - Function calls and agent-as-tool
✅ **MCP Integration** - Connect to external tool servers
✅ **Guardrails** - Input/output validation
✅ **Type Safety** - Full TypeScript support
✅ **Error Handling** - Comprehensive exception handling
✅ **Streaming** - Real-time event processing
✅ **Realtime** - Voice agent support

## Further Resources

- Official Docs: https://openai.github.io/openai-agents-js/
- GitHub: https://github.com/openai/openai-agents-js
- Examples: See quickstart and tutorials in official docs
