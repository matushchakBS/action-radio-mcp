import { createHttpTool } from '../factory.js';
const spec = {
    name: 'delete_placement',
    description: 'Delete placement',
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
        },
        required: ['id', 'track_id', 'placement_id'],
        additionalProperties: false,
    },
    method: 'DELETE',
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
    successText: 'Placement deleted successfully',
    errorText: 'Failed to delete placement',
};
export default createHttpTool(spec);
//# sourceMappingURL=delete.js.map