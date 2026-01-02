import { createHttpTool } from '../factory.js';
const spec = {
    name: 'get_episode',
    description: 'Get episode details including tracks',
    inputSchema: {
        type: 'object',
        properties: {
            episode_id: {
                type: 'number',
                description: 'The ID of the episode to retrieve',
                minimum: 1,
            },
        },
        required: ['episode_id'],
        additionalProperties: false,
    },
    method: 'GET',
    path: '/episodes/{episode_id}',
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
    successText: 'Episode retrieved successfully',
    errorText: 'Failed to retrieve episode',
};
export default createHttpTool(spec);
//# sourceMappingURL=get.js.map