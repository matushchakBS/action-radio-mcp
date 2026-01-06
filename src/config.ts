import 'dotenv/config';

// Get the API path from env
export const apiPath = process.env.EPISODE_MANAGER_API_PATH || '/api/episode-manager';

// Get the host from env (optional)
export const apiHost = process.env.EPISODE_MANAGER_API_HOST;

// For relative API calls on the same domain, just use the path
// This assumes your API is hosted on the same domain as the MCP server
export const apiBaseUrl = apiHost
  ? `${apiHost.endsWith('/') ? apiHost.slice(0, -1) : apiHost}${apiPath.startsWith('/') ? apiPath : `/${apiPath}`}`
  : apiPath; // Use just the path - axios will make requests to the same origin

export const httpTimeoutMs = Number(process.env.MCP_HTTP_TIMEOUT_MS ?? '10000');

// Support both new names (MCP_HTTP_*) and legacy aliases (MCP_*)
export const serverPort = Number(
    process.env.PORT ??                    // ⬅️ Cloud Run injects this
    process.env.MCP_HTTP_PORT ??
    process.env.MCP_PORT ??
    '8080'
);
export const serverHost =
  process.env.MCP_HTTP_HOST ?? process.env.MCP_HOST ?? '0.0.0.0';
export const serverPath = process.env.MCP_HTTP_PATH ?? '/mcp';

