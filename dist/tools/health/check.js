import { createHttpTool } from '../factory.js';
const spec = {
    name: 'health',
    description: 'Check the health status of the Episode Manager API',
    inputSchema: {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false,
    },
    method: 'GET',
    path: '/health',
    mapResponse: (data, ctx) => ({
        status: 'healthy',
        api_url: ctx.apiBaseUrl,
        response: data,
        timestamp: new Date().toISOString(),
    }),
    mapError: (err, ctx) => ({
        status: 'unhealthy',
        api_url: ctx.apiBaseUrl,
        error: err instanceof Error ? err.message : 'Unknown error',
        timestamp: new Date().toISOString(),
    }),
    isError: (output) => output.status === 'unhealthy',
    successText: 'EpisodeManager API is reachable',
    errorText: 'EpisodeManager API health check failed',
};
export default createHttpTool(spec);
//# sourceMappingURL=check.js.map