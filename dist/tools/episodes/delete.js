import { createHttpTool } from '../factory.js';
const spec = {
    name: 'delete_episode',
    description: 'Delete an episode',
    inputSchema: {
        type: 'object',
        properties: {
            episode_id: {
                type: 'number',
                description: 'The ID of the episode to delete',
                minimum: 1,
            },
        },
        required: ['episode_id'],
        additionalProperties: false,
    },
    method: 'DELETE',
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
    successText: 'Episode deleted successfully',
    errorText: 'Failed to delete episode',
};
export default createHttpTool(spec);
//# sourceMappingURL=delete.js.map