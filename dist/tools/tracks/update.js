import { createHttpTool } from '../factory.js';
const spec = {
    name: 'update_track',
    description: 'Update track',
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
            type: {
                type: 'string',
                description: 'Track type',
                enum: ['video', 'audio', 'subtitle'],
            },
            description: {
                type: 'string',
                description: 'Track description',
                maxLength: 1000,
            },
            metadata: {
                type: 'object',
                description: 'Additional metadata for the track',
            },
        },
        required: ['episode_id', 'track_id'],
        additionalProperties: false,
    },
    method: 'PUT',
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
    successText: 'Track updated successfully',
    errorText: 'Failed to update track',
};
export default createHttpTool(spec);
//# sourceMappingURL=update.js.map