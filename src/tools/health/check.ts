import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface HealthInput {}

export interface HealthOutput {
  ok: boolean;
  status: 'healthy' | 'unhealthy';
  api_url: string;
  response?: unknown;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'health',
  description: 'Check the health status of the Episode Manager API',
  
  inputSchema: {
    type: 'object' as const,
    properties: {},
    required: [],
    additionalProperties: false,
  },

  method: 'GET' as const,
  path: '/episodes',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; url: string; method: string }): HealthOutput => ({
    ok: true,
    status: 'healthy',
    api_url: ctx.url,
    response: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; url: string; method: string }): HealthOutput => ({
    ok: false,
    status: 'unhealthy',
    api_url: ctx.url,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: HealthOutput) => output.status === 'unhealthy',
  
  successText: 'EpisodeManager API is reachable',
  errorText: 'EpisodeManager API health check failed',
};

// Export the created tool as default
export default createHttpTool<HealthInput, HealthOutput>(spec);