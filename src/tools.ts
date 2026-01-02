import type { CallToolResult, ContentBlock, Tool } from '@modelcontextprotocol/sdk/types.js';
import { api } from './httpClient.js';
import { apiBaseUrl } from './config.js';
import { serializeHttpError } from './httpClient.js';

type ToolExecutor = (args: unknown) => Promise<CallToolResult>;

type ToolDefinition = Tool & {
  execute: ToolExecutor;
};

const structuredError = (tool: string, error: unknown): CallToolResult => ({
  content: [
    {
      type: 'text',
      text: `${tool} failed`,
    } as ContentBlock,
  ],
  structuredContent: {
    ok: false,
    tool,
    error: serializeHttpError(error),
    timestamp: new Date().toISOString(),
  },
  isError: true,
});

const healthTool: ToolDefinition = {
  name: 'health',
  description: 'Health check for the EpisodeManager API',
  inputSchema: { type: 'object', properties: {} },
  execute: async () => {
    try {
      const response = await api.get('/health');

      return {
        content: [
          {
            type: 'text',
            text: 'EpisodeManager API is reachable',
          } as ContentBlock,
        ],
        structuredContent: {
          ok: true,
          apiBaseUrl,
          response: response.data,
          checkedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      return structuredError('health', error);
    }
  },
};

const listEpisodesTool: ToolDefinition = {
  name: 'list_episodes',
  description: 'List episodes with their metadata and IDs.',
  inputSchema: { type: 'object', properties: {} },
  execute: async () => {
    try {
      const response = await api.get('/episodes');

      return {
        content: [
          {
            type: 'text',
            text: 'Episodes fetched',
          } as ContentBlock,
        ],
        structuredContent: response.data,
      };
    } catch (error) {
      return structuredError('list_episodes', error);
    }
  },
};

export const tools: ToolDefinition[] = [healthTool, listEpisodesTool];
export const toolsByName = new Map(tools.map((tool) => [tool.name, tool]));

