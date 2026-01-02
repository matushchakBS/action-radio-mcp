import { createHttpTool } from '../factory.js';
const spec = {
    name: 'update_placement',
    description: 'Update placement',
    inputSchema: {
        type: 'object',
        properties: {
            id: {
                type: 'number',
                description: 'The ID of the episode',
                minimum: 1,
            },
            track_id: {
                type: 'number',
                description: 'The ID of the track',
                minimum: 1,
            },
            placement_id: {
                type: 'number',
                description: 'The ID of the placement',
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
        required: ['id', 'track_id', 'placement_id'],
        additionalProperties: false,
    },
    method: 'PUT',
    path: '/episodes/{id}/tracks/{track_id}/placements/{placement_id}',
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
    successText: 'Placement updated successfully',
    errorText: 'Failed to update placement',
};
export default createHttpTool(spec);
//# sourceMappingURL=update.js.map