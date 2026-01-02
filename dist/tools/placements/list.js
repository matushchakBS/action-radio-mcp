import { createHttpTool } from '../factory.js';
const spec = {
    name: 'list_placements',
    description: 'List placements for a track',
    inputSchema: {
        type: 'object',
        properties: {
            episode_id: {
                type: 'number',
                description: 'The ID of the episode',
                minimum: 1,
            },
            track_id: {
                type: 'number',
                description: 'The ID of the track',
                minimum: 1,
            },
        },
        required: ['episode_id', 'track_id'],
        additionalProperties: false,
    },
    method: 'GET',
    path: '/episodes/{episode_id}/tracks/{track_id}/placements',
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
    successText: 'Placements fetched successfully',
    errorText: 'Failed to fetch placements',
};
export default createHttpTool(spec);
//# sourceMappingURL=list.js.map