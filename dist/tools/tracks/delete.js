import { createHttpTool } from '../factory.js';
const spec = {
    name: 'delete_track',
    description: 'Delete track',
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
    method: 'DELETE',
    path: '/episodes/{episode_id}/tracks/{track_id}',
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
    successText: 'Track deleted successfully',
    errorText: 'Failed to delete track',
};
export default createHttpTool(spec);
//# sourceMappingURL=delete.js.map