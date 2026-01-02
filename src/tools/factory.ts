import type { CallToolResult, ContentBlock, Tool } from '@modelcontextprotocol/sdk/types.js';
import { api, serializeHttpError } from '../httpClient.js';
import { apiBaseUrl } from '../config.js';

export type ToolExecutor = (args: unknown) => Promise<CallToolResult>;

export type ToolDefinition = Tool & {
  execute: ToolExecutor;
};

export interface HttpToolSpec<TInput = unknown, TOutput = unknown> {
  name: string;
  description: string;
  inputSchema: { type: 'object'; properties?: Record<string, object>; required?: string[]; [key: string]: unknown };
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: TInput }) => TOutput;
  mapError?: (error: unknown, ctx: { apiBaseUrl: string; input: TInput }) => TOutput;
  isError?: (output: TOutput) => boolean;
  successText?: string;
  errorText?: string;
}

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

export function createHttpTool<TInput = unknown, TOutput = unknown>(
  spec: HttpToolSpec<TInput, TOutput>
): ToolDefinition {
  return {
    name: spec.name,
    description: spec.description,
    inputSchema: spec.inputSchema,
    execute: async (args: unknown): Promise<CallToolResult> => {
      const ctx = { apiBaseUrl, input: args as TInput };
      
      try {
        let response;
        const { method, path } = spec;
        
        switch (method) {
          case 'GET':
            response = await api.get(path);
            break;
          case 'POST':
            response = await api.post(path, args);
            break;
          case 'PUT':
            response = await api.put(path, args);
            break;
          case 'DELETE':
            response = await api.delete(path);
            break;
          case 'PATCH':
            response = await api.patch(path, args);
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }

        const mappedResponse = spec.mapResponse(response.data, ctx);
        const isError = spec.isError ? spec.isError(mappedResponse) : false;
        
        if (isError && spec.mapError) {
          const errorResponse = spec.mapError(mappedResponse, ctx);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(errorResponse, null, 2),
              } as ContentBlock,
            ],
            structuredContent: errorResponse as Record<string, unknown>,
            isError: true,
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(mappedResponse, null, 2),
            } as ContentBlock,
          ],
          structuredContent: mappedResponse as Record<string, unknown>,
          isError,
        };
        
      } catch (error) {
        if (spec.mapError) {
          const errorResponse = spec.mapError(error, ctx);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(errorResponse, null, 2),
              } as ContentBlock,
            ],
            structuredContent: errorResponse as Record<string, unknown>,
            isError: true,
          };
        }
        
        return structuredError(spec.name, error);
      }
    },
  };
}