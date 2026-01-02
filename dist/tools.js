import { api } from './httpClient.js';
import { apiBaseUrl } from './config.js';
import { serializeHttpError } from './httpClient.js';
const structuredError = (tool, error) => ({
    content: [
        {
            type: 'text',
            text: `${tool} failed`,
        },
    ],
    structuredContent: {
        ok: false,
        tool,
        error: serializeHttpError(error),
        timestamp: new Date().toISOString(),
    },
    isError: true,
});
const healthTool = {
    name: 'health',
    description: 'Health check for the EpisodeManager API',
    inputSchema: { type: 'object', properties: {} },
    execute: async () => {
        try {
            const response = await api.get('/health');
            return {
                content: [
                    {
                        type: 'text',
                        text: 'EpisodeManager API is reachable',
                    },
                ],
                structuredContent: {
                    ok: true,
                    apiBaseUrl,
                    response: response.data,
                    checkedAt: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            return structuredError('health', error);
        }
    },
};
const listEpisodesTool = {
    name: 'list_episodes',
    description: 'List episodes with their metadata and IDs.',
    inputSchema: { type: 'object', properties: {} },
    execute: async () => {
        try {
            const response = await api.get('/episodes');
            return {
                content: [
                    {
                        type: 'text',
                        text: 'Episodes fetched',
                    },
                ],
                structuredContent: response.data,
            };
        }
        catch (error) {
            return structuredError('list_episodes', error);
        }
    },
};
export const tools = [healthTool, listEpisodesTool];
export const toolsByName = new Map(tools.map((tool) => [tool.name, tool]));
//# sourceMappingURL=tools.js.map