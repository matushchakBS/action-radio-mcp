import 'dotenv/config';
const normalizeBaseUrl = (value) => {
    if (!value)
        return undefined;
    return value.endsWith('/') ? value.slice(0, -1) : value;
};
export const apiBaseUrl = normalizeBaseUrl(process.env.EPISODE_MANAGER_API_URL) ??
    'http://localhost:8000/api/episode-manager';
export const httpTimeoutMs = Number(process.env.MCP_HTTP_TIMEOUT_MS ?? '10000');
export const serverPort = Number(process.env.MCP_HTTP_PORT ?? process.env.MCP_PORT ?? '1307');
export const serverHost = process.env.MCP_HTTP_HOST ?? process.env.MCP_HOST ?? '0.0.0.0';
export const serverPath = process.env.MCP_HTTP_PATH ?? '/mcp';
//# sourceMappingURL=config.js.map