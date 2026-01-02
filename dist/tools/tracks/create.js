import { createHttpTool } from '../factory.js';
const spec = {
    name: 'create_track',
    description: 'Create a track for an episode',
    inputSchema: {
        type: 'object',
        properties: {
            episode_id: {
                type: 'number',
                description: 'The ID of the episode',
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
        required: ['episode_id', 'type'],
        additionalProperties: false,
    },
    method: 'POST',
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
    successText: 'Track created successfully',
    errorText: 'Failed to create track',
};
export default createHttpTool(spec);
//# sourceMappingURL=create.js.map