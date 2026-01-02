import { createHttpTool } from '../factory.js';
const spec = {
    name: 'create_placement',
    description: 'Create a placement for a track',
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
            asset_id: {
                type: 'number',
                description: 'References an Asset Template',
                minimum: 1,
            },
            planned_duration: {
                type: 'number',
                description: 'Approximate time length in seconds',
                minimum: 0,
            },
            metadata: {
                type: 'object',
                description: 'Additional metadata for the placement',
            },
        },
        required: ['episode_id', 'track_id', 'asset_id', 'planned_duration'],
        additionalProperties: false,
    },
    method: 'POST',
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
    successText: 'Placement created successfully',
    errorText: 'Failed to create placement',
};
export default createHttpTool(spec);
//# sourceMappingURL=create.js.map