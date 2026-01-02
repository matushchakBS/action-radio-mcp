import { api, serializeHttpError } from '../httpClient.js';
import { apiBaseUrl } from '../config.js';
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
export function createHttpTool(spec) {
    return {
        name: spec.name,
        description: spec.description,
        inputSchema: spec.inputSchema,
        execute: async (args) => {
            const ctx = { apiBaseUrl, input: args };
            try {
                let response;
                const { method, path } = spec;
                switch (method) {
                    case 'GET':
                        response = await api.get(path);
                        break;
                    case 'POST':
                        response = await api.post(path, args);
                        break;
                    case 'PUT':
                        response = await api.put(path, args);
                        break;
                    case 'DELETE':
                        response = await api.delete(path);
                        break;
                    case 'PATCH':
                        response = await api.patch(path, args);
                        break;
                    default:
                        throw new Error(`Unsupported HTTP method: ${method}`);
                }
                const mappedResponse = spec.mapResponse(response.data, ctx);
                const isError = spec.isError ? spec.isError(mappedResponse) : false;
                if (isError && spec.mapError) {
                    const errorResponse = spec.mapError(mappedResponse, ctx);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(errorResponse, null, 2),
                            },
                        ],
                        structuredContent: errorResponse,
                        isError: true,
                    };
                }
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(mappedResponse, null, 2),
                        },
                    ],
                    structuredContent: mappedResponse,
                    isError,
                };
            }
            catch (error) {
                if (spec.mapError) {
                    const errorResponse = spec.mapError(error, ctx);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(errorResponse, null, 2),
                            },
                        ],
                        structuredContent: errorResponse,
                        isError: true,
                    };
                }
                return structuredError(spec.name, error);
            }
        },
    };
}
//# sourceMappingURL=factory.js.map