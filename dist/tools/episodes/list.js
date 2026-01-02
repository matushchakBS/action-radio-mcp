import { createHttpTool } from '../factory.js';
const spec = {
    name: 'list_episodes',
    description: 'List episodes with their metadata and IDs',
    inputSchema: {
        type: 'object',
        properties: {
            limit: {
                type: 'number',
                description: 'Limit number of episodes returned',
                minimum: 1,
                maximum: 100,
            },
            offset: {
                type: 'number',
                description: 'Offset for pagination',
                minimum: 0,
            },
        },
        additionalProperties: false,
    },
    method: 'GET',
    path: '/episodes',
    mapResponse: (data, ctx) => ({
        ok: true,
        data: data,
        timestamp: new Date().toISOString(),
    }),
    mapError: (err, ctx) => ({
        ok: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        timestamp: new Date().toISOString(),
    }),
    isError: (output) => !output.ok,
    successText: 'Episodes fetched successfully',
    errorText: 'Failed to fetch episodes',
};
export default createHttpTool(spec);
//# sourceMappingURL=list.js.map