import { createHttpTool } from '../factory.js';
const spec = {
    name: 'list_tracks',
    description: 'List tracks for an episode',
    inputSchema: {
        type: 'object',
        properties: {
            episode_id: {
                type: 'number',
                description: 'The ID of the episode',
                minimum: 1,
            },
        },
        required: ['episode_id'],
        additionalProperties: false,
    },
    method: 'GET',
    path: '/episodes/{episode_id}/tracks',
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
    successText: 'Tracks fetched successfully',
    errorText: 'Failed to fetch tracks',
};
export default createHttpTool(spec);
//# sourceMappingURL=list.js.map