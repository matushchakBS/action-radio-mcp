# Episode Manager MCP Server

## Overview

This Model Context Protocol (MCP) server provides tools for interacting with the Episode Manager API. It acts as a bridge between AI assistants and the Episode Manager backend, allowing seamless integration for episode management, track handling, asset processing, and more.

The server runs as a standalone HTTP service that streams MCP protocol responses, making it easy to integrate with various AI platforms like Claude, n8n, or other MCP-compatible clients.

## Architecture

Our MCP server is built with two types of tools:

### HTTP-Based Tools (90% of use cases)
- **Purpose**: Direct API integration with backend services
- **Built using**: Factory pattern with `createHttpTool`
- **Structure**: Organized in feature-based folders
- **Benefits**: Consistent error handling, automatic JSON serialization, standardized response format

### Plain/Multi-step Tools (10% of use cases)
- **Purpose**: Complex logic, multi-step workflows, custom processing
- **Built using**: Direct implementation of MCP tool interface
- **Use cases**: Data transformation, orchestration, complex business logic

## Configuration

### Environment Variables

Create a `.env` file in the mcp directory with the following variables:

```env
# API Configuration
API_BASE_URL=http://localhost:1091/api/episode-manager
MCP_SERVER_PORT=3001

# Docker Configuration (when connecting from external services like n8n)
# Replace localhost with actual container IP or service name
# API_BASE_URL=http://host.docker.internal:1091/api/episode-manager
```

**Important**: When connecting from Docker containers (e.g., n8n), replace `localhost` with the appropriate Docker network address:
- `host.docker.internal` for Docker Desktop
- Container service name for Docker Compose
- Actual IP address for custom Docker networks

### Building and Running

```bash
# Install dependencies
npm install

# Build the TypeScript code
npm run build

# Start the MCP server
npm start
```

The server will start on the configured port and be ready to accept MCP connections via HTTP streaming.

## Tool Structure

### HTTP-Based Tools

HTTP-based tools follow this file structure pattern:

```
src/tools/
├── feature-name/           # Group related tools by feature
│   ├── action-name.ts      # Specific action (create, list, update, etc.)
│   └── other-action.ts
├── factory.ts              # HTTP tool factory
└── index.ts               # Tool exports
```

#### Example: Complete HTTP Tool Implementation

```typescript
// src/tools/episodes/create.ts
import { createHttpTool } from '../factory.js';

export interface CreateEpisodeInput {
  system_name: string;
  title: string;
  description?: string;
  music_brief?: string;
  voice_brief?: string;
  video_brief?: string;
}

export interface CreateEpisodeOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

const spec = {
  name: 'create_episode',
  description: 'Create a new episode in the Episode Manager',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
      system_name: {
        type: 'string',
        description: 'System name/identifier for the episode',
        minLength: 1,
        maxLength: 100,
      },
      title: {
        type: 'string',
        description: 'Episode title',
        minLength: 1,
        maxLength: 200,
      },
      description: {
        type: 'string',
        description: 'Episode description',
        maxLength: 1000,
      },
      music_brief: {
        type: 'string',
        description: 'Brief description for music requirements',
        maxLength: 500,
      },
      voice_brief: {
        type: 'string',
        description: 'Brief description for voice requirements',
        maxLength: 500,
      },
      video_brief: {
        type: 'string',
        description: 'Brief description for video requirements',
        maxLength: 500,
      },
    },
    required: ['system_name', 'title'],
    additionalProperties: false,
  },

  method: 'POST' as const,
  path: '/episodes',

  mapResponse: (data: any, ctx: { apiBaseUrl: string }): CreateEpisodeOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string }): CreateEpisodeOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: CreateEpisodeOutput) => !output.ok,
  
  successText: 'Episode created successfully',
  errorText: 'Failed to create episode',
};

export default createHttpTool<CreateEpisodeInput, CreateEpisodeOutput>(spec);
```

### Plain Tools

Plain tools are implemented directly using the MCP tool interface:

```typescript
// documentation/sample/tool.ts
import type { CallToolResult, ContentBlock } from '@modelcontextprotocol/sdk/types.js';
import type { ToolDefinition } from '../factory.js';

const sampleTool: ToolDefinition = {
  name: 'sample_tool',
  description: 'A sample tool that returns stub data for testing',
  inputSchema: {
    type: 'object',
    properties: {
      count: {
        type: 'number',
        description: 'Number of sample items to return',
        minimum: 1,
        maximum: 10,
      }
    },
    additionalProperties: false,
  },
  execute: async (args: unknown): Promise<CallToolResult> => {
    const { count = 3 } = (args as { count?: number }) || {};
    
    const sampleData = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Sample Item ${i + 1}`,
      type: 'example',
      status: i % 2 === 0 ? 'active' : 'inactive',
      createdAt: new Date().toISOString(),
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(sampleData, null, 2),
        } as ContentBlock,
      ],
      structuredContent: {
        ok: true,
        count: sampleData.length,
        data: sampleData,
        timestamp: new Date().toISOString(),
      },
    };
  },
};

export default sampleTool;
```

## Best Practices

### HTTP Tools
1. **Group by feature**: Organize tools in folders by domain (episodes, tracks, assets)
2. **Descriptive naming**: Use action-oriented names (create.ts, list.ts, update.ts)
3. **Type safety**: Define clear input/output interfaces
4. **Validation**: Use JSON Schema for input validation
5. **Error handling**: Implement proper error mapping
6. **Documentation**: Include clear descriptions for all fields

### Plain Tools
1. **Use sparingly**: Only when HTTP tools can't handle the complexity
2. **Clear naming**: Use descriptive tool names and descriptions
3. **Input validation**: Validate inputs even for custom tools
4. **Consistent output**: Follow the same response structure as HTTP tools
5. **Error handling**: Implement proper error responses

## Testing

Tests are located in the root directory as `test-http.ts` for lightweight API method testing, or in the `test/` folder for heavy operations that require separate test files.

## Integration

### With n8n
When connecting to n8n or other external Docker services, ensure you use the correct network configuration in your `.env` file. Replace localhost addresses with container-accessible URLs.

### With Claude Desktop
The MCP server can be configured in Claude Desktop's MCP settings to provide seamless API integration.

## Development Workflow

1. **Identify the API**: Understand the backend API structure
2. **Create tool structure**: Organize tools by feature domain
3. **Implement HTTP tools**: Use the factory pattern for standard CRUD operations
4. **Add plain tools**: Only when complex logic is required
5. **Test thoroughly**: Ensure all tools work correctly with real API
6. **Document**: Update this README with any new patterns or tools