import { createHttpTool } from '../factory.js';
const spec = {
    name: 'create_episode',
    description: 'Create a new episode in the Episode Manager',
    inputSchema: {
        type: 'object',
        properties: {
            system_name: {
                type: 'string',
                description: 'System name/identifier for the episode',
                minLength: 1,
                maxLength: 100,
            },
            title: {
                type: 'string',
                description: 'Episode title',
                minLength: 1,
                maxLength: 200,
            },
            description: {
                type: 'string',
                description: 'Episode description',
                maxLength: 1000,
            },
            music_brief: {
                type: 'string',
                description: 'Brief description for music requirements',
                maxLength: 500,
            },
            voice_brief: {
                type: 'string',
                description: 'Brief description for voice requirements',
                maxLength: 500,
            },
            video_brief: {
                type: 'string',
                description: 'Brief description for video requirements',
                maxLength: 500,
            },
        },
        required: ['system_name', 'title'],
        additionalProperties: false,
    },
    method: 'POST',
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
    successText: 'Episode created successfully',
    errorText: 'Failed to create episode',
};
export default createHttpTool(spec);
//# sourceMappingURL=create.js.map